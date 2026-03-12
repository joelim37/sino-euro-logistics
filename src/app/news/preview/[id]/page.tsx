import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSiteConfig } from "@/lib/data";
import { getNewsPreviewById } from "@/lib/news";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const article = await getNewsPreviewById(params.id);
  if (!article) {
    return { title: "预览不存在" };
  }

  const shareImage = article.og_image || article.featured_image || undefined;

  return {
    title: `${article.seo_title || article.title} - 预览`,
    description: article.seo_description || article.summary || "",
    keywords: article.seo_keywords || undefined,
    robots: { index: false, follow: false },
    openGraph: {
      title: article.seo_title || article.title,
      description: article.seo_description || article.summary || "",
      images: shareImage ? [shareImage] : undefined,
    },
  };
}

export default async function NewsPreviewPage({ params }: { params: { id: string } }) {
  const config = await getSiteConfig();
  const article = await getNewsPreviewById(params.id);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="relative pt-24 pb-16 bg-navy">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-gold/20 text-gold text-sm mb-4">预览模式</div>
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
