import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "대구·경북 취업/대외활동 통합 보드",
  description: "대구·경북 지역 채용 정보 자동 수집 보드",
  // 👇 이 한 줄이 핵심입니다! 출발지(우리 웹사이트) 흔적을 완벽하게 지워 방화벽을 통과하게 해줍니다.
  referrer: "no-referrer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}