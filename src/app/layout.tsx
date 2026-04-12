import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import TrackingScripts from "@/components/TrackingScripts";
import "./globals.css";

const siteUrl = "https://sinoeurologistics-atpr.vercel.app";
const defaultTitle = "中欧班列、卡航、海运及欧盟清关到门一站式物流服务 | Sino Euro Logistics";
const defaultDescription = "中欧通联国际物流提供中国到欧洲物流解决方案，覆盖中欧班列、中欧卡航、中欧海运、欧盟清关与欧洲派送到门，服务跨境电商与外贸企业。";
const defaultOgImage = "/og-default.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Sino Euro Logistics",
  },
  description: defaultDescription,
  keywords: ["中欧物流", "中国到欧洲物流", "中欧班列", "中欧卡航", "中欧海运", "欧盟清关", "欧洲派送到门"],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Sino Euro Logistics",
    title: defaultTitle,
    description: defaultDescription,
    locale: "zh_CN",
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "Sino Euro Logistics - China to Europe logistics solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [defaultOgImage],
  },
  category: "logistics",
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
