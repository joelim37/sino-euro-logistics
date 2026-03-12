import Link from "next/link";
import Image from "next/image";
import { Train, Truck, Ship, FileCheck, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSiteConfig, getServices } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  train: Train,
  truck: Truck,
  ship: Ship,
  "file-check": FileCheck,
};

export default async function ServicesPage() {
  const config = await getSiteConfig();
  const services = await getServices();

  return (
    <main className="min-h-screen">
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
