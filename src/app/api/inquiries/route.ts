import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 3;
const MIN_FORM_FILL_MS = 3000;
const ipRequestLog = new Map<string, number[]>();

interface PackageRow {
  length?: string;
  width?: string;
  height?: string;
  quantity?: string;
  weight?: string;
}

interface UploadedFile {
  name: string;
  path: string;
  url: string;
  type?: string;
  size?: number;
}

interface Totals {
  totalQuantity?: number;
  totalVolumeCbm?: number;
  totalWeightKg?: number;
}

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

function formatPackageRows(rows: PackageRow[]) {
  return rows
    .filter((row) => row.length || row.width || row.height || row.quantity || row.weight)
    .map((row, index) => {
      const size = [row.length, row.width, row.height].filter(Boolean).join(" × ");
      const qty = row.quantity ? `${row.quantity}件` : "件数未填";
      const weight = row.weight ? `${row.weight}kg/件` : "单件重量未填";
      return `第${index + 1}组：${size || "尺寸未填"} / ${qty} / ${weight}`;
    })
    .join("\n");
}

function formatAttachmentList(files: UploadedFile[]) {
  return files
    .filter((file) => file?.url)
    .map((file, index) => `${index + 1}. ${file.name} - ${file.url}`)
    .join("\n");
}

function formatTotals(totals?: Totals) {
  if (!totals) return "";
  return [
    `总件数：${totals.totalQuantity || 0}`,
    `总体积：${(totals.totalVolumeCbm || 0).toFixed(3)} CBM`,
    `总重量：${(totals.totalWeightKg || 0).toFixed(2)} KG`,
  ].join("\n");
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
      transport_mode,
      delivery_mode,
      notes,
      website,
      captchaToken,
      formLoadedAt,
      package_rows = [],
      attachments = [],
      totals,
    } = body as {
      name: string;
      company?: string;
      phone?: string;
      email: string;
      origin?: string;
      destination: string;
      service_type?: string;
      cargo_name?: string;
      hs_code?: string;
      package_type?: string;
      package_type_other?: string;
      transport_mode?: string;
      delivery_mode?: string;
      notes?: string;
      website?: string;
      captchaToken?: string;
      formLoadedAt?: number;
      package_rows?: PackageRow[];
      attachments?: UploadedFile[];
      totals?: Totals;
    };

    const clientIp = getClientIp(request);
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

    if (website) {
      return NextResponse.json({ success: true, skipped: true });
    }

    if (!name || !email || !destination) {
      return NextResponse.json(
        { error: "请填写必填字段" },
        { status: 400 }
      );
    }

    if (!isFormFillDelayValid(formLoadedAt)) {
      return NextResponse.json(
        { error: "提交过快，请稍后重试" },
        { status: 400 }
      );
    }

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "提交过于频繁，请稍后再试" },
        { status: 429 }
      );
    }

    if (turnstileSecret) {
      if (!captchaToken) {
        return NextResponse.json(
          { error: "请先完成人机验证" },
          { status: 400 }
        );
      }

      const captchaResult = await verifyTurnstileToken({
        token: captchaToken,
        ip: clientIp,
        secret: turnstileSecret,
      });

      if (!captchaResult.success) {
        return NextResponse.json(
          { error: "安全验证失败，请重试", details: captchaResult["error-codes"] || [] },
          { status: 400 }
        );
      }
    }

    recordRequest(clientIp);

    const finalPackageType = package_type === "其他"
      ? [package_type, package_type_other].filter(Boolean).join("：")
      : package_type || null;
    const dimensionsText = formatPackageRows(package_rows);
    const totalWeightText = package_rows
      .filter((row) => row.weight)
      .map((row, index) => `第${index + 1}组：${row.weight}kg/件`)
      .join("\n");
    const attachmentText = formatAttachmentList(attachments);
    const totalsText = formatTotals(totals);
    const finalNotes = [notes, totalsText].filter(Boolean).join("\n\n");

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
        dimensions: dimensionsText || null,
        weight: totalWeightText || null,
        transport_mode,
        delivery_mode,
        attachment_urls: attachmentText || null,
        notes: finalNotes || null,
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

    const { data: configRows } = await supabase
      .from("site_config")
      .select("key, value")
      .in("key", ["company_email", "inquiry_notice_email", "inquiry_notice_from_email"]);

    const configMap = Object.fromEntries((configRows || []).map((item) => [item.key, item.value]));
    const adminEmail = configMap.inquiry_notice_email || configMap.company_email || "info@sinoeuro.com";
    const fromEmail = configMap.inquiry_notice_from_email || "onboarding@resend.dev";

    let mailStatus: "sent" | "skipped" | "failed" = "skipped";
    let mailError = "";

    try {
      const resend = getResend();
      if (!resend) {
        mailStatus = "failed";
        mailError = "缺少 RESEND_API_KEY 环境变量";
      } else {
        const result = await resend.emails.send({
          from: `询价通知 <${fromEmail}>`,
          to: [adminEmail],
          subject: `新询价 — ${company || name} — ${destination}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 760px; margin: 0 auto;">
              <h2 style="color: #0D2545;">新询价通知</h2>
              <p style="color: #666;">系统已收到一条新的在线询价，请尽快跟进。</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">姓名</td><td style="padding: 10px; border: 1px solid #ddd;">${name}</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">公司</td><td style="padding: 10px; border: 1px solid #ddd;">${company || "-"}</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">电话</td><td style="padding: 10px; border: 1px solid #ddd;">${phone || "-"}</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">邮箱</td><td style="padding: 10px; border: 1px solid #ddd;">${email}</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">货物起点</td><td style="padding: 10px; border: 1px solid #ddd;">${origin || "-"}</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">目的地</td><td style="padding: 10px; border: 1px solid #ddd;">${destination}</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">运输方式</td><td style="padding: 10px; border: 1px solid #ddd;">${service_type || "-"}</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">货物品名</td><td style="padding: 10px; border: 1px solid #ddd;">${cargo_name || "-"}</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">海关编码</td><td style="padding: 10px; border: 1px solid #ddd;">${hs_code || "-"}</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">包装类型</td><td style="padding: 10px; border: 1px solid #ddd;">${finalPackageType || "-"}</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">多尺寸包装明细</td><td style="padding: 10px; border: 1px solid #ddd; white-space: pre-line;">${dimensionsText || "-"}</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">重量明细</td><td style="padding: 10px; border: 1px solid #ddd; white-space: pre-line;">${totalWeightText || "-"}</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">自动汇总</td><td style="padding: 10px; border: 1px solid #ddd; white-space: pre-line;">${totalsText || "-"}</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">运输类型</td><td style="padding: 10px; border: 1px solid #ddd;">${transport_mode || "-"}</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">交付方式</td><td style="padding: 10px; border: 1px solid #ddd;">${delivery_mode || "-"}</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">附件</td><td style="padding: 10px; border: 1px solid #ddd; white-space: pre-line;">${attachmentText || "-"}</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">备注</td><td style="padding: 10px; border: 1px solid #ddd; white-space: pre-line;">${notes || "-"}</td></tr>
                <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">来源 IP</td><td style="padding: 10px; border: 1px solid #ddd;">${clientIp || "-"}</td></tr>
              </table>
              <p style="margin-top: 20px; color: #666;">请尽快处理此询价。</p>
            </div>
          `,
        });

        if ((result as { error?: unknown })?.error) {
          mailStatus = "failed";
          mailError = JSON.stringify((result as { error?: unknown }).error);
          console.error("Email send returned error:", (result as { error?: unknown }).error);
        } else {
          mailStatus = "sent";
        }
      }
    } catch (emailError) {
      mailStatus = "failed";
      mailError = emailError instanceof Error ? emailError.message : "邮件发送失败";
      console.error("Email error:", emailError);
    }

    return NextResponse.json({ success: true, data, mailStatus, mailError });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "服务器错误，请稍后重试" },
      { status: 500 }
    );
  }
}

