import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "中欧通联国际物流有限公司 | Sino Euro Logistics",
  description: "专业的中欧物流服务商，提供中欧班列、卡航快递、海运整拼柜、欧盟清关派送到门服务",
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
