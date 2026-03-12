import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Train, Truck, Ship, FileCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "服务项目",
  description: "查看中欧通联的中欧班列、卡航快递、海运整拼柜、欧盟清关等服务项目，了解适合货物、参考时效与运输方案。",
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
};

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

export default async function ServicesPage() {
  const config = await getSiteConfig();
  const services = await getServices();
  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((service, index) => ({
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

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
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
            {services.map((service, index) => {
              const Icon = iconMap[service.icon] || Train;
              const isEven = index % 2 === 0;

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
                        <li>需要稳定跨境运输链路的外贸企业</li>
                        <li>关注欧洲时效与清关协同的跨境卖家</li>
                        <li>希望把主程、清关、尾程统一管理的货主</li>
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