async function verifyTurnstileToken({ token, ip, secret }: { token: string; ip: string; secret: string }) {
  const body = new URLSearchParams({
    secret,
    response: token,
  });

  if (ip) {
    body.append("remoteip", ip);
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  return response.json();
}

function isFormFillDelayValid(formLoadedAt?: number) {
  const loadedAt = Number(formLoadedAt);
  if (!Number.isFinite(loadedAt)) {
    return false;
  }

  return Date.now() - loadedAt >= MIN_FORM_FILL_MS;
}

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") || "";
}

function isRateLimited(ip: string) {
  if (!ip) {
    return false;
  }

  cleanupOldRequests(ip);
  const requests = ipRequestLog.get(ip) || [];
  return requests.length >= RATE_LIMIT_MAX_REQUESTS;
}

function recordRequest(ip: string) {
  if (!ip) {
    return;
  }

  cleanupOldRequests(ip);
  const requests = ipRequestLog.get(ip) || [];
  requests.push(Date.now());
  ipRequestLog.set(ip, requests);
}

function cleanupOldRequests(ip: string) {
  const requests = ipRequestLog.get(ip);
  if (!requests) {
    return;
  }

  const now = Date.now();
  const filtered = requests.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);

  if (filtered.length === 0) {
    ipRequestLog.delete(ip);
    return;
  }

  ipRequestLog.set(ip, filtered);
}
