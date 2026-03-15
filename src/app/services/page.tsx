import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Train, Truck, Ship, FileCheck, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "服务项目",
  description: "查看中欧通联的中欧班列、卡航快递、海运整拼柜、派送到门、项目货物运输、欧盟清关等服务项目，了解适合货物、参考时效与运输方案。",
  alternates: { canonical: "/services" },
};
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSiteConfig, getServices } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  train: Train,
  truck: Truck,
  ship: Ship,
  "file-check": FileCheck,
  package: Package,
};

const serviceScenarios: Record<string, string[]> = {
  "中欧班列": [
    "适合有稳定月度/周度出货计划，希望在时效与成本之间取得平衡的外贸企业。",
    "适合机械配件、家居建材、普通工业品、汽车零部件等较重或批量较大的常规货物。",
    "适合需要覆盖欧洲内陆国家、希望链路稳定且便于长期签约合作的B端客户。",
  ],
  "卡航快递": [
    "适合跨境电商卖家在促销季、断货补仓、紧急补货时使用，对交付窗口更敏感。",
    "适合服饰、3C配件、小家电、美妆个护、轻抛货等对时效和末端灵活性要求较高的货物。",
    "适合希望减少中转等待、强调门到门衔接效率和可控交仓节奏的客户。",
  ],
  "海运整拼柜": [
    "适合大批量出货、对单公斤物流成本敏感、交付周期相对宽松的贸易商与工厂客户。",
    "适合家具、建材、日用品、低货值大体积货物及整批备货型订单。",
    "适合提前规划补货节奏、愿意以更长运输周期换取更优综合成本的项目。",
  ],
  "派送到门": [
    "适合没有欧洲本地物流团队、希望从起运到最终签收由同一服务商统筹的客户。",
    "适合送仓、送门店、送办公室、送工地等多类型收货地址，强调预约、签收和异常反馈。",
    "适合需要降低沟通链条、减少主程与尾程分包衔接风险的跨境卖家与企业买家。",
  ],
  "项目货物运输": [
    "适合设备搬迁、工程建设、生产线配套、展会布展等一次性或阶段性交付项目。",
    "适合超尺寸、超重件、异形设备、多批次联动到货等需要专项方案设计的货物。",
    "适合对装卸、加固、分批发运、现场交接和节点控制有更高要求的企业客户。",
  ],
};

const fallbackScenarios = [
  "适合需要稳定跨境运输链路的外贸企业。",
  "适合关注欧洲时效、清关与交付协同的跨境客户。",
  "适合希望把主程、清关、尾程统一管理的货主。",
];

const serviceAdvantages: Record<string, string[]> = {
  "中欧班列": ["时效与成本更均衡", "适合中大批量稳定出货", "欧洲内陆覆盖能力强"],
  "卡航快递": ["交付节奏更灵活", "适合补货与紧急订单", "门到门协同更顺畅"],
  "海运整拼柜": ["大货运输成本优势明显", "适合低货值大体积货物", "更适合计划性备货"],
  "派送到门": ["可预约送仓送门", "支持签收回单与异常反馈", "降低尾程对接成本"],
  "项目货物运输": ["支持定制化运输方案", "适配超长超重异形货", "强调节点控制与现场交接"],
  "欧盟清关": ["资料预审更高效", "降低通关沟通成本", "便于与主程和尾程联动"],
};

const serviceProcess: Record<string, string[]> = {
  "中欧班列": ["确认品名、件重体积与时效要求", "匹配班列班次并安排集货装柜", "完成清关与欧洲末端交付"],
  "卡航快递": ["确认补货窗口与交付节点", "安排提货、干线卡航与在途追踪", "完成清关后快速尾程派送"],
  "海运整拼柜": ["核算体积重量与柜型需求", "安排拼柜/整柜订舱与装运计划", "到港清关后衔接提柜与派送"],
  "派送到门": ["确认收货地址与预约要求", "匹配车辆/尾程资源并预约交付", "完成签收反馈与异常闭环"],
  "项目货物运输": ["评估尺寸、重量、吊装与路线条件", "制定分批运输与现场交接方案", "按项目节点执行运输、签收与复盘"],
  "欧盟清关": ["预审发票、装箱单与申报资料", "匹配目的国清关要求与税务路径", "放行后衔接仓储或尾程派送"],
};

const supplementalServices = [
  {
    id: "supplemental-door-delivery",
    name: "派送到门",
    slug: "door-delivery",
    description: "提供欧洲尾程预约、派送签收、仓库/门店/工地交付等到门服务，打通最后一公里。",
    content:
      "针对欧洲仓库、商业地址、门店与项目现场，提供预约、签收、异常反馈与回单跟踪等尾程交付支持，帮助客户把主程运输真正闭环到收货端。",
    icon: "truck",
    image: "",
    transit_time: "按目的国与预约时段而定",
    suitable_for: "需送仓 / 送门店 / 送办公室 / 送工地的货物",
  },
  {
    id: "supplemental-project-cargo",
    name: "项目货物运输",
    slug: "project-cargo-transport",
    description: "面向工程设备、展会物资、生产线与大件项目货，提供专项运输组织与节点管理。",
    content:
      "围绕设备尺寸、装卸条件、目的地限制与交付时间表，定制项目运输方案，可协调分批发运、现场交接、加固包装与多节点运输执行。",
    icon: "package",
    image: "",
    transit_time: "按项目方案评估",
    suitable_for: "工程设备 / 大件异形件 / 展会物资 / 生产线项目",
  },
];

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

export default async function ServicesPage() {
  const config = await getSiteConfig();
  const services = await getServices();
  const mergedServices = [...services, ...supplementalServices];
  const uniqueServices = Array.from(new Map(mergedServices.map((service) => [service.slug, service])).values());
  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: uniqueServices.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: service.name,
      description: service.description,
      url: "https://sinoeurologistics-atpr.vercel.app/services",
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

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonJsonLd) }} />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white font-bold mb-4">
            服务项目
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            为您提供全方位的中欧物流一站式解决方案
          </p>
        </div>
      </section>

      {/* Services Detail */}
      <section className="py-20 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {uniqueServices.map((service, index) => {
              const Icon = iconMap[service.icon] || Train;
              const isEven = index % 2 === 0;
              const scenarios = serviceScenarios[service.name] || fallbackScenarios;
              const advantages = serviceAdvantages[service.name] || [];
              const processSteps = serviceProcess[service.name] || [];

              return (
                <div
                  key={service.id}
                  className={`flex flex-col lg:flex-row gap-8 items-center ${
                    isEven ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Image */}
                  <div className="w-full lg:w-1/2">
                    <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-xl">
                      {service.image ? (
                        <Image
                          src={service.image}
                          alt={service.name}
                          fill
                          className="object-cover"
                        />
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

                  {/* Content */}
                  <div className="w-full lg:w-1/2">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-gold" />
                      </div>
                      <h2 className="text-3xl font-serif text-navy font-bold">
                        {service.name}
                      </h2>
                    </div>

                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                      {service.content || service.description}
                    </p>

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
                            <span key={item} className="inline-flex items-center rounded-full bg-gold/10 px-3 py-1.5 text-sm text-navy">
                              {item}
                            </span>
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

                    <Link href="/contact" className="btn-primary">
                      立即咨询
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
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

      {/* FAQ Section */}
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

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-navy font-bold mb-4">
            还不确定该走哪种运输方式？
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            把货物品名、重量体积、目的地和时效要求发给我们，我们先帮您判断更合适的运输方案。
          </p>
          <Link href="/contact" className="btn-primary">
            获取方案建议
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
