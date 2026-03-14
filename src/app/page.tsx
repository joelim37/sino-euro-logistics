import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Train, Truck, Ship, FileCheck, Clock, Shield, Globe, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "中欧物流一站式解决方案",
  description: "中欧通联提供中欧班列、卡航快递、海运整拼柜、派送到门、项目货物运输及欧盟清关服务，覆盖欧洲多国，适合跨境卖家与外贸企业。",
  alternates: { canonical: "/" },
};
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSiteConfig, getServices } from "@/lib/data";
import { getPublishedNews } from "@/lib/news";

// 服务图标映射
const iconMap: Record<string, React.ElementType> = {
  train: Train,
  truck: Truck,
  ship: Ship,
  "file-check": FileCheck,
};

// 优势图标映射（文案从后台读取）
const advantageIcons = [Clock, Shield, Globe, TrendingUp];

const faqs = [
  {
    question: "中欧班列和卡航快递分别适合什么货物？",
    answer: "中欧班列适合时效与成本需要平衡的常规跨境货物，卡航快递更适合时效要求更高、希望门到门交付更灵活的货物。",
  },
  {
    question: "中欧物流通常需要多久到欧洲？",
    answer: "具体时效取决于运输方式、目的国、清关资料完整性和尾程预约情况。铁路和卡航通常比海运更快，实际方案可根据货物类型评估。",
  },
  {
    question: "可以提供欧盟清关和派送到门吗？",
    answer: "可以。中欧通联可提供中欧主程运输、欧盟清关以及欧洲尾程派送到门的一体化服务。",
  },
  {
    question: "发货前需要准备哪些资料？",
    answer: "通常需要商业发票、装箱单、品名申报信息、收发货人资料以及目标国清关所需的其他合规文件。高峰期建议提前预审。",
  },
];

const targetAudience = [
  {
    title: "跨境电商卖家",
    description: "适合需要稳定补货、关注入仓时效和尾程派送效率的亚马逊、独立站或平台卖家。",
  },
  {
    title: "传统外贸企业",
    description: "适合希望把中欧运输、清关与派送统一给专业团队管理的制造商与出口商。",
  },
  {
    title: "大宗货与项目货客户",
    description: "适合对成本、批量出货和多节点交付有明确计划需求的企业客户。",
  },
];

