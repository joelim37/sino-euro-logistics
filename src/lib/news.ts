import { createClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from "next/cache";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  featured_image: string | null;
  featured_image_alt: string | null;
  og_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export async function getPublishedNews(limit?: number) {
  noStore();

  let query = supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching news:", error);
    return [] as NewsItem[];
  }

  return (data || []) as NewsItem[];
}

export async function getNewsBySlug(slug: string) {
  noStore();

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    return null;
  }

  return data as NewsItem;
}

export async function getNewsPreviewById(id: string) {
  noStore();

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data as NewsItem;
}
