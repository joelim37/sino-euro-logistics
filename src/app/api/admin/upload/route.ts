import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "site-media";
const ALLOWED_FOLDERS = ["banner", "services", "news", "news-og", "media-library", "general"];

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are missing");
  }

  return createClient(url, key);
}

async function ensureBucket() {
  const supabase = getSupabase();
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
  const supabase = getSupabase();
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
    limit: 200,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) throw error;

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

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    await ensureBucket();
    const folder = new URL(request.url).searchParams.get("folder") || "all";
    let items = await listFiles("");
    if (folder !== "all") {
      items = items.filter((item) => item.folder === folder);
    }
    return NextResponse.json({ items, folders: ALLOWED_FOLDERS });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "加载媒体库失败" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    await ensureBucket();
    const supabase = getSupabase();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folderInput = (formData.get("folder") as string | null) || "general";
    const customName = ((formData.get("name") as string | null) || "").trim();
    const folder = ALLOWED_FOLDERS.includes(folderInput) ? folderInput : "general";

    if (!file) {
      return NextResponse.json({ error: "请选择图片文件" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const baseName = customName
      ? customName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_\u4e00-\u9fa5]/g, "-")
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const safeName = `${folder}/${baseName}.${ext}`;

    const { error } = await supabase.storage.from(BUCKET).upload(safeName, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: true,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(safeName);
    return NextResponse.json({ success: true, url: data.publicUrl, path: safeName, folder });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "上传失败" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
    const body = await request.json();
    const oldPath = body.oldPath as string;
    const newName = ((body.newName as string) || "").trim();
    if (!oldPath || !newName) {
      return NextResponse.json({ error: "缺少参数" }, { status: 400 });
    }

    const folder = oldPath.split("/")[0] || "general";
    const ext = oldPath.split(".").pop() || "jpg";
    const cleanName = newName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_\u4e00-\u9fa5]/g, "-");
    const newPath = `${folder}/${cleanName}.${ext}`;

    const { error: copyError } = await supabase.storage.from(BUCKET).copy(oldPath, newPath);
    if (copyError) {
      return NextResponse.json({ error: copyError.message }, { status: 500 });
    }

    const { error: removeError } = await supabase.storage.from(BUCKET).remove([oldPath]);
    if (removeError) {
      return NextResponse.json({ error: removeError.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(newPath);
    return NextResponse.json({ success: true, path: newPath, url: data.publicUrl });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "改名失败" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
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
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "删除失败" }, { status: 500 });
  }
}
