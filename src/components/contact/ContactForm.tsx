"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Send, CheckCircle, Upload, Paperclip, Plus, Trash2 } from "lucide-react";
import { trackEvent } from "@/lib/tracking";

interface ContactFormProps {
  transportOptions?: string[];
}

interface PackageRow {
  length: string;
  width: string;
  height: string;
  quantity: string;
  weight: string;
}

interface UploadedFile {
  name: string;
  path: string;
  url: string;
  type: string;
  size: number;
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string | number;
      reset: (widgetId?: string | number) => void;
    };
  }
}

const fallbackTransportOptions = [
  "中欧班列",
  "卡航快递",
  "海运整拼柜",
  "派送到门",
  "项目货物运输",
  "欧盟清关",
  "其他",
];

const packageTypes = ["纸箱", "托盘", "木箱", "裸装", "其他"];
const transportModes = ["整柜", "拼箱"];
const deliveryModes = ["到港", "门到门"];

const emptyPackageRow = (): PackageRow => ({
  length: "",
  width: "",
  height: "",
  quantity: "",
  weight: "",
});

function toNumber(value: string) {
  const parsed = Number(String(value).replace(/,/g, "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function ContactForm({ transportOptions = [] }: ContactFormProps) {
  const serviceTypes = useMemo(() => {
    const options = transportOptions.length > 0 ? transportOptions : fallbackTransportOptions;
    return [{ value: "", label: "请选择运输方式" }, ...options.map((item) => ({ value: item, label: item }))];
  }, [transportOptions]);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    origin: "",
    destination: "",
    service_type: "",
    cargo_name: "",
    hs_code: "",
    package_type: "",
    package_type_other: "",
    transport_mode: "",
    delivery_mode: "",
    notes: "",
  });
  const [packageRows, setPackageRows] = useState<PackageRow[]>([emptyPackageRow()]);
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
  const turnstileEnabled = Boolean(turnstileSiteKey);
  const [attachments, setAttachments] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaReady, setCaptchaReady] = useState(!turnstileEnabled);
  const [captchaRendered, setCaptchaRendered] = useState(false);
  const widgetContainerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | number | null>(null);
  const formLoadedAtRef = useRef(Date.now());

  const totals = useMemo(() => {
    return packageRows.reduce(
      (acc, row) => {
        const length = toNumber(row.length);
        const width = toNumber(row.width);
        const height = toNumber(row.height);
        const quantity = toNumber(row.quantity);
        const unitWeight = toNumber(row.weight);

        acc.totalQuantity += quantity;
        if (length && width && height && quantity) {
          acc.totalVolumeCbm += (length * width * height * quantity) / 1000000;
        }
        if (unitWeight && quantity) {
          acc.totalWeightKg += unitWeight * quantity;
        }
        return acc;
      },
      { totalQuantity: 0, totalVolumeCbm: 0, totalWeightKg: 0 }
    );
  }, [packageRows]);

  useEffect(() => {
    formLoadedAtRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!turnstileEnabled) {
      setCaptchaReady(true);
      return;
    }

    let cancelled = false;

    const renderWidget = () => {
      if (!widgetContainerRef.current || !window.turnstile || captchaRendered) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(widgetContainerRef.current, {
        sitekey: turnstileSiteKey,
        theme: "auto",
        callback: (token: string) => {
          setCaptchaToken(token);
          setError("");
        },
        "expired-callback": () => setCaptchaToken(""),
        "error-callback": () => setCaptchaToken(""),
      });

      setCaptchaReady(true);
      setCaptchaRendered(true);
    };

    if (window.turnstile) {
      renderWidget();
      return;
    }

    const existingScript = document.querySelector('script[data-turnstile="true"]') as HTMLScriptElement | null;
    const script = existingScript || document.createElement("script");

    if (!existingScript) {
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.setAttribute("data-turnstile", "true");
      document.head.appendChild(script);
    }

    const handleLoad = () => {
      if (!cancelled) {
        renderWidget();
      }
    };

    script.addEventListener("load", handleLoad);

    return () => {
      cancelled = true;
      script.removeEventListener("load", handleLoad);
    };
  }, [captchaRendered, turnstileEnabled, turnstileSiteKey]);

  const resetCaptcha = () => {
    setCaptchaToken("");
    if (turnstileEnabled && window.turnstile && widgetIdRef.current !== null) {
      window.turnstile.reset(widgetIdRef.current);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePackageChange = (index: number, field: keyof PackageRow, value: string) => {
    setPackageRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const addPackageRow = () => {
    setPackageRows((prev) => [...prev, emptyPackageRow()]);
  };

  const removePackageRow = (index: number) => {
    setPackageRows((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setError("");

    try {
      const uploaded: UploadedFile[] = [];
      for (const file of files) {
        const form = new FormData();
        form.append("file", file);

        const response = await fetch("/api/inquiry-upload", {
          method: "POST",
          body: form,
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || `附件 ${file.name} 上传失败`);
        }
        uploaded.push(data.file);
      }

      setAttachments((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "附件上传失败");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const removeAttachment = (path: string) => {
    setAttachments((prev) => prev.filter((item) => item.path !== path));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const validPackages = packageRows.filter((row) =>
        row.length || row.width || row.height || row.quantity || row.weight
      );

      if (turnstileEnabled && !captchaReady) {
        throw new Error("安全验证尚未加载完成，请稍后再试");
      }

      if (turnstileEnabled && !captchaToken) {
        throw new Error("请先完成人机验证");
      }

      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          website: "",
          captchaToken,
          formLoadedAt: formLoadedAtRef.current,
          package_rows: validPackages,
          attachments,
          totals,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "提交失败，请稍后重试");
      }

      trackEvent("generate_lead", {
        form_name: "contact_inquiry",
        service_type: formData.service_type || "unspecified",
        destination: formData.destination || "unspecified",
        transport_mode: formData.transport_mode || "unspecified",
        delivery_mode: formData.delivery_mode || "unspecified",
        attachment_count: attachments.length,
      });
      setSubmitSuccess(true);
      setFormData({
        name: "",
        company: "",
        phone: "",
        email: "",
        origin: "",
        destination: "",
        service_type: "",
        cargo_name: "",
        hs_code: "",
        package_type: "",
        package_type_other: "",
        transport_mode: "",
        delivery_mode: "",
        notes: "",
      });
      setPackageRows([emptyPackageRow()]);
      setAttachments([]);
      resetCaptcha();
    } catch (err) {
      setError(err instanceof Error ? err.message : "提交失败，请稍后重试");
      resetCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-serif text-navy font-bold mb-2">提交成功！</h3>
        <p className="text-gray-600 mb-6">感谢您的询价，我们的专业团队将尽快与您联系</p>
        <button onClick={() => setSubmitSuccess(false)} className="btn-secondary">
          再次提交
        </button>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-serif text-navy font-bold mb-2">在线询价</h2>
      <p className="text-sm text-gray-500 mb-6">留下起运地、目的地和货物信息，我们会尽快给你运输建议和报价方向。</p>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value=""
            onChange={() => undefined}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">姓名 <span className="text-red-500">*</span></label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-field" placeholder="请输入您的姓名" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">公司名称</label>
            <input type="text" name="company" value={formData.company} onChange={handleChange} className="input-field" placeholder="请输入公司名称" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="请输入您的电话（选填）" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">邮箱 <span className="text-red-500">*</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field" placeholder="请输入您的邮箱" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">货物起点</label>
            <input type="text" name="origin" value={formData.origin} onChange={handleChange} className="input-field" placeholder="例如：中国广州" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">目的地 <span className="text-red-500">*</span></label>
            <input type="text" name="destination" value={formData.destination} onChange={handleChange} required className="input-field" placeholder="例如：德国柏林" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">运输方式</label>
          <select name="service_type" value={formData.service_type} onChange={handleChange} className="input-field">
            {serviceTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">货物品名</label>
            <input type="text" name="cargo_name" value={formData.cargo_name} onChange={handleChange} className="input-field" placeholder="例如：家具、灯具、机械配件" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">海关编码</label>
            <input type="text" name="hs_code" value={formData.hs_code} onChange={handleChange} className="input-field" placeholder="例如：9403609990" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">包装类型</label>
            <select name="package_type" value={formData.package_type} onChange={handleChange} className="input-field">
              <option value="">请选择包装类型</option>
              {packageTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">运输类型</label>
            <select name="transport_mode" value={formData.transport_mode} onChange={handleChange} className="input-field">
              <option value="">请选择运输类型</option>
              {transportModes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {formData.package_type === "其他" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">其他包装类型说明</label>
            <input type="text" name="package_type_other" value={formData.package_type_other} onChange={handleChange} className="input-field" placeholder="请填写具体包装类型" />
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">包装尺寸 / 包装重量（多尺寸模式）</label>
            <button type="button" onClick={addPackageRow} className="inline-flex items-center gap-1 text-sm text-gold hover:underline">
              <Plus className="w-4 h-4" /> 新增一组尺寸
            </button>
          </div>
          <div className="space-y-3">
            {packageRows.map((row, index) => (
              <div key={index} className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-navy">第 {index + 1} 组包装</p>
                  {packageRows.length > 1 && (
                    <button type="button" onClick={() => removePackageRow(index)} className="inline-flex items-center gap-1 text-sm text-red-600 hover:underline">
                      <Trash2 className="w-4 h-4" /> 删除
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <input type="text" value={row.length} onChange={(e) => handlePackageChange(index, "length", e.target.value)} className="input-field" placeholder="长(cm)" />
                  <input type="text" value={row.width} onChange={(e) => handlePackageChange(index, "width", e.target.value)} className="input-field" placeholder="宽(cm)" />
                  <input type="text" value={row.height} onChange={(e) => handlePackageChange(index, "height", e.target.value)} className="input-field" placeholder="高(cm)" />
                  <input type="text" value={row.quantity} onChange={(e) => handlePackageChange(index, "quantity", e.target.value)} className="input-field" placeholder="件数" />
                  <input type="text" value={row.weight} onChange={(e) => handlePackageChange(index, "weight", e.target.value)} className="input-field" placeholder="单件重量(kg)" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl bg-bg border border-gray-200 p-4 text-sm">
            <p className="font-medium text-navy mb-3">自动汇总</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-lg bg-white px-3 py-3 border border-gray-100">
                <p className="text-gray-500 text-xs mb-1">总件数</p>
                <p className="text-navy font-semibold">{totals.totalQuantity || 0}</p>
              </div>
              <div className="rounded-lg bg-white px-3 py-3 border border-gray-100">
                <p className="text-gray-500 text-xs mb-1">总体积（CBM）</p>
                <p className="text-navy font-semibold">{totals.totalVolumeCbm.toFixed(3)}</p>
              </div>
              <div className="rounded-lg bg-white px-3 py-3 border border-gray-100">
                <p className="text-gray-500 text-xs mb-1">总重量（KG）</p>
                <p className="text-navy font-semibold">{totals.totalWeightKg.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">交付方式</label>
          <select name="delivery_mode" value={formData.delivery_mode} onChange={handleChange} className="input-field">
            <option value="">请选择交付方式</option>
            {deliveryModes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">附件上传</label>
          <label className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 cursor-pointer hover:bg-gray-50">
            <Upload className="w-4 h-4" />
            <span>{isUploading ? "上传中..." : "上传装箱单 / 产品照片 / 参考文件"}</span>
            <input type="file" multiple onChange={handleFileUpload} className="hidden" accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.xls,.xlsx" />
          </label>
          <p className="mt-2 text-xs text-gray-500">支持图片、PDF、Word、Excel，单个文件不超过 10MB。</p>

          {attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {attachments.map((file) => (
                <div key={file.path} className="flex items-center justify-between gap-3 rounded-lg bg-bg px-3 py-2 text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <Paperclip className="w-4 h-4 text-gray-500" />
                    <a href={file.url} target="_blank" rel="noreferrer" className="truncate text-navy hover:underline">
                      {file.name}
                    </a>
                  </div>
                  <button type="button" onClick={() => removeAttachment(file.path)} className="text-red-600 hover:underline">删除</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} className="input-field resize-none" placeholder="请补充时效要求、是否入仓、发货时间、特殊要求等" />
        </div>

        <div className="rounded-xl bg-bg p-4 text-sm text-gray-600">
          常见高效询盘内容：货物品名、HS 编码、件数、包装类型、多组尺寸重量、整柜/拼箱、到港/门到门、附件资料、目的地和希望到货时间。
        </div>

        {turnstileEnabled && (
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="mb-2 text-sm font-medium text-gray-700">人机验证</p>
            <div ref={widgetContainerRef} className="min-h-[65px] overflow-hidden" />
            {!captchaReady && <p className="mt-2 text-xs text-gray-500">安全验证加载中...</p>}
            <p className="mt-2 text-xs text-gray-500">请先完成人机验证，再提交询价。</p>
          </div>
        )}

        <button type="submit" disabled={isSubmitting || isUploading} className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50">
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>提交中...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>提交询价</span>
            </>
          )}
        </button>
      </form>
    </>
  );
}
