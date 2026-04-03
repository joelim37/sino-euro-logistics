import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are missing");
  }

  return createClient(url, key);
}

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      company,
      phone,
      email,
      origin,
      destination,
      service_type,
      cargo_name,
      hs_code,
      package_type,
      package_type_other,
      dimensions,
      weight,
      transport_mode,
      delivery_mode,
      notes,
    } = body;

    if (!name || !email || !destination) {
      return NextResponse.json(
        { error: "请填写必填字段" },
        { status: 400 }
      );
    }

    const finalPackageType = package_type === "其他"
      ? [package_type, package_type_other].filter(Boolean).join("：")
      : package_type || null;

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("inquiries")
      .insert({
        name,
        company,
        phone: phone || null,
        email,
        origin,
        destination,
        service_type,
        cargo_name,
        hs_code,
        package_type: finalPackageType,
        dimensions,
        weight,
        transport_mode,
        delivery_mode,
        notes,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: `保存失败，请稍后重试（${error.message}）` },
        { status: 500 }
      );
    }

    const { data: configData } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "company_email")
      .single();

    const adminEmail = configData?.value || "info@sinoeuro.com";

    try {
      const resend = getResend();
      if (resend) {
        await resend.emails.send({
          from: "中欧通联 <noreply@sinoeuro.com>",
          to: [adminEmail],
          subject: `新询价 — ${company || name} — ${destination}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
              <h2 style="color: #0D2545;">新询价通知</h2>
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">姓名</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">公司</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${company || "-"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">电话</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${phone || "-"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">邮箱</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">货物起点</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${origin || "-"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">目的地</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${destination}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">运输方式</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${service_type || "-"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">货物品名</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${cargo_name || "-"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">海关编码</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${hs_code || "-"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">包装类型</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${finalPackageType || "-"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">箱子尺寸</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${dimensions || "-"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">箱子重量</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${weight || "-"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">运输类型</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${transport_mode || "-"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">交付方式</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${delivery_mode || "-"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">备注</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${notes || "-"}</td>
                </tr>
              </table>
              <p style="margin-top: 20px; color: #666;">请尽快处理此询价。</p>
            </div>
          `,
        });
      }
    } catch (emailError) {
      console.error("Email error:", emailError);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "服务器错误，请稍后重试" },
      { status: 500 }
    );
  }
}
