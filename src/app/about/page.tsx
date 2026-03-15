import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Award, Users, Globe, TrendingUp, Handshake } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "关于我们",
  description: "了解中欧通联国际物流的发展历程、服务网络、行业经验与核心价值，查看我们的中欧物流一站式服务能力。",
  alternates: { canonical: "/about" },
};
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSiteConfig } from "@/lib/data";

const capabilityIcons = [TrendingUp, Globe, Users, Award];

interface PartnerItem {
  id?: string;
  name: string;
  logo: string;
  website?: string;
  linkEnabled?: boolean;
  isVisible?: boolean;
  bgStyle?: "white" | "gray" | "dark";
}

function getLogoBgClass(style: string) {
  if (style === "dark") return "bg-navy border-navy/20";
  if (style === "gray") return "bg-gray-100 border-gray-200";
  return "bg-white border-gray-100";
}

export default async function AboutPage() {
  const config = await getSiteConfig();
  let partners: PartnerItem[] = [];
  try {
    partners = config.partners_items ? JSON.parse(config.partners_items) : [];
    if (!Array.isArray(partners)) partners = [];
  } catch {
    partners = [];
  }
  partners = partners.filter((partner) => partner?.isVisible !== false);
  const partnersSectionTitle = config.partners_section_title || "合作伙伴";
  const partnersSectionSubtitle = config.partners_section_subtitle || "与稳定可靠的合作伙伴协同，为客户提供更完整的中欧物流服务能力。";
  const partnersDisplayMode = config.partners_display_mode === "wall" ? "wall" : "card";
  const globalLogoBgStyle = config.partners_logo_bg_style === "dark" ? "dark" : config.partners_logo_bg_style === "gray" ? "gray" : "white";
  const capabilities = [
    {
      icon: capabilityIcons[0],
      title: config.capability_1_title || "多运输方式协同",
      description: config.capability_1_description || "覆盖中欧班列、卡航、海运、清关与尾程派送，可根据货物属性和交付节奏组合方案。",
    },
    {
      icon: capabilityIcons[1],
      title: config.capability_2_title || "欧洲链路衔接能力",
      description: config.capability_2_description || "关注目的国清关要求、送仓预约、末端派送与仓配协同，减少运输断点。",
    },
    {
      icon: capabilityIcons[2],
      title: config.capability_3_title || "面向B端复杂需求",
      description: config.capability_3_description || "可支持补货、项目货、门到门交付、多批次出运等更贴近企业采购场景的物流需求。",
    },
    {
      icon: capabilityIcons[3],
      title: config.capability_4_title || "方案先行而非模板报价",
      description: config.capability_4_description || "在报价前优先确认品名、时效、交付地点与清关条件，让方案更接近真实落地。",
    },
  ];
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
                {config.about_image ? (
                  <Image
                    src={config.about_image}
                    alt="关于我们配图"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-navy via-navy to-gold/80 flex items-center justify-center">
                    <div className="text-center text-white px-8">
                      <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                        <span className="text-3xl font-bold">SE</span>
                      </div>
                      <p className="text-2xl md:text-3xl font-serif font-bold mb-3">Sino Euro Logistics</p>
                      <p className="text-white/80 text-sm md:text-base">建议在后台上传真实办公室、仓库、团队或物流现场图片，提升可信度。</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl font-serif text-navy font-bold mb-6">
                中欧通联国际物流
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {config.about_content || "中欧通联国际物流有限公司成立于2010年，是一家专注于中欧物流服务的国际化物流企业。我们拥有14年行业经验，为客户提供包括中欧班列、卡航快递、海运整拼柜、派送到门、项目货物运输及欧盟清关在内的一站式物流解决方案。"}
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                公司总部位于深圳，围绕中欧主干线路、清关协同与欧洲尾程交付持续完善服务网络。相比泛化承诺，我们更重视方案匹配、节点控制与异常响应，把每一票货真正交付到位。
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

      {/* Capabilities */}
      <section className="py-16 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-white font-bold mb-4">
              {config.capabilities_section_title || "我们的服务能力"}
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              {config.capabilities_section_subtitle || "相比堆数字，我们更愿意把真正能影响交付结果的能力讲清楚。"}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center rounded-2xl bg-white/5 border border-white/10 p-6">
                  <div className="w-14 h-14 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-xl font-serif text-white font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-300 text-sm leading-7">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Handshake className="w-7 h-7 text-gold" />
            </div>
            <h2 className="text-3xl font-serif text-navy font-bold mb-4">
              {partnersSectionTitle}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {partnersSectionSubtitle}
            </p>
          </div>

          {partners.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-500">
              暂未配置合作伙伴展示内容
            </div>
          ) : partnersDisplayMode === "wall" ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {partners.map((partner) => {
                const bgClass = getLogoBgClass(partner.bgStyle || globalLogoBgStyle);
                const card = (
                  <div className={`rounded-2xl border p-5 h-28 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow ${bgClass}`}>
                    <div className="relative w-full h-14">
                      {partner.logo ? (
                        <Image src={partner.logo} alt={partner.name} fill className="object-contain" />
                      ) : (
                        <div className="w-full h-full rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-sm">
                          暂无 Logo
                        </div>
                      )}
                    </div>
                  </div>
                );

                return partner.linkEnabled && partner.website ? (
                  <Link key={partner.id || partner.name} href={partner.website} target="_blank" rel="noopener noreferrer" className="block" aria-label={partner.name}>
                    {card}
                  </Link>
                ) : (
                  <div key={partner.id || partner.name} aria-label={partner.name}>{card}</div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {partners.map((partner) => {
                const bgClass = getLogoBgClass(partner.bgStyle || globalLogoBgStyle);
                const card = (
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 h-full flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                    <div className={`relative w-full h-20 mb-4 rounded-xl border ${bgClass}`}>
                      {partner.logo ? (
                        <Image src={partner.logo} alt={partner.name} fill className="object-contain p-3" />
                      ) : (
                        <div className="w-full h-full rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-sm">
                          暂无 Logo
                        </div>
                      )}
                    </div>
                    <p className="text-navy font-medium text-sm leading-6">{partner.name}</p>
                    {partner.linkEnabled && partner.website ? (
                      <span className="mt-2 text-xs text-gold">查看合作伙伴官网</span>
                    ) : null}
                  </div>
                );

                return partner.linkEnabled && partner.website ? (
                  <Link key={partner.id || partner.name} href={partner.website} target="_blank" rel="noopener noreferrer" className="block">
                    {card}
                  </Link>
                ) : (
                  <div key={partner.id || partner.name}>{card}</div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-navy font-bold mb-4">
              {config.values_section_title || "核心价值观"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-bg">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-serif text-navy font-bold mb-2">{config.value_1_title || "线路理解优先"}</h3>
              <p className="text-gray-600">
                {config.value_1_description || "我们重视的不只是发货，而是对中欧线路、口岸节奏、清关要求和末端交付条件的真实理解。"}
              </p>
            </div>
            <div className="text-center p-8 rounded-xl bg-bg">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-serif text-navy font-bold mb-2">{config.value_2_title || "节点可控交付"}</h3>
              <p className="text-gray-600">
                {config.value_2_description || "从提货、主程、清关到尾程预约，我们强调关键节点清晰、异常响应及时、交付结果可追踪。"}
              </p>
            </div>
            <div className="text-center p-8 rounded-xl bg-bg">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-serif text-navy font-bold mb-2">{config.value_3_title || "长期方案协同"}</h3>
              <p className="text-gray-600">
                {config.value_3_description || "我们不只做单票运输，更关注客户长期补货节奏、仓配协同和整体物流成本优化。"}
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
