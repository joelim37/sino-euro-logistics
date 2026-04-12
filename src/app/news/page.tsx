import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSiteConfig } from "@/lib/data";
import { getPublishedNews } from "@/lib/news";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "新闻动态 - 中欧物流、清关与欧洲派送行业观察",
  description: "查看中欧物流、欧盟清关、中欧班列、中欧卡航、中欧海运与欧洲派送到门相关的最新新闻动态与实务观察。",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "新闻动态 - 中欧物流、清关与欧洲派送行业观察",
    description: "查看中欧物流、欧盟清关、中欧班列、中欧卡航、中欧海运与欧洲派送到门相关的最新新闻动态与实务观察。",
    url: "/news",
  },
  twitter: {
    card: "summary_large_image",
    title: "新闻动态 - 中欧物流、清关与欧洲派送行业观察",
    description: "查看中欧物流、欧盟清关、中欧班列、中欧卡航、中欧海运与欧洲派送到门相关的最新新闻动态与实务观察。",
  },
};

export default async function NewsPage() {
  const config = await getSiteConfig();
  const news = await getPublishedNews();

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "新闻动态",
    url: "https://sinoeurologistics-atpr.vercel.app/news",
    description: "中欧物流、欧洲清关、班列、卡航、海运与尾程交付相关的新闻与观察。",
    mainEntity: news.map((item) => ({
      "@type": "Article",
      headline: item.title,
      url: `https://sinoeurologistics-atpr.vercel.app/news/${item.slug}`,
      datePublished: item.published_at || item.created_at,
      description: item.summary || undefined,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: "https://sinoeurologistics-atpr.vercel.app/" },
      { "@type": "ListItem", position: 2, name: "新闻动态", item: "https://sinoeurologistics-atpr.vercel.app/news" },
    ],
  };

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Navbar />

      <section className="relative pt-24 pb-16 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white font-bold mb-4">新闻动态</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">查看最新物流资讯、公司动态与行业洞察</p>
        </div>
      </section>

      <section className="py-20 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {news.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-500">暂无已发布新闻</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-56 bg-gray-100">
                    {item.featured_image ? (
                      <Image src={item.featured_image} alt={item.title} fill className="object-cover" style={{ objectPosition: item.featured_image_position || "center center" }} />
                    ) : null}
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-gold mb-3">{item.published_at ? new Date(item.published_at).toLocaleDateString("zh-CN") : "未发布"}</p>
                    <h2 className="text-xl font-serif text-navy font-bold mb-3 line-clamp-2">{item.title}</h2>
                    <p className="text-gray-600 line-clamp-3">{item.summary || "查看这篇中欧物流、清关与欧洲派送相关文章"}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
