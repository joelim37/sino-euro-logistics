import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

interface FooterProps {
  companyName?: string;
  companyNameEn?: string;
  description?: string;
  phone?: string;
  email?: string;
  wechat?: string;
  address?: string;
}

export default function Footer({
  companyName = "中欧通联国际物流",
  companyNameEn = "Sino Euro Logistics",
  description = "专注中欧物流14年，提供中欧班列、卡航快递、海运整拼柜、欧盟清关派送到门一站式服务。",
  phone = "+86 400-888-8888",
  email = "info@sinoeuro.com",
  wechat = "SinoEuroLogistics",
  address = "深圳市南山区粤海街道科技园南区",
}: FooterProps) {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">SE</span>
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold">
                  {companyName}
                </h2>
                <p className="text-gray-400 text-sm">{companyNameEn}</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              {description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4 text-gold">
              快速链接
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-gold transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-gold transition-colors">
                  服务项目
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-300 hover:text-gold transition-colors">
                  新闻
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-gold transition-colors">
                  关于我们
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-gold transition-colors">
                  联系我们
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4 text-gold">
              联系方式
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Phone size={16} className="text-gold" />
                <span className="text-gray-300">{phone}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} className="text-gold" />
                <span className="text-gray-300">{email}</span>
              </li>
              <li className="flex items-center space-x-2">
                <MessageCircle size={16} className="text-gold" />
                <span className="text-gray-300">{wechat}</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin size={16} className="text-gold mt-1" />
                <span className="text-gray-300">{address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} 中欧通联国际物流有限公司 版权所有
          </p>
        </div>
      </div>
    </footer>
  );
}
