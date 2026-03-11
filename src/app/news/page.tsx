import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSiteConfig } from "@/lib/data";
import { getPublishedNews } from "@/lib/news";

export default async function NewsPage() {
  const config = await getSiteConfig();
  const news = await getPublishedNews();

  return (
    <main className="min-h-screen">
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
                      <Image src={item.featured_image} alt={item.title} fill className="object-cover" />
                    ) : null}
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-gold mb-3">{item.published_at ? new Date(item.published_at).toLocaleDateString("zh-CN") : "未发布"}</p>
                    <h2 className="text-xl font-serif text-navy font-bold mb-3 line-clamp-2">{item.title}</h2>
                    <p className="text-gray-600 line-clamp-3">{item.summary || "点击查看详情"}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer
        phone={config.company_phone}
        email={config.company_email}
        wechat={config.company_wechat}
        address={config.company_address}
      />
    </main>
  );
}
