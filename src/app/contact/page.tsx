import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/contact/ContactForm";
import { getSiteConfig } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const config = await getSiteConfig();

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="relative pt-24 pb-16 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-white font-bold mb-4">联系我们</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">填写以下表单，我们的专业团队将尽快与您联系</p>
        </div>
      </section>

      <section className="py-20 bg-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-serif text-navy font-bold mb-6">联系方式</h2>
              <p className="text-gray-600 mb-8">您可以通过以下方式联系我们，或直接填写表单提交询价</p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">电话</h3>
                    <p className="text-gray-600">{config.company_phone || "暂未设置"}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">邮箱</h3>
                    <p className="text-gray-600">{config.company_email || "暂未设置"}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">微信</h3>
                    <p className="text-gray-600">{config.company_wechat || "暂未设置"}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">地址</h3>
                    <p className="text-gray-600">{config.company_address || "暂未设置"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-navy mb-2">WhatsApp</h3>
                <p className="text-gray-600">{config.company_whatsapp || "暂未设置"}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <ContactForm />
            </div>
          </div>
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
