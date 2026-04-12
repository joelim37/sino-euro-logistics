import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrackedLink from "@/components/TrackedLink";
import { getSiteConfig } from "@/lib/data";
import { getNewsBySlug } from "@/lib/news";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getNewsBySlug(params.slug);
  if (!article) {
    return { title: "新闻不存在" };
  }

  const shareImage = article.og_image || article.featured_image || undefined;

  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.summary || "",
    keywords: article.seo_keywords || undefined,
    alternates: {
      canonical: `/news/${article.slug}`,
    },
    openGraph: {
      type: "article",
      url: `/news/${article.slug}`,
      title: article.seo_title || article.title,
      description: article.seo_description || article.summary || "",
      images: shareImage ? [shareImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.seo_title || article.title,
      description: article.seo_description || article.summary || "",
      images: shareImage ? [shareImage] : undefined,
    },
  };
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const config = await getSiteConfig();
  const article = await getNewsBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const articleUrl = `https://sinoeurologistics-atpr.vercel.app/news/${article.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.seo_title || article.title,
    description: article.seo_description || article.summary || "",
    image: article.og_image || article.featured_image || undefined,
    datePublished: article.published_at || undefined,
    dateModified: article.updated_at || article.published_at || undefined,
    author: { "@type": "Organization", name: config.company_name || "中欧通联国际物流有限公司" },
    publisher: {
      "@type": "Organization",
      name: config.company_name || "中欧通联国际物流有限公司",
    },
    mainEntityOfPage: articleUrl,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: "https://sinoeurologistics-atpr.vercel.app/" },
      { "@type": "ListItem", position: 2, name: "新闻动态", item: "https://sinoeurologistics-atpr.vercel.app/news" },
      { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
    ],
  };

  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Navbar />

      <section className="relative pt-24 pb-16 bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold mb-4">{article.published_at ? new Date(article.published_at).toLocaleDateString("zh-CN") : "草稿"}</p>
          <h1 className="text-4xl md:text-5xl font-serif text-white font-bold mb-4">{article.title}</h1>
          {article.summary && <p className="text-gray-300 text-lg">{article.summary}</p>}
        </div>
      </section>

      <article className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {article.featured_image && (
            <div className="relative h-80 md:h-[420px] rounded-2xl overflow-hidden mb-10">
              <Image src={article.featured_image} alt={article.featured_image_alt || article.title} fill className="object-cover" style={{ objectPosition: article.featured_image_position || "center center" }} />
            </div>
          )}

          <div className="prose prose-lg max-w-none text-gray-700 leading-8" dangerouslySetInnerHTML={{ __html: article.content || "" }} />

          <div className="mt-12 rounded-3xl bg-navy text-white p-8">
            <h2 className="text-2xl font-serif font-bold mb-3">看完这篇，还不确定你的货该怎么走？</h2>
            <p className="text-gray-300 mb-6 leading-7">如果你正在安排中欧运输、补货、清关或欧洲派送，把货物信息发给我们，我们可以先帮你判断更合适的方案方向。</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <TrackedLink
                href="/contact"
                className="btn-primary"
                eventName="cta_click"
                eventParams={{ location: `news_article_${article.slug}`, target: "/contact" }}
              >
                获取中欧物流运输建议
              </TrackedLink>
              <TrackedLink
                href="/services"
                className="inline-flex items-center justify-center rounded-lg border border-white/15 px-5 py-3 text-white hover:bg-white/10"
                eventName="cta_click"
                eventParams={{ location: `news_article_${article.slug}`, target: "/services" }}
              >
                查看中欧物流服务项目
              </TrackedLink>
            </div>
          </div>
        </div>
      </article>

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
