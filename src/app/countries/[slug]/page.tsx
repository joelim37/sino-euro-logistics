import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import InquiryChecklistCard from "@/components/InquiryChecklistCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrackedLink from "@/components/TrackedLink";
import { getSiteConfig, getServices } from "@/lib/data";
import { mergeServices } from "@/lib/service-content";
import { countryContent } from "@/lib/country-content";
import { serviceDetailContent } from "@/lib/service-detail-content";
import { serviceCaseContent } from "@/lib/service-case-content";
import { inquiryTemplateContent } from "@/lib/inquiry-template-content";

export const dynamic = "force-dynamic";

const siteUrl = "https://sinoeurologistics-atpr.vercel.app";

function getCountry(slug: string) {
  return countryContent[slug];
}

export async function generateStaticParams() {
  return Object.keys(countryContent).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const country = getCountry(params.slug);
  if (!country) {
    return { title: "页面不存在" };
  }

  return {
    title: country.seoTitle,
    description: country.seoDescription,
    keywords: country.focusKeywords,
    alternates: {
      canonical: `/countries/${params.slug}`,
    },
    openGraph: {
      title: country.seoTitle,
      description: country.seoDescription,
      url: `/countries/${params.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: country.seoTitle,
      description: country.seoDescription,
    },
  };
}

export default async function CountryPage({ params }: { params: { slug: string } }) {
  const country = getCountry(params.slug);
  const config = await getSiteConfig();
  const services = mergeServices(await getServices());

  if (!country) {
    notFound();
  }

  const recommendedServices = country.bestServices
    .map((slug) => services.find((item) => item.slug === slug) || services.find((item) => item.slug === slug))
    .filter(Boolean);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: `${country.name}物流`, item: `${siteUrl}/countries/${params.slug}` },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: country.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${country.name}物流推荐服务`,
    itemListElement: recommendedServices.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item?.name,
      url: `${siteUrl}/services/${item?.slug}`,
    })),
  };

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <Navbar />

      <section className="relative pt-24 pb-16 bg-navy">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold mb-4">国家物流专题页</p>
          <h1 className="text-4xl md:text-5xl font-serif text-white font-bold mb-4">{country.heroTitle}</h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg">{country.heroDescription}</p>
          <p className="text-sm text-white/70 max-w-4xl mx-auto mt-5 leading-7">关键词覆盖：{country.focusKeywords.join("、")}</p>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-bg border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-serif text-navy font-bold mb-5">适合哪些业务</h2>
            <ul className="space-y-3 list-disc pl-5 text-gray-600 leading-7">
              {country.suitableFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-bg border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-serif text-navy font-bold mb-5">客户常见顾虑</h2>
            <ul className="space-y-3 list-disc pl-5 text-gray-600 leading-7">
              {country.painPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-bg border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-serif text-navy font-bold mb-5">咨询前建议准备</h2>
            <ul className="space-y-3 list-disc pl-5 text-gray-600 leading-7">
              {country.consultationChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 bg-bg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-serif text-navy font-bold mb-5">{country.name}市场更常见的业务特点</h2>
            <ul className="space-y-3 list-disc pl-5 text-gray-600 leading-7">
              {country.marketHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-serif text-navy font-bold mb-5">{country.name}本地交付更该提前确认什么</h2>
            <ul className="space-y-3 list-disc pl-5 text-gray-600 leading-7">
              {country.localDeliveryNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 bg-bg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-serif text-navy font-bold mb-3">更适合 {country.name} 线路的服务</h2>
              <p className="text-gray-600">把主程运输、清关和尾程交付拆开看，更容易快速判断当前货物适合哪种组合。</p>
            </div>
            <Link href="/services" className="text-gold font-medium hover:underline">查看全部服务</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedServices.map((service) => {
              if (!service) return null;
              const detail = serviceDetailContent[service.slug];
              return (
                <div key={service.slug} className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm">
                  <h3 className="text-2xl font-serif text-navy font-bold mb-3">{service.name}</h3>
                  <p className="text-gray-600 leading-8 mb-5">{detail?.seoDescription || service.description}</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <TrackedLink href={`/services/${service.slug}`} className="btn-secondary" eventName="cta_click" eventParams={{ location: `country_${params.slug}_${service.slug}`, target: `/services/${service.slug}` }}>
                      查看 {service.name} 详情
                    </TrackedLink>
                    <TrackedLink href="/contact" className="btn-primary" eventName="cta_click" eventParams={{ location: `country_${params.slug}_${service.slug}`, target: "/contact" }}>
                      咨询 {country.name} 线路方案
                    </TrackedLink>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-navy font-bold mb-4">{country.name} 线路常见业务场景</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">用更接近真实业务的案例表达方式，帮助客户快速判断自己的货更适合哪类执行路径。</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendedServices.slice(0, 4).map((service) => {
              if (!service) return null;
              const caseItem = serviceCaseContent[service.slug];
              if (!caseItem) return null;
              return (
                <div key={service.slug} className="rounded-3xl border border-gray-100 bg-bg p-8 shadow-sm">
                  <p className="text-sm text-gold mb-2">案例化场景表达</p>
                  <h3 className="text-2xl font-serif text-navy font-bold mb-3">{caseItem.title}</h3>
                  <p className="text-gray-600 leading-7 mb-4">{caseItem.summary}</p>
                  <div className="space-y-3 text-sm text-gray-600 leading-7">
                    <p><span className="font-semibold text-navy">场景：</span>{caseItem.scenario}</p>
                    <p><span className="font-semibold text-navy">难点：</span>{caseItem.challenge}</p>
                    <p><span className="font-semibold text-navy">思路：</span>{caseItem.solution}</p>
                    <p><span className="font-semibold text-navy">结果：</span>{caseItem.result}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif text-navy font-bold mb-4">{country.name} 物流常见问题</h2>
            <p className="text-gray-600">把客户在咨询 {country.name} 线路时最常问的问题，先讲清楚。</p>
          </div>
          <div className="space-y-4">
            {country.faq.map((item) => (
              <div key={item.question} className="rounded-2xl border border-gray-100 bg-bg p-6">
                <h3 className="text-lg font-semibold text-navy mb-3">{item.question}</h3>
                <p className="text-gray-600 leading-7">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-navy p-8 md:p-10 text-white shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.9fr] gap-8 items-center">
              <div>
                <p className="text-gold mb-3">国家页转化引导</p>
                <h2 className="text-3xl font-serif font-bold mb-4">需要中国到{country.name}物流方案？先把货物信息发给我们</h2>
                <p className="text-white/80 leading-8 mb-6">把品名、件数、重量体积、收货地址、期望时效和是否需要清关/派送到门发来，我们会先帮你判断更适合的线路和执行重点。</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <TrackedLink href="/contact" className="btn-primary" eventName="cta_click" eventParams={{ location: `country_conversion_${params.slug}`, target: "/contact" }}>
                    提交{country.name}线路询价
                  </TrackedLink>
                  <TrackedLink href="/services" className="btn-secondary border-white/30 text-white hover:bg-white hover:text-navy" eventName="cta_click" eventParams={{ location: `country_conversion_${params.slug}`, target: "/services" }}>
                    先看服务组合
                  </TrackedLink>
                </div>
              </div>
              <InquiryChecklistCard
                title={inquiryTemplateContent.country.title}
                items={[...country.consultationChecklist, ...inquiryTemplateContent.country.items.slice(3)]}
                tips={inquiryTemplateContent.country.tips}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-100 bg-bg p-6 md:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-gold mb-2">继续扩展查看</p>
              <h2 className="text-2xl md:text-3xl font-serif text-navy font-bold mb-2">还可以继续看服务详情页或其他国家页</h2>
              <p className="text-gray-600 max-w-3xl">如果你已经基本明确是班列、卡航、海运、清关还是尾程到门需求，也可以直接进入对应服务详情页继续看。</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/services" className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-navy hover:border-gold hover:text-gold">
                查看全部服务
              </Link>
              <Link href="/countries/germany" className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-navy hover:border-gold hover:text-gold">
                德国物流
              </Link>
              <Link href="/countries/france" className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-navy hover:border-gold hover:text-gold">
                法国物流
              </Link>
              <Link href="/countries/poland" className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-navy hover:border-gold hover:text-gold">
                波兰物流
              </Link>
              <Link href="/countries/italy" className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-navy hover:border-gold hover:text-gold">
                意大利物流
              </Link>
              <Link href="/countries/netherlands" className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-navy hover:border-gold hover:text-gold">
                荷兰物流
              </Link>
              <Link href="/countries/belgium" className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-navy hover:border-gold hover:text-gold">
                比利时物流
              </Link>
              <Link href="/countries/spain" className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-navy hover:border-gold hover:text-gold">
                西班牙物流
              </Link>
              <Link href="/countries/hungary" className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-navy hover:border-gold hover:text-gold">
                匈牙利物流
              </Link>
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
