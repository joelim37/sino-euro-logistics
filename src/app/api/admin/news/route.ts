import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are missing");
  }

  return createClient(url, key);
}

async function ensureNewsTable() {
  const supabase = getSupabase();
  const { error } = await supabase.from("news").select("id").limit(1);
  if (!error) return;

  return NextResponse.json(
    {
      error: "news 表不存在，请先在 Supabase 执行建表 SQL。",
      sql: `create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  summary text,
  content text,
  featured_image text,
  seo_title text,
  seo_description text,
  seo_keywords text,
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table news enable row level security;
create policy if not exists "news_public_read" on news for select to anon using (status = 'published');
create policy if not exists "news_auth_all" on news for all to authenticated using (true) with check (true);`
    },
    { status: 500 }
  );
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const ensured = await ensureNewsTable();
    if (ensured) return ensured;

    const supabase = getSupabase();
    const [{ data, error }, { data: configRows, error: configError }] = await Promise.all([
      supabase
        .from("news")
        .select("*")
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false }),
      supabase.from("site_config").select("key, value"),
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (configError) {
      return NextResponse.json({ error: configError.message }, { status: 500 });
    }

    const configMap = Object.fromEntries((configRows || []).map((item) => [item.key, item.value]));
    const topIds = (configMap.home_news_top_ids || "").split(",").map((item: string) => item.trim()).filter(Boolean);
    const topSet = new Set(topIds);
    const news = (data || []).map((item) => ({
      ...item,
      is_top: topSet.has(item.id),
      featured_image_position: configMap[`news_cover_focus:${item.slug}`] || "center center",
    }));

    return NextResponse.json({ news });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "服务器错误" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const ensured = await ensureNewsTable();
    if (ensured) return ensured;

    const supabase = getSupabase();
    const body = await request.json();
    const payload = {
      title: body.title,
      slug: body.slug,
      summary: body.summary || "",
      content: body.content || "",
      featured_image: body.featured_image || "",
      featured_image_alt: body.featured_image_alt || "",
      og_image: body.og_image || "",
      seo_title: body.seo_title || "",
      seo_description: body.seo_description || "",
      seo_keywords: body.seo_keywords || "",
      status: body.status || "draft",
      published_at: body.status === "published" ? (body.published_at || new Date().toISOString()) : null,
      updated_at: new Date().toISOString(),
    };

    if (body.id) {
      const { error } = await supabase.from("news").update(payload).eq("id", body.id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      revalidatePath("/");
      revalidatePath("/news");
      revalidatePath(`/news/${body.slug}`);
      revalidatePath(`/news/preview/${body.id}`);

      return NextResponse.json({ success: true, id: body.id, slug: body.slug, status: payload.status, previewUrl: `/news/preview/${body.id}`, publishedUrl: `/news/${body.slug}` });
    }

    const { data, error } = await supabase.from("news").insert(payload).select("id, slug").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    revalidatePath("/");
    revalidatePath("/news");
    revalidatePath(`/news/${data.slug}`);
    revalidatePath(`/news/preview/${data.id}`);

    return NextResponse.json({ success: true, id: data.id, slug: data.slug, status: payload.status, previewUrl: `/news/preview/${data.id}`, publishedUrl: `/news/${data.slug}` });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "服务器错误" }, { status: 500 });
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
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "缺少ID" }, { status: 400 });
    }

    const { error } = await supabase.from("news").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "服务器错误" }, { status: 500 });
  }
}
