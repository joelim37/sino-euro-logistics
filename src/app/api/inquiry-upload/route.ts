import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "site-media";
const FOLDER = "inquiries";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

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
      fileSizeLimit: MAX_FILE_SIZE,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureBucket();
    const supabase = getSupabase();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "请选择附件" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "附件不能超过 10MB" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "附件格式不支持，请上传图片、PDF、Word 或 Excel 文件" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = (file.name.split(".").pop() || "bin").toLowerCase();
    const baseName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_\u4e00-\u9fa5]/g, "-")
      .slice(0, 60) || `file-${Date.now()}`;
    const safeName = `${FOLDER}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${baseName}.${ext}`;

    const { error } = await supabase.storage.from(BUCKET).upload(safeName, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(safeName);
    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        path: safeName,
        url: `${data.publicUrl}?v=${Date.now()}`,
        type: file.type,
        size: file.size,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "上传失败" },
      { status: 500 }
    );
  }
}
