import type { Metadata } from "next";
import Image from "next/image";
import { Award, Users, Globe, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "关于我们",
  description: "了解中欧通联国际物流的发展历程、服务网络、行业经验与核心价值，查看我们的中欧物流一站式服务能力。",
  alternates: { canonical: "/about" },
};
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSiteConfig } from "@/lib/data";

const stats = [
  { icon: TrendingUp, value: "14+", label: "年行业经验" },
  { icon: Globe, value: "30+", label: "服务国家" },
  { icon: Users, value: "5000+", label: "合作客户" },
  { icon: Award, value: "99%", label: "客户满意度" },
];

const certifications = [
  { name: "ISO 9001质量管理体系认证", image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400" },
  { name: "AEO高级认证企业", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400" },
  { name: "中国货代物流企业50强", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400" },
  { name: "欧盟清关资质", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400" },
];

export default async function AboutPage() {
  const config = await getSiteConfig();
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.company_name || "中欧通联国际物流有限公司",
    alternateName: config.company_name_en || "Sino Euro Logistics",
    url: "https://sinoeurologistics-atpr.vercel.app",
    description: config.about_content || "专注中欧物流的一站式国际物流服务商。",
    areaServed: ["Germany", "Poland", "France", "Netherlands", "Belgium", "Europe"],
    email: config.company_email || undefined,
    telephone: config.company_phone || undefined,
    address: config.company_address ? { "@type": "PostalAddress", streetAddress: config.company_address, addressCountry: "CN" } : undefined,
  };

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white font-bold mb-4">
            关于我们
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            专注中欧物流，致力于为您提供最优质的物流服务
          </p>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="w-full lg:w-1/2">
              <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800"
                  alt="公司办公室"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl font-serif text-navy font-bold mb-6">
                中欧通联国际物流
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {config.about_content || "中欧通联国际物流有限公司成立于2010年，是一家专注于中欧物流服务的国际化物流企业。我们拥有14年行业经验，为客户提供包括中欧班列、卡航快递、海运整拼柜、欧盟清关派送到门在内的一站式物流解决方案。"}
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                公司总部位于深圳，在欧洲主要城市设有分支机构，拥有专业的操作团队和完善的服务网络。我们始终坚持"客户至上、服务第一"的经营理念，为客户提供安全、高效、便捷的物流服务。
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">SE</span>
                </div>
                <div>
                  <h3 className="font-serif text-navy font-bold">Sino Euro Logistics</h3>
                  <p className="text-gray-500 text-sm">您的中欧物流首选伙伴</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-14 h-14 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <div className="text-3xl md:text-4xl font-serif text-white font-bold mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-navy font-bold mb-4">
              资质认证
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              权威资质认证，品质保障
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="relative h-40">
                  <Image
                    src={cert.image}
                    alt={cert.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <p className="text-navy font-medium text-sm">{cert.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-navy font-bold mb-4">
              核心价值观
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-bg">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-serif text-navy font-bold mb-2">客户至上</h3>
              <p className="text-gray-600">
                始终以客户需求为导向，提供个性化的物流解决方案
              </p>
            </div>
            <div className="text-center p-8 rounded-xl bg-bg">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-serif text-navy font-bold mb-2">追求卓越</h3>
              <p className="text-gray-600">
                持续优化服务流程，不断提升服务质量
              </p>
            </div>
            <div className="text-center p-8 rounded-xl bg-bg">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-serif text-navy font-bold mb-2">合作共赢</h3>
              <p className="text-gray-600">
                与客户、合作伙伴共同成长，实现互利共赢
              </p>
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
