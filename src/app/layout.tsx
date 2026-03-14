import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

const siteUrl = "https://sinoeurologistics-atpr.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "中欧通联国际物流有限公司 | Sino Euro Logistics",
    template: "%s | Sino Euro Logistics",
  },
  description: "专业的中欧物流服务商，提供中欧班列、卡航快递、海运整拼柜、派送到门、项目货物运输及欧盟清关服务。",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Sino Euro Logistics",
    title: "中欧通联国际物流有限公司 | Sino Euro Logistics",
    description: "专业的中欧物流服务商，提供中欧班列、卡航快递、海运整拼柜、派送到门、项目货物运输及欧盟清关服务。",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "中欧通联国际物流有限公司 | Sino Euro Logistics",
    description: "专业的中欧物流服务商，提供中欧班列、卡航快递、海运整拼柜、派送到门、项目货物运输及欧盟清关服务。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
