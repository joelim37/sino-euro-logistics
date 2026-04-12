import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, BadgeHelp } from "lucide-react";
import TrackedLink from "@/components/TrackedLink";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSiteConfig, getServices } from "@/lib/data";
import { iconMap, serviceScenarios, fallbackScenarios, serviceAdvantages, serviceProcess, mergeServices } from "@/lib/service-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "服务项目 - 中欧班列、卡航、海运、欧盟清关与派送到门",
  description: "查看中欧通联的中欧班列、中欧卡航、中欧海运、欧盟清关、欧洲派送到门与项目货物运输服务，了解适合货物、参考时效与运输方案。",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "服务项目 - 中欧班列、卡航、海运、欧盟清关与派送到门",
    description: "查看中欧通联的中欧班列、中欧卡航、中欧海运、欧盟清关、欧洲派送到门与项目货物运输服务，了解适合货物、参考时效与运输方案。",
    url: "/services",
  },
  twitter: {
    card: "summary_large_image",
    title: "服务项目 - 中欧班列、卡航、海运、欧盟清关与派送到门",
    description: "查看中欧通联的中欧班列、中欧卡航、中欧海运、欧盟清关、欧洲派送到门与项目货物运输服务，了解适合货物、参考时效与运输方案。",
  },
};

const serviceFaqs = [
  {
    question: "中欧班列、卡航、海运怎么选？",
    answer: "如果希望兼顾时效与成本，中欧班列通常更均衡；如果对交付时效更敏感，卡航会更灵活；如果以大货、成本控制为优先，海运更有优势。",
  },
  {
    question: "可以提供清关和尾程派送吗？",
    answer: "可以。我们可根据货物类型、目的国要求和收货地址，提供主程运输、欧盟清关、尾程派送到门的一体化方案。",
  },
  {
    question: "项目货物运输一般要提前准备什么？",
    answer: "建议提前提供设备名称、尺寸重量、包装方式、装卸条件、交付地点限制以及项目时间表。对于超尺寸或需吊装货物，越早评估越能降低执行风险。",
  },
  {
    question: "派送到门可以送到仓库、门店或工地吗？",
    answer: "通常可以。我们会根据目的地类型、预约要求、车辆限制和签收方式安排合适的尾程资源，并提前确认交付窗口。",
  },
  {
    question: "发货前最需要确认什么？",
    answer: "建议优先确认货物品名、件重体积、申报价值、收货国家、交付时效以及是否需要入仓预约或清关预审。",
  },
];

const serviceComparisons = [
  {
    name: "中欧班列",
    speed: "时效均衡",
    cost: "成本中等",
    flexibility: "稳定性高",
    bestFor: "适合常规跨境货物、重视时效与成本平衡的企业",
  },
  {
    name: "卡航快递",
    speed: "时效更快",
    cost: "成本较高",
    flexibility: "灵活度高",
    bestFor: "适合电商补货、促销节点、对到门交付要求更高的货物",
  },
  {
    name: "海运整拼柜",
    speed: "时效较慢",
    cost: "成本更优",
    flexibility: "适合大货",
    bestFor: "适合大宗货、对成本敏感且交付周期更宽松的业务",
  },
];

const idealCustomers = [
  {
    title: "跨境卖家补货团队",
    description: "更关心补货时效、入仓预约、旺季交付与断货风险控制。",
  },
  {
    title: "外贸工厂 / 贸易公司",
    description: "更关心单票成本、线路稳定性、清关协同与门到门交付。",
  },
  {
    title: "项目设备 / 工程客户",
    description: "更关心节点控制、超尺寸运输、现场交接与分批到货安排。",
  },
];

const serviceConcerns = [
  {
    title: "怕时效不稳",
    description: "我们会先确认你的交付窗口，再建议更合适的班列、卡航或海运方案，而不是先套模板报价。",
  },
  {
    title: "怕清关反复沟通",
    description: "针对高货值、首次出货、资料复杂或目的国要求更细的货物，可提前做资料预审，减少卡关概率。",
  },
  {
    title: "怕尾程掉链子",
    description: "如果你需要送仓、送门店、送办公室或工地，我们会把尾程预约和签收要求一起纳入方案。",
  },
];

