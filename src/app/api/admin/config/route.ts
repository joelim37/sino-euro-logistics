import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - 获取配置
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const keysParam = searchParams.get("keys");

  try {
    let query = supabase.from("site_config").select("key, value");

    if (keysParam) {
      const keys = keysParam.split(",");
      query = query.in("key", keys);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const config: Record<string, string> = {};
    data?.forEach((item) => {
      config[item.key] = item.value;
    });

    return NextResponse.json({ config });
  } catch (error) {
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}

// POST - 更新配置
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // 支持批量更新
    const updates = Object.entries(body).map(([key, value]) => ({
      key,
      value: value as string,
      updated_at: new Date().toISOString(),
    }));

    for (const update of updates) {
      const { error } = await supabase
        .from("site_config")
        .upsert(update, { onConflict: "key" });

      if (error) {
        console.error("Error updating config:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}
