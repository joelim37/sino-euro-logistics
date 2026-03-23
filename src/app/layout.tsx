import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import TrackingScripts from "@/components/TrackingScripts";
import "./globals.css";

const siteUrl = "https://sinoeurologistics-atpr.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "中欧通联国际物流有限公司 | Sino Euro Logistics",
    template: "%s | Sino Euro Logistics",
  },
  description: "专业的中欧物流服务商，提供中欧班列、卡航快递、海运整拼柜、派送到门、项目货物运输及欧盟清关服务，帮助跨境卖家与外贸企业更稳地把货送到欧洲。",
  keywords: ["中欧物流", "欧洲物流", "中欧班列", "卡航快递", "欧盟清关", "欧洲派送", "国际物流"],
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
    description: "专业的中欧物流服务商，提供中欧班列、卡航快递、海运整拼柜、派送到门、项目货物运输及欧盟清关服务，帮助跨境卖家与外贸企业更稳地把货送到欧洲。",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "中欧通联国际物流有限公司 | Sino Euro Logistics",
    description: "专业的中欧物流服务商，提供中欧班列、卡航快递、海运整拼柜、派送到门、项目货物运输及欧盟清关服务，帮助跨境卖家与外贸企业更稳地把货送到欧洲。",
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
        <TrackingScripts />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
