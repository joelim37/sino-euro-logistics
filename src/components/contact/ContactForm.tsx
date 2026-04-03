"use client";

import { useMemo, useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { trackEvent } from "@/lib/tracking";

interface ContactFormProps {
  transportOptions?: string[];
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
    dimensions: "",
    weight: "",
    transport_mode: "",
    delivery_mode: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
        dimensions: "",
        weight: "",
        transport_mode: "",
        delivery_mode: "",
        notes: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "提交失败，请稍后重试");
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

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">箱子尺寸</label>
            <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} className="input-field" placeholder="例如：120×80×100cm / 10箱" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">箱子重量</label>
            <input type="text" name="weight" value={formData.weight} onChange={handleChange} className="input-field" placeholder="例如：800kg / 80kg每箱" />
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
          <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} className="input-field resize-none" placeholder="请补充时效要求、是否入仓、发货时间、特殊要求等" />
        </div>

        <div className="rounded-xl bg-bg p-4 text-sm text-gray-600">
          常见高效询盘内容：货物品名、HS 编码、件数、包装类型、单箱尺寸重量、整柜/拼箱、到港/门到门、目的地和希望到货时间。
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50">
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