export default async function ServicesPage() {
  const config = await getSiteConfig();
  const services = await getServices();
  const uniqueServices = mergeServices(services);
  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: uniqueServices.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: service.name,
      description: service.description,
      url: `https://sinoeurologistics-atpr.vercel.app/services/${service.slug}`,
    })),
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: serviceFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
  const comparisonJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "中欧物流运输方案对比",
    itemListElement: serviceComparisons.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      description: `${item.speed}，${item.cost}，${item.flexibility}，${item.bestFor}`,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: "https://sinoeurologistics-atpr.vercel.app/" },
      { "@type": "ListItem", position: 2, name: "服务项目", item: "https://sinoeurologistics-atpr.vercel.app/services" },
    ],
  };

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Navbar />

      <section className="relative pt-24 pb-16 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white font-bold mb-4">服务项目</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">为您提供全方位的中欧物流一站式解决方案，并可继续查看每项服务的独立详情页。</p>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif text-navy font-bold mb-4">这页服务更适合哪些客户</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">如果你属于下面几类典型场景之一，这里的服务结构基本就是按你的真实需求来组织的。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {idealCustomers.map((item) => (
              <div key={item.title} className="rounded-2xl border border-gray-100 bg-bg p-6 shadow-sm">
                <h3 className="text-xl font-serif text-navy font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-7">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {uniqueServices.map((service, index) => {
              const Icon = iconMap[service.icon] || iconMap.train;
              const isEven = index % 2 === 0;
              const scenarios = serviceScenarios[service.name] || fallbackScenarios;
              const advantages = serviceAdvantages[service.name] || [];
              const processSteps = serviceProcess[service.name] || [];

              return (
                <div key={service.id} className={`flex flex-col lg:flex-row gap-8 items-center ${isEven ? "" : "lg:flex-row-reverse"}`}>
                  <div className="w-full lg:w-1/2">
                    <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl">
                      {service.image ? (
                        <Image src={service.image} alt={service.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-navy via-navy to-gold/70 flex items-center justify-center">
                          <div className="text-center text-white px-8">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                              <span className="text-3xl font-bold">SE</span>
                            </div>
                            <p className="text-2xl font-serif font-bold mb-3">{service.name}</p>
                            <p className="text-white/80 text-sm">建议在后台为该服务上传真实业务图片，提升专业信任感。</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full lg:w-1/2">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-gold" />
                      </div>
                      <h2 className="text-3xl font-serif text-navy font-bold">{service.name}</h2>
                    </div>

                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">{service.content || service.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">参考时效</p>
                        <p className="text-navy font-semibold">{service.transit_time || "-"}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">适合货物</p>
                        <p className="text-navy font-semibold">{service.suitable_for || "-"}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white border border-gray-100 p-5 mb-5 space-y-3">
                      <h3 className="text-base font-semibold text-navy">适用场景</h3>
                      <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
                        {scenarios.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {advantages.length > 0 && (
                      <div className="rounded-2xl bg-white border border-gray-100 p-5 mb-5 space-y-3">
                        <h3 className="text-base font-semibold text-navy">服务优势</h3>
                        <div className="flex flex-wrap gap-2">
                          {advantages.map((item) => (
                            <span key={item} className="inline-flex items-center rounded-full bg-gold/10 px-3 py-1.5 text-sm text-navy">{item}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {processSteps.length > 0 && (
                      <div className="rounded-2xl bg-white border border-gray-100 p-5 mb-6 space-y-3">
                        <h3 className="text-base font-semibold text-navy">服务流程</h3>
                        <ol className="text-sm text-gray-600 space-y-2 list-decimal pl-5">
                          {processSteps.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ol>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                      <TrackedLink
                        href={`/services/${service.slug}`}
                        className="btn-secondary"
                        eventName="cta_click"
                        eventParams={{ location: `service_block_${service.slug}`, target: `/services/${service.slug}` }}
                      >
                        查看 {service.name} 详情页
                      </TrackedLink>
                      <TrackedLink
                        href="/contact"
                        className="btn-primary"
                        eventName="cta_click"
                        eventParams={{ location: `service_block_${service.slug}`, target: "/contact" }}
                      >
                        咨询 {service.name} 方案
                      </TrackedLink>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-navy font-bold mb-4">班列 / 卡航 / 海运怎么选</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">把客户最常比较的三种运输方案拆开说清楚，方便快速判断时效、成本和适用品类。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceComparisons.map((item) => (
              <div key={item.name} className="rounded-2xl border border-gray-100 bg-bg p-6 shadow-sm">
                <h3 className="text-xl font-serif text-navy font-bold mb-4">{item.name}</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div><span className="font-medium text-gray-800">时效：</span>{item.speed}</div>
                  <div><span className="font-medium text-gray-800">成本：</span>{item.cost}</div>
                  <div><span className="font-medium text-gray-800">灵活性：</span>{item.flexibility}</div>
                  <div><span className="font-medium text-gray-800">适合场景：</span>{item.bestFor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-bg border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif text-navy font-bold mb-4">客户在咨询前最常顾虑什么</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">把真正影响成交的疑问先说清楚，能减少无效沟通，也更方便客户快速决策。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceConcerns.map((item) => (
              <div key={item.title} className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                  <BadgeHelp className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-xl font-serif text-navy font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-7">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-navy font-bold mb-4">服务相关常见问题</h2>
            <p className="text-gray-600">把客户在咨询物流方案前最常问的问题，先直接说清楚。</p>
          </div>
          <div className="space-y-4">
            {serviceFaqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-gray-100 bg-bg p-6">
                <h3 className="text-lg font-semibold text-navy mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-navy font-bold mb-4">还不确定该走哪种运输方式？</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">把货物品名、重量体积、目的地和时效要求发给我们，我们先帮您判断更合适的运输方案。</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <TrackedLink href="/contact" className="btn-primary" eventName="cta_click" eventParams={{ location: "services_bottom_cta", target: "advice" }}>
              获取中欧物流方案建议
            </TrackedLink>
            <TrackedLink href="/contact" className="btn-secondary" eventName="cta_click" eventParams={{ location: "services_bottom_cta", target: "quote" }}>
              提交中欧物流询价
            </TrackedLink>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold" />可先沟通路线和时效</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold" />可先判断是否需要清关预审</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold" />可先给你报价方向</span>
          </div>
        </div>
      </section>

      <section className="pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-100 bg-bg p-6 md:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-gold mb-2">高意图服务详情页</p>
              <h2 className="text-2xl md:text-3xl font-serif text-navy font-bold mb-2">继续查看更聚焦的运输服务页面</h2>
              <p className="text-gray-600 max-w-3xl">如果你已经大致确定需求，可以直接进入更细的中欧班列、卡航、海运、清关与到门服务详情页，查看更多适用场景、流程与咨询入口。</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {uniqueServices.slice(0, 5).map((service) => (
                <Link key={service.slug} href={`/services/${service.slug}`} className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-navy hover:border-gold hover:text-gold">
                  {service.name}
                </Link>
              ))}
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
