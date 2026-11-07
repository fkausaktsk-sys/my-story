import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "바닥부터 | Saetbyul Kim",
  description: "2010년 table 코딩부터 AI와 일하는 지금까지, 한 층씩 올라온 웹 디자이너 김샛별의 15년.",
  // 공개 전까지 검색엔진 색인을 막습니다
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        {/* 한글 웹폰트: Pretendard */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
