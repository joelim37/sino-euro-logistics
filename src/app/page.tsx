import Link from "next/link";
import Image from "next/image";
import { Train, Truck, Ship, FileCheck, Clock, Shield, Globe, TrendingUp } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSiteConfig, getServices } from "@/lib/data";

// 服务图标映射
const iconMap: Record<string, React.ElementType> = {
  train: Train,
  truck: Truck,
  ship: Ship,
  "file-check": FileCheck,
};

// 优势列表
const advantages = [
  {
    icon: Clock,
    title: "时效保证",
    description: "14年丰富经验，专业团队操作，确保货物安全准时到达",
  },
  {
    icon: Shield,
    title: "安全保障",
    description: "全程货物追踪，专业保险服务，让您安心托付",
  },
  {
    icon: Globe,
    title: "网络覆盖",
    description: "欧洲全境派送网络，覆盖30+国家，，门到门服务",
  },
  {
    icon: TrendingUp,
    title: "价格优惠",
    description: "一手庄家价格，无中间商赚差价，性价比更高",
  },
];

export default async function HomePage() {
  const config = await getSiteConfig();
  const services = await getServices();

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={config.banner_image || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920"}
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-navy/80" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-serif text-white font-bold mb-6 animate-fade-in-up">
            {config.banner_title || "专注中欧走廊的物流专家"}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {config.banner_subtitle || "14天最快到欧，欧盟清关全托管"}
          </p>
          <Link
            href="/contact"
            className="btn-primary inline-block animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            {config.banner_button_text || "立即咨询"}
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-navy font-bold mb-4">
              我们的服务
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              为您提供全方位的中欧物流一站式解决方案
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => {
              const Icon = iconMap[service.icon] || Train;
              return (
                <Link
                  key={service.id}
                  href="/services"
                  className="service-card group"
                >
                  <div className="w-14 h-14 bg-navy/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-xl font-serif text-navy font-bold mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex items-center text-gold text-sm font-medium">
                    <span>了解更多</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-navy font-bold mb-4">
              为什么选择我们
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              14年行业经验，值得信赖的物流合作伙伴
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-xl hover:bg-bg transition-colors"
                >
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="text-xl font-serif text-navy font-bold mb-2">
                    {advantage.title}
                  </h3>
                  <p className="text-gray-600">{advantage.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white font-bold mb-4">
            准备好开始了吗？
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            立即联系我们，获取专业的中欧物流解决方案报价
          </p>
          <Link href="/contact" className="btn-primary">
            立即咨询
          </Link>
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
