import { createClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from "next/cache";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are missing");
  }

  return createClient(url, key);
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  featured_image: string | null;
  featured_image_alt: string | null;
  featured_image_position?: string | null;
  og_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
  is_top?: boolean;
}

export async function getPublishedNews(limit?: number) {
  noStore();

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching news:", error);
    return [] as NewsItem[];
  }

  const articles = (data || []) as NewsItem[];
  const configKeys = [
    "home_news_top_ids",
    "home_news_rule",
    ...articles.map((item) => `news_cover_focus:${item.slug}`),
  ];

  const { data: configRows, error: configError } = await supabase
    .from("site_config")
    .select("key, value")
    .in("key", configKeys);

  if (configError) {
    console.error("Error fetching news config:", configError);
  }

  const configMap = Object.fromEntries((configRows || []).map((item) => [item.key, item.value]));
  const topIds = (configMap.home_news_top_ids || "")
    .split(",")
    .map((item: string) => item.trim())
    .filter(Boolean);
  const topSet = new Set(topIds);
  const homeNewsRule = configMap.home_news_rule || "top_then_fresh";

  const ordered = [...articles].sort((a, b) => {
    if (homeNewsRule !== "fresh_only") {
      const aTop = topSet.has(a.id) ? topIds.indexOf(a.id) : Number.POSITIVE_INFINITY;
      const bTop = topSet.has(b.id) ? topIds.indexOf(b.id) : Number.POSITIVE_INFINITY;
      if (aTop !== bTop) return aTop - bTop;
    }

    const aTime = new Date(a.published_at || a.created_at || 0).getTime();
    const bTime = new Date(b.published_at || b.created_at || 0).getTime();
    return bTime - aTime;
  });

  const enriched = ordered.map((item) => ({
    ...item,
    is_top: topSet.has(item.id),
    featured_image_position: configMap[`news_cover_focus:${item.slug}`] || item.featured_image_position || "center center",
  }));

  return typeof limit === "number" ? enriched.slice(0, limit) : enriched;
}

export async function getNewsBySlug(slug: string) {
  noStore();

  const { data, error } = await getSupabase()
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

  const { data, error } = await getSupabase()
    .from("news")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data as NewsItem;
}
