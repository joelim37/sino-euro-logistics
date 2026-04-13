import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrackedLink from "@/components/TrackedLink";
import { getServiceBySlug, getServices, getSiteConfig } from "@/lib/data";
import { iconMap, serviceScenarios, fallbackScenarios, serviceAdvantages, serviceProcess, mergeServices } from "@/lib/service-content";
import { serviceDetailContent } from "@/lib/service-detail-content";
import { serviceCaseContent } from "@/lib/service-case-content";
import InquiryChecklistCard from "@/components/InquiryChecklistCard";
import { inquiryTemplateContent } from "@/lib/inquiry-template-content";

export const dynamic = "force-dynamic";

const siteUrl = "https://sinoeurologistics-atpr.vercel.app";

async function getMergedServiceBySlug(slug: string) {
  const dbService = await getServiceBySlug(slug);
  if (dbService) return dbService;

  const merged = mergeServices([]);
  return merged.find((service) => service.slug === slug) || null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await getMergedServiceBySlug(params.slug);

  if (!service) {
    return { title: "服务不存在" };
  }

  const detail = serviceDetailContent[service.slug];
  const title = detail?.seoTitle || `${service.name}服务 - 中国到欧洲物流方案`;
  const description = detail?.seoDescription || service.description || `${service.name}服务，适合中国到欧洲物流、清关与交付需求。`;

  return {
    title,
    description,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/services/${service.slug}`,
      images: service.image ? [service.image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: service.image ? [service.image] : undefined,
    },
  };
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const config = await getSiteConfig();
  const service = await getMergedServiceBySlug(params.slug);
  const allServices = mergeServices(await getServices());

  if (!service) {
    notFound();
  }

  const relatedServices = allServices.filter((item) => item.slug !== service.slug).slice(0, 4);
  const detail = serviceDetailContent[service.slug];
  const caseItem = serviceCaseContent[service.slug];
  const Icon = iconMap[service.icon] || iconMap.train;
  const scenarios = serviceScenarios[service.name] || fallbackScenarios;
  const advantages = serviceAdvantages[service.name] || [];
  const processSteps = serviceProcess[service.name] || [];
  const idealFor = detail?.idealFor || [];
  const cargoTypes = detail?.cargoTypes || [];
  const painPoints = detail?.painPoints || [];
  const consultationChecklist = detail?.consultationChecklist || [];
  const destinationFocus = detail?.destinationFocus || [];
  const customFaqs = detail?.faq || [];
  const pageUrl = `${siteUrl}/services/${service.slug}`;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: detail?.seoDescription || service.description,
    serviceType: service.name,
    provider: {
      "@type": "Organization",
      name: config.company_name || "中欧通联国际物流有限公司",
      url: siteUrl,
    },
    areaServed: ["Europe", "Germany", "Poland", "France", "Netherlands", "Belgium", "Italy", "Spain"],
    audience: {
      "@type": "BusinessAudience",
      audienceType: "跨境电商卖家、外贸企业、制造商、项目客户",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "CNY",
      description: `可根据${service.name}需求提供定制物流方案与报价`,
    },
    url: pageUrl,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "服务项目", item: `${siteUrl}/services` },
      { "@type": "ListItem", position: 3, name: service.name, item: pageUrl },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      ...(customFaqs.length > 0 ? customFaqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })) : [
        {
          "@type": "Question",
          name: `${service.name}适合哪些货物？`,
          acceptedAnswer: {
            "@type": "Answer",
            text: service.suitable_for || scenarios.join(" "),
          },
        },
        {
          "@type": "Question",
          name: `${service.name}一般怎么执行？`,
          acceptedAnswer: {
            "@type": "Answer",
            text: processSteps.length > 0 ? processSteps.join("；") : "通常会先确认货物信息、交付要求与时效，再匹配更合适的运输与交付链路。",
          },
        },
      ]),
    ],
  };

  const relatedLinksJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: relatedServices.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: `${siteUrl}/services/${item.slug}`,
    })),
  };

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {relatedServices.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(relatedLinksJsonLd) }} />}
      <Navbar />

      <section className="relative pt-24 pb-16 bg-navy">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold mb-4">服务详情页</p>
          <h1 className="text-4xl md:text-5xl font-serif text-white font-bold mb-4">{service.name}</h1>
          <p className="text-gray-300 max-w-3xl mx-auto text-lg">{detail?.seoDescription || service.description}</p>
          {detail?.keywords?.length ? (
            <p className="text-sm text-white/70 max-w-4xl mx-auto mt-5 leading-7">
              关键词覆盖：{detail.keywords.join("、")}
            </p>
          ) : null}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Icon className="w-7 h-7 text-gold" />
                </div>
                <div>
                  <p className="text-sm text-gold">中国到欧洲物流服务</p>
                  <h2 className="text-3xl font-serif text-navy font-bold">{service.name}方案说明</h2>
                </div>
              </div>

              <p className="text-gray-600 leading-8 mb-6">{detail?.intro || service.content || service.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-2xl border border-gray-100 bg-bg p-5">
                  <p className="text-sm text-gray-500 mb-1">参考时效</p>
                  <p className="text-lg font-semibold text-navy">{service.transit_time || "按具体方案评估"}</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-bg p-5">
                  <p className="text-sm text-gray-500 mb-1">适合货物</p>
                  <p className="text-lg font-semibold text-navy">{service.suitable_for || "需结合货物信息评估"}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <TrackedLink href="/contact" className="btn-primary" eventName="cta_click" eventParams={{ location: `service_detail_${service.slug}`, target: "/contact" }}>
                  获取{service.name}方案与报价
                </TrackedLink>
                <TrackedLink href="/services" className="btn-secondary" eventName="cta_click" eventParams={{ location: `service_detail_${service.slug}`, target: "/services" }}>
                  返回服务总览页
                </TrackedLink>
              </div>
            </div>

            <div>
              <div className="relative h-80 md:h-[420px] rounded-3xl overflow-hidden shadow-xl">
                {service.image ? (
                  <Image src={service.image} alt={service.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-navy via-navy to-gold/70 flex items-center justify-center">
                    <div className="text-center text-white px-8">
                      <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                        <span className="text-4xl font-bold">SE</span>
                      </div>
                      <p className="text-3xl font-serif font-bold mb-3">{service.name}</p>
                      <p className="text-white/80 text-sm">建议在后台补充该服务的真实运输或交付场景图片。</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-bg border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-white border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-serif text-navy font-bold mb-5">适用场景</h2>
            <ul className="space-y-3 list-disc pl-5 text-gray-600 leading-7">
              {scenarios.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-serif text-navy font-bold mb-5">服务优势</h2>
            <div className="flex flex-wrap gap-2">
              {advantages.length > 0 ? advantages.map((item) => (
                <span key={item} className="inline-flex items-center rounded-full bg-gold/10 px-3 py-1.5 text-sm text-navy">{item}</span>
              )) : <p className="text-gray-600">可根据货物属性、清关要求与交付时效做方案匹配。</p>}
            </div>
          </div>
        </div>
      </section>

      {(idealFor.length > 0 || cargoTypes.length > 0) && (
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {idealFor.length > 0 && (
              <div className="rounded-3xl bg-bg border border-gray-100 p-8 shadow-sm">
                <h2 className="text-2xl font-serif text-navy font-bold mb-5">这项服务更适合哪些客户</h2>
                <ul className="space-y-3 list-disc pl-5 text-gray-600 leading-7">
                  {idealFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {cargoTypes.length > 0 && (
              <div className="rounded-3xl bg-bg border border-gray-100 p-8 shadow-sm">
                <h2 className="text-2xl font-serif text-navy font-bold mb-5">常见适合货物</h2>
                <ul className="space-y-3 list-disc pl-5 text-gray-600 leading-7">
                  {cargoTypes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-bg border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-serif text-navy font-bold mb-5">{service.name}服务流程</h2>
            <ol className="space-y-3 list-decimal pl-5 text-gray-600 leading-7">
              {(processSteps.length > 0 ? processSteps : ["先确认货物信息与时效要求", "根据路线、清关与尾程条件匹配更合适的执行方案", "确认执行节奏后安排出运与交付跟进"]).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {(painPoints.length > 0 || consultationChecklist.length > 0 || destinationFocus.length > 0) && (
        <section className="py-16 bg-bg border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
            {painPoints.length > 0 && (
              <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm">
                <h2 className="text-2xl font-serif text-navy font-bold mb-5">客户常见顾虑</h2>
                <ul className="space-y-3 list-disc pl-5 text-gray-600 leading-7">
                  {painPoints.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {consultationChecklist.length > 0 && (
              <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm">
                <h2 className="text-2xl font-serif text-navy font-bold mb-5">咨询前建议准备</h2>
                <ul className="space-y-3 list-disc pl-5 text-gray-600 leading-7">
                  {consultationChecklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {destinationFocus.length > 0 && (
              <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm">
                <h2 className="text-2xl font-serif text-navy font-bold mb-5">常见目的地覆盖</h2>
                <div className="flex flex-wrap gap-2">
                  {destinationFocus.map((item) => (
                    <span key={item} className="inline-flex items-center rounded-full bg-gold/10 px-3 py-1.5 text-sm text-navy">{item}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {caseItem && (
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif text-navy font-bold mb-4">{service.name}案例化场景说明</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">不用只讲抽象服务，把真实业务里更常见的使用场景、难点和解决思路直接说清楚。</p>
            </div>
            <div className="rounded-3xl border border-gray-100 bg-bg p-8 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gold mb-3">典型业务案例</p>
                <h3 className="text-2xl font-serif text-navy font-bold mb-4">{caseItem.title}</h3>
                <p className="text-gray-600 leading-8">{caseItem.summary}</p>
              </div>
              <div className="space-y-4 text-gray-600 leading-7">
                <p><span className="font-semibold text-navy">场景：</span>{caseItem.scenario}</p>
                <p><span className="font-semibold text-navy">难点：</span>{caseItem.challenge}</p>
                <p><span className="font-semibold text-navy">思路：</span>{caseItem.solution}</p>
                <p><span className="font-semibold text-navy">结果：</span>{caseItem.result}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-navy p-8 md:p-10 text-white shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.9fr] gap-8 items-center">
              <div>
                <p className="text-gold mb-3">转化型咨询引导</p>
                <h2 className="text-3xl font-serif font-bold mb-4">{detail?.conversionTitle || `需要${service.name}方案？先把货物基本信息发给我们`}</h2>
                <p className="text-white/80 leading-8 mb-6">{detail?.conversionDescription || `把货物品名、件数、重量体积、目的地和交付要求发来，我们会先帮你判断${service.name}是否适合，并给出更贴近业务场景的建议。`}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <TrackedLink href="/contact" className="btn-primary" eventName="cta_click" eventParams={{ location: `service_detail_conversion_${service.slug}`, target: "/contact" }}>
                    提交{service.name}询价
                  </TrackedLink>
                  <TrackedLink href="/contact" className="btn-secondary border-white/30 text-white hover:bg-white hover:text-navy" eventName="cta_click" eventParams={{ location: `service_detail_conversion_${service.slug}`, target: "/contact#form" }}>
                    获取一对一方案建议
                  </TrackedLink>
                </div>
              </div>
              <InquiryChecklistCard
                title={inquiryTemplateContent.service.title}
                items={consultationChecklist.length > 0 ? [...consultationChecklist, ...inquiryTemplateContent.service.items.slice(3)] : inquiryTemplateContent.service.items}
                tips={inquiryTemplateContent.service.tips}
              />
            </div>
          </div>
        </div>
      </section>

      {customFaqs.length > 0 && (
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif text-navy font-bold mb-4">{service.name}常见问题</h2>
              <p className="text-gray-600">把客户在咨询这项服务前最常问的问题先说清楚。</p>
            </div>
            <div className="space-y-4">
              {customFaqs.map((item) => (
                <div key={item.question} className="rounded-2xl border border-gray-100 bg-bg p-6">
                  <h3 className="text-lg font-semibold text-navy mb-3">{item.question}</h3>
                  <p className="text-gray-600 leading-7">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedServices.length > 0 && (
        <section className="py-16 bg-bg border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4 mb-10">
              <div>
                <h2 className="text-3xl font-serif text-navy font-bold mb-3">相关服务页面</h2>
                <p className="text-gray-600">如果你的需求不只涉及这一项，可以继续查看下面这些高意图服务详情页。</p>
              </div>
              <Link href="/services" className="text-gold font-medium hover:underline">返回服务总览</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {relatedServices.map((item) => (
                <Link key={item.slug} href={`/services/${item.slug}`} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow group">
                  <h3 className="text-xl font-serif text-navy font-bold mb-3 group-hover:text-gold transition-colors">{item.name}</h3>
                  <p className="text-gray-600 text-sm leading-7 line-clamp-4 mb-4">{item.description}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-navy group-hover:text-gold transition-colors">
                    查看{item.name}详情
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
