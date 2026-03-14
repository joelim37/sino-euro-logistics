import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/contact/ContactForm";
import { getSiteConfig } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "联系我们",
  description: "联系中欧通联国际物流，获取中欧班列、卡航快递、海运整拼柜、派送到门、项目货物运输及欧盟清关方案报价。",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const config = await getSiteConfig();

  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "联系我们",
    url: "https://sinoeurologistics-atpr.vercel.app/contact",
    mainEntity: {
      "@type": "Organization",
      name: config.company_name || "中欧通联国际物流有限公司",
      alternateName: config.company_name_en || "Sino Euro Logistics",
      email: config.company_email || undefined,
      telephone: config.company_phone || undefined,
      contactPoint: [
        config.company_phone ? { "@type": "ContactPoint", telephone: config.company_phone, contactType: "sales" } : null,
        config.company_email ? { "@type": "ContactPoint", email: config.company_email, contactType: "customer support" } : null,
      ].filter(Boolean),
      address: config.company_address
        ? { "@type": "PostalAddress", streetAddress: config.company_address, addressCountry: "CN" }
        : undefined,
      areaServed: ["Europe", "Germany", "Poland", "France"],
    },
  };

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }} />
      <Navbar />

      <section className="relative pt-24 pb-16 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white font-bold mb-4">联系我们</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">填写以下表单，我们的专业团队将尽快与您联系</p>
        </div>
      </section>

      <section className="py-20 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-serif text-navy font-bold mb-6">联系方式</h2>
              <p className="text-gray-600 mb-8">您可以通过以下方式联系我们，或直接填写表单提交询价</p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">电话</h3>
                    <p className="text-gray-600">{config.company_phone || "暂未设置"}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">邮箱</h3>
                    <p className="text-gray-600">{config.company_email || "暂未设置"}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">微信</h3>
                    <p className="text-gray-600">{config.company_wechat || "暂未设置"}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">地址</h3>
                    <p className="text-gray-600">{config.company_address || "暂未设置"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-navy mb-2">WhatsApp</h3>
                <p className="text-gray-600">{config.company_whatsapp || "暂未设置"}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif text-navy font-bold mb-4">咨询前建议准备的信息</h2>
            <p className="text-gray-600">如果你提前准备好这些信息，我们通常能更快给出更准确的运输建议和报价。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-bg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-navy mb-3">货物基础信息</h3>
              <ul className="text-gray-600 space-y-2 list-disc pl-5">
                <li>品名 / HS 相关描述</li>
                <li>重量、体积、件数</li>
                <li>是否普货 / 敏感货 / 高货值货物</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-bg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-navy mb-3">运输与交付要求</h3>
              <ul className="text-gray-600 space-y-2 list-disc pl-5">
                <li>起运地 / 目的地国家与城市</li>
                <li>希望使用班列、卡航还是海运</li>
                <li>是否有明确时效要求或促销节点</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-bg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-navy mb-3">清关相关信息</h3>
              <ul className="text-gray-600 space-y-2 list-disc pl-5">
                <li>是否已有收货主体 / 税号</li>
                <li>是否需要欧盟清关协助</li>
                <li>是否需要资料预审</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-bg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-navy mb-3">尾程与仓储安排</h3>
              <ul className="text-gray-600 space-y-2 list-disc pl-5">
                <li>是否派送到门 / 入仓 / 海外仓</li>
                <li>是否需要预约仓库窗口</li>
                <li>是否有固定交付时间要求</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer
        companyName={config.company_name}
        companyNameEn={config.company_name_en}
        description={config.footer_content}
        phone={config.company_phone}
        email={config.company_email}
        wechat={config.company_wechat}
        address={config.company_address}
      />
    </main>
  );
}
