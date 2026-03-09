"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const serviceTypes = [
  { value: "", label: "请选择运输方式" },
  { value: "中欧班列", label: "中欧班列" },
  { value: "卡航快递", label: "卡航快递" },
  { value: "海运整拼柜", label: "海运整拼柜" },
  { value: "欧盟清关", label: "欧盟清关" },
  { value: "其他", label: "其他" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    origin: "",
    destination: "",
    service_type: "",
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

      setSubmitSuccess(true);
      setFormData({
        name: "",
        company: "",
        phone: "",
        email: "",
        origin: "",
        destination: "",
        service_type: "",
        notes: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "提交失败，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white font-bold mb-4">
            联系我们
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            填写以下表单，我们的专业团队将尽快与您联系
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-serif text-navy font-bold mb-6">
                联系方式
              </h2>
              <p className="text-gray-600 mb-8">
                您可以通过以下方式联系我们，或直接填写表单提交询价
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">电话</h3>
                    <p className="text-gray-600">+86 400-888-8888</p>
                    <p className="text-gray-600">+86 138 0000 0000</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">邮箱</h3>
                    <p className="text-gray-600">info@sinoeuro.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">微信</h3>
                    <p className="text-gray-600">SinoEuroLogistics</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">地址</h3>
                    <p className="text-gray-600">深圳市南山区粤海街道科技园南区</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-navy mb-2">WhatsApp</h3>
                <p className="text-gray-600">+86 138 0000 0000</p>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {submitSuccess ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-serif text-navy font-bold mb-2">
                    提交成功！
                  </h3>
                  <p className="text-gray-600 mb-6">
                    感谢您的询价，我们的专业团队将尽快与您联系
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="btn-secondary"
                  >
                    再次提交
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-serif text-navy font-bold mb-6">
                    在线询价
                  </h2>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          姓名 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="input-field"
                          placeholder="请输入您的姓名"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          公司名称
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="请输入公司名称"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          电话 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="input-field"
                          placeholder="请输入您的电话"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          邮箱 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="input-field"
                          placeholder="请输入您的邮箱"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          货物起点
                        </label>
                        <input
                          type="text"
                          name="origin"
                          value={formData.origin}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="例如：中国广州"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          目的地 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="destination"
                          value={formData.destination}
                          onChange={handleChange}
                          required
                          className="input-field"
                          placeholder="例如：德国柏林"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        运输方式
                      </label>
                      <select
                        name="service_type"
                        value={formData.service_type}
                        onChange={handleChange}
                        className="input-field"
                      >
                        {serviceTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        备注
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={4}
                        className="input-field resize-none"
                        placeholder="请描述您的货物信息（品名、重量、体积等）"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
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
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
