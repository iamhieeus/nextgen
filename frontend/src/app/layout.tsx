import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-bvp",
});

export const metadata: Metadata = {
  title: "Cấm Địa – Đọc Truyện Online Miễn Phí",
  description: "Vùng đất của những câu chuyện huyền bí. Đọc truyện tiên hiệp, ngôn tình, huyền huyễn và nhiều thể loại khác.",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
