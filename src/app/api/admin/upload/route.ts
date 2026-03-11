import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = "site-media";

async function ensureBucket() {
  const { data } = await supabase.storage.listBuckets();
  const exists = data?.some((bucket) => bucket.name === BUCKET);
  if (!exists) {
    await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024,
    });
  }
}

async function listFiles(prefix = "") {
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
    limit: 200,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) {
    throw error;
  }

  const items: Array<{ name: string; path: string; folder: string; url: string }> = [];

  for (const item of data || []) {
    const itemPath = prefix ? `${prefix}/${item.name}` : item.name;

    const isFolder = !item.metadata;
    if (isFolder) {
      const nested = await listFiles(itemPath);
      items.push(...nested);
      continue;
    }

    const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(itemPath);
    items.push({
      name: item.name,
      path: itemPath,
      folder: itemPath.split("/")[0] || "",
      url: publicData.publicUrl,
    });
  }

  return items;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    await ensureBucket();
    const items = await listFiles("");
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "加载媒体库失败" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    await ensureBucket();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string | null) || "general";

    if (!file) {
      return NextResponse.json({ error: "请选择图片文件" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split(".").pop() || "jpg";
    const safeName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(safeName, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(safeName);

    return NextResponse.json({ success: true, url: data.publicUrl, path: safeName });
  } catch {
    return NextResponse.json({ error: "上传失败" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");
  if (!path) {
    return NextResponse.json({ error: "缺少文件路径" }, { status: 400 });
  }

  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