export default async function HomePage() {
  const config = await getSiteConfig();
  const services = await getServices();
  const homeNewsCount = Number(config.home_news_count || 3);
  const news = await getPublishedNews(homeNewsCount);
  const featuredNews = news[0];
  const secondaryNews = news.slice(1, Math.max(homeNewsCount, 3));
  const advantages = [
    {
      icon: advantageIcons[0],
      title: config.advantage_1_title || "时效保证",
      description: config.advantage_1_description || "14年丰富经验，专业团队操作，确保货物安全准时到达",
    },
    {
      icon: advantageIcons[1],
      title: config.advantage_2_title || "安全保障",
      description: config.advantage_2_description || "全程货物追踪，专业保险服务，让您安心托付",
    },
    {
      icon: advantageIcons[2],
      title: config.advantage_3_title || "网络覆盖",
      description: config.advantage_3_description || "欧洲全境派送网络，覆盖30+国家，门到门服务",
    },
    {
      icon: advantageIcons[3],
      title: config.advantage_4_title || "价格优惠",
      description: config.advantage_4_description || "一手庄家价格，无中间商赚差价，性价比更高",
    },
  ];
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.company_name || "中欧通联国际物流有限公司",
    alternateName: config.company_name_en || "Sino Euro Logistics",
    url: "https://sinoeurologistics-atpr.vercel.app",
    email: config.company_email || undefined,
    telephone: config.company_phone || undefined,
    address: config.company_address
      ? {
          "@type": "PostalAddress",
          streetAddress: config.company_address,
          addressCountry: "CN",
        }
      : undefined,
    contactPoint: config.company_phone
      ? [{ "@type": "ContactPoint", telephone: config.company_phone, contactType: "sales" }]
      : undefined,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={config.banner_image || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920"}
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-navy/80" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-serif text-white font-bold mb-6 animate-fade-in-up">
            {config.banner_title || "专注中欧走廊的物流专家"}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {config.banner_subtitle || "14天最快到欧，欧盟清关全托管"}
          </p>
          <Link
            href="/contact"
            className="btn-primary inline-block animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            {config.banner_button_text || "立即咨询"}
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-navy font-bold mb-4">
              我们的服务
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              为您提供全方位的中欧物流一站式解决方案
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => {
              const Icon = iconMap[service.icon] || Train;
              return (
                <Link
                  key={service.id}
                  href="/services"
                  className="service-card group"
                >
                  <div className="w-14 h-14 bg-navy/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-xl font-serif text-navy font-bold mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex items-center text-gold text-sm font-medium">
                    <span>了解更多</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-navy font-bold mb-4">
              {config.advantages_section_title || "为什么选择我们"}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {config.advantages_section_subtitle || "14年行业经验，值得信赖的物流合作伙伴"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl hover:bg-bg transition-colors"
                >
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="text-xl font-serif text-navy font-bold mb-2">
                    {advantage.title}
                  </h3>
                  <p className="text-gray-600">{advantage.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-navy font-bold mb-4">
                新闻动态
              </h2>
              <p className="text-gray-600 max-w-2xl">
                关注最新中欧物流趋势、市场动态与清关运输资讯
              </p>
            </div>
            <Link href="/news" className="text-gold font-medium hover:underline">
              查看更多
            </Link>
          </div>

          {news.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-500">
              暂无新闻内容
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
              {featuredNews && (
                <Link
                  href={`/news/${featuredNews.slug}`}
                  className="lg:col-span-3 group relative min-h-[420px] rounded-[28px] overflow-hidden bg-navy shadow-lg"
                >
                  {featuredNews.featured_image ? (
                    <Image src={featuredNews.featured_image} alt={featuredNews.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" style={{ objectPosition: featuredNews.featured_image_position || "center center" }} />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/65 to-navy/10" />
                  <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 text-white">
                    <div className="inline-flex items-center rounded-full bg-gold/20 text-gold px-3 py-1 text-xs font-medium mb-4">
                      推荐文章
                    </div>
                    <p className="text-sm text-gold/90 mb-3">
                      {featuredNews.published_at ? new Date(featuredNews.published_at).toLocaleDateString("zh-CN") : "未发布"}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4 max-w-3xl leading-snug">
                      {featuredNews.title}
                    </h3>
                    <p className="text-gray-200 max-w-2xl line-clamp-3 mb-6">
                      {featuredNews.summary || "点击查看详情"}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-white group-hover:text-gold transition-colors">
                      查看详情
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              )}

              <div className="lg:col-span-2 flex flex-col gap-5">
                {secondaryNews.length > 0 ? secondaryNews.map((item) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.slug}`}
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row h-full">
                      <div className="relative sm:w-44 h-44 sm:h-auto bg-gray-100 shrink-0 overflow-hidden">
                        {item.featured_image ? (
                          <Image src={item.featured_image} alt={item.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" style={{ objectPosition: item.featured_image_position || "center center" }} />
                        ) : null}
                      </div>
                      <div className="p-5 flex-1">
                        <p className="text-xs text-gold mb-2">
                          {item.published_at ? new Date(item.published_at).toLocaleDateString("zh-CN") : "未发布"}
                        </p>
                        <h3 className="text-lg font-serif text-navy font-bold mb-2 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                          {item.summary || "点击查看详情"}
                        </p>
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-navy group-hover:text-gold transition-colors">
                          继续阅读
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                )) : (
                  <div className="bg-white rounded-2xl shadow-sm p-8 text-gray-500 border border-gray-100 h-full flex items-center justify-center text-center">
                    当前只有 1 篇已发布新闻，发布更多文章后这里会自动补齐推荐位。
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Audience Section */}
      <section className="py-20 bg-bg border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-navy font-bold mb-4">这套方案适合谁</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">如果你属于下面这些典型场景之一，这个站点里的服务内容基本就是为你准备的。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {targetAudience.map((item) => (
              <div key={item.title} className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
                <h3 className="text-xl font-serif text-navy font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-7">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-navy font-bold mb-4">常见问题</h2>
            <p className="text-gray-600">把中欧物流客户最常问的几个问题先说清楚。</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="bg-bg border border-gray-100 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-navy mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white font-bold mb-4">
            准备好开始了吗？
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            立即联系我们，获取专业的中欧物流解决方案报价
          </p>
          <Link href="/contact" className="btn-primary">
            立即咨询
          </Link>
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
