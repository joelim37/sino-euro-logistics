import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

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
      notes,
    } = body;

    // 验证必填字段
    if (!name || !email || !destination) {
      return NextResponse.json(
        { error: "请填写必填字段" },
        { status: 400 }
      );
    }

    // 保存到数据库
    const { data, error } = await supabase
      .from("inquiries")
      .insert({
        name,
        company,
        phone,
        email,
        origin,
        destination,
        service_type,
        notes,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "保存失败，请稍后重试" },
        { status: 500 }
      );
    }

    // 获取管理员邮箱
    const { data: configData } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "company_email")
      .single();

    const adminEmail = configData?.value || "info@sinoeuro.com";

    // 发送邮件通知
    try {
      await resend.emails.send({
        from: "中欧通联 <noreply@sinoeuro.com>",
        to: [adminEmail],
        subject: `新询价 — ${company || name} — ${destination}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
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
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">备注</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${notes || "-"}</td>
              </tr>
            </table>
            <p style="margin-top: 20px; color: #666;">请尽快处理此询价。</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Email error:", emailError);
      // 邮件发送失败不影响主流程
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "服务器错误，请稍后重试" },
      { status: 500 }
    );
  }
}
