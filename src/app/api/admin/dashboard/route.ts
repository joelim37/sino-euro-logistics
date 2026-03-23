import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
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

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const supabase = getSupabase();
    const [inquiriesResult, newsResult, servicesResult] = await Promise.all([
      supabase.from("inquiries").select("id, status, created_at, destination, service_type, name, company").order("created_at", { ascending: false }),
      supabase.from("news").select("id, status, title, published_at, created_at").order("created_at", { ascending: false }),
      supabase.from("services").select("id, is_active, name, updated_at").order("sort_order", { ascending: true }),
    ]);

    const inquiries = inquiriesResult.data || [];
    const news = newsResult.data || [];
    const services = servicesResult.data || [];
    const now = Date.now();
    const recent7d = inquiries.filter((item) => now - new Date(item.created_at).getTime() <= 7 * 24 * 60 * 60 * 1000);

    return NextResponse.json({
      stats: {
        totalInquiries: inquiries.length,
        pendingInquiries: inquiries.filter((item) => item.status === "pending").length,
        completedInquiries: inquiries.filter((item) => item.status === "completed").length,
        recent7dInquiries: recent7d.length,
        totalNews: news.length,
        publishedNews: news.filter((item) => item.status === "published").length,
        draftNews: news.filter((item) => item.status === "draft").length,
        activeServices: services.filter((item) => item.is_active).length,
      },
      recentInquiries: inquiries.slice(0, 8),
      recentNews: news.slice(0, 5),
      services: services.slice(0, 8),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "服务器错误" },
      { status: 500 }
    );
  }
}
