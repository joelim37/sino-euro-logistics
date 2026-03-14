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

const supplementalServices = [
  {
    id: "supplemental-door-delivery",
    name: "派送到门",
    slug: "door-delivery",
    description: "提供欧洲尾程预约、派送签收、仓库/门店/工地交付等到门服务，打通最后一公里。",
    content:
      "针对欧洲仓库、商业地址、门店与项目现场，提供预约、签收、异常反馈与回单跟踪等尾程交付支持，帮助客户把主程运输真正闭环到收货端。",
    icon: "truck",
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800",
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
    image: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=800",
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
    answer: "可以。我们可根据货物类型与目的国要求，提供主程运输、欧盟清关、尾程派送到门的一体化方案。",
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
  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: mergedServices.map((service, index) => ({
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
            {mergedServices.map((service, index) => {
              const Icon = iconMap[service.icon] || Train;
              const isEven = index % 2 === 0;
              const scenarios = serviceScenarios[service.name] || fallbackScenarios;

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
                      <Image
                        src={service.image || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800"}
                        alt={service.name}
                        fill
                        className="object-cover"
                      />
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

                    <div className="rounded-2xl bg-white border border-gray-100 p-5 mb-6 space-y-3">
                      <h3 className="text-base font-semibold text-navy">适用场景</h3>
                      <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
                        {scenarios.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

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
            不确定哪种服务适合您？
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            我们的专业团队会根据您的货物特点和需求，为您推荐最合适的物流方案
          </p>
          <Link href="/contact" className="btn-primary">
            咨询方案
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
