import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Train, Truck, Ship, FileCheck, Clock, Shield, Globe, TrendingUp, Package, PhoneCall, MessageCircleMore } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "中欧物流一站式解决方案",
  description: "中欧通联提供中欧班列、卡航快递、海运整拼柜、派送到门、项目货物运输及欧盟清关服务，覆盖欧洲多国，适合跨境卖家与外贸企业。",
  keywords: ["中欧物流", "欧洲物流", "国际货运", "中欧班列", "卡航", "欧盟清关", "派送到门"],
  alternates: { canonical: "/" },
};
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingContact from "@/components/layout/FloatingContact";
import { getSiteConfig, getServices } from "@/lib/data";
import { getPublishedNews } from "@/lib/news";

// 服务图标映射
const iconMap: Record<string, React.ElementType> = {
  train: Train,
  truck: Truck,
  ship: Ship,
  "file-check": FileCheck,
  package: Package,
};

const serviceQuickTags: Record<string, string> = {
  "中欧班列": "时效与成本平衡",
  "卡航快递": "适合紧急补货",
  "海运整拼柜": "适合大货控成本",
  "派送到门": "解决最后一公里",
  "项目货物运输": "适合复杂交付",
  "欧盟清关": "降低通关沟通成本",
};

// 优势图标映射（文案从后台读取）
const advantageIcons = [Clock, Shield, Globe, TrendingUp];

const defaultFaqs = [
  {
    question: "送亚马逊仓和送私人地址，方案上有什么区别？",
    answer: "送仓通常更关注预约窗口、标签要求、上架时效与异常签收；送私人或商业地址则更关注尾程预约、派送范围与签收方式。发货前把收货类型说清楚，方案会更准确。",
  },
  {
    question: "卡航、班列、海运在旺季应该怎么选？",
    answer: "如果要保补货节奏，卡航通常更灵活；如果想在时效和成本之间做平衡，班列更稳；如果是大货备货且交期宽松，海运更有成本优势。旺季建议尽早锁定发运窗口。",
  },
  {
    question: "哪些货物建议先做清关资料预审？",
    answer: "高货值货物、品名复杂货物、带电/敏感属性货物、项目货以及首次出口到对应国家的货物，都建议先做资料预审，以减少清关阶段反复沟通。",
  },
  {
    question: "项目货和普通贸易货的运输组织差别在哪里？",
    answer: "项目货更关注尺寸重量、装卸方式、分批到货节奏、现场交接条件和节点控制，通常不能直接套用普通拼货或常规运输模板，需要先做专项方案。",
  },
];

const defaultTargetAudience = [
  {
    title: "亚马逊 / 平台仓补货客户",
    description: "适合关注补货节奏、入仓预约、断货风险和旺季交付稳定性的跨境电商客户。",
  },
  {
    title: "工厂直发欧洲采购客户",
    description: "适合需要从中国工厂出货，统一管理主程、清关和尾程交付的制造商与贸易商。",
  },
  {
    title: "项目设备 / 工程交付客户",
    description: "适合设备类、异形件、多批次到货和现场交付要求较高的项目型物流需求。",
  },
];

export default async function HomePage() {
  const config = await getSiteConfig();
  const services = await getServices();
  const homeNewsCount = Number(config.home_news_count || 3);
  const news = await getPublishedNews(homeNewsCount);
  const featuredNews = news[0];
  const secondaryNews = news.slice(1, Math.max(homeNewsCount, 3));
  const audienceSectionTitle = config.audience_section_title || "这套方案适合谁";
  const audienceSectionSubtitle = config.audience_section_subtitle || "如果你属于下面这些典型场景之一，这个站点里的服务内容基本就是为你准备的。";
  const targetAudience = [
    {
      title: config.audience_1_title || defaultTargetAudience[0].title,
      description: config.audience_1_description || defaultTargetAudience[0].description,
    },
    {
      title: config.audience_2_title || defaultTargetAudience[1].title,
      description: config.audience_2_description || defaultTargetAudience[1].description,
    },
    {
      title: config.audience_3_title || defaultTargetAudience[2].title,
      description: config.audience_3_description || defaultTargetAudience[2].description,
    },
  ];
  const faqs = [
    {
      question: config.home_faq_1_question || defaultFaqs[0].question,
      answer: config.home_faq_1_answer || defaultFaqs[0].answer,
    },
    {
      question: config.home_faq_2_question || defaultFaqs[1].question,
      answer: config.home_faq_2_answer || defaultFaqs[1].answer,
    },
    {
      question: config.home_faq_3_question || defaultFaqs[2].question,
      answer: config.home_faq_3_answer || defaultFaqs[2].answer,
    },
    {
      question: config.home_faq_4_question || defaultFaqs[3].question,
      answer: config.home_faq_4_answer || defaultFaqs[3].answer,
    },
  ];
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
          {config.banner_image ? (
            <Image
              src={config.banner_image}
              alt="Hero Background"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-navy via-navy to-gold/70" />
          )}
          <div className="absolute inset-0 bg-navy/80" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-serif text-white font-bold mb-6 animate-fade-in-up">
            {config.banner_title || "专注中欧走廊的物流专家"}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {config.banner_subtitle || "14天最快到欧，欧盟清关全托管"}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Link
              href={config.banner_button_link || "/contact"}
              className="btn-primary inline-flex items-center gap-2"
            >
              <PhoneCall className="w-5 h-5" />
              {config.banner_button_text || "立即咨询"}
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-white hover:bg-white/10 transition-colors"
            >
              <MessageCircleMore className="w-5 h-5" />
              先看方案
            </Link>
          </div>
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
                  <div className="inline-flex items-center rounded-full bg-gold/10 px-3 py-1 text-xs text-navy mb-3">
                    {serviceQuickTags[service.name] || "一站式中欧物流方案"}
                  </div>
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
            <h2 className="text-3xl md:text-4xl font-serif text-navy font-bold mb-4">{audienceSectionTitle}</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">{audienceSectionSubtitle}</p>
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

      {/* Quick Contact Section */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-bg border border-gray-100 p-6 md:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-gold mb-2">快速联系</p>
              <h2 className="text-2xl md:text-3xl font-serif text-navy font-bold mb-2">有货在排期？先把需求发过来</h2>
              <p className="text-gray-600 max-w-2xl">适合补货、送仓、项目货、清关问题、欧洲派送等场景。先沟通需求，再给运输建议和报价方向。</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/contact" className="btn-primary text-center">提交询价</Link>
              <Link href="/services" className="btn-secondary text-center">查看服务项目</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white font-bold mb-4">
            {config.home_cta_title || "不确定该走班列、卡航还是海运？"}
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            {config.home_cta_description || "把货物品名、重量体积、目的地和时效要求发给我们，我们先帮你判断更合适的运输方案。"}
          </p>
          <Link href={config.home_cta_link || "/contact"} className="btn-primary">
            {config.home_cta_button_text || "获取方案建议"}
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
      <FloatingContact phone={config.company_phone} email={config.company_email} />
    </main>
  );
}
