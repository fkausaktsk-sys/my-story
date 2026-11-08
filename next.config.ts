import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 서버 없이 배포할 수 있도록 정적 파일로 내보냅니다
  output: "export",
  // GitHub Pages는 저장소 이름이 경로에 붙습니다
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  images: { unoptimized: true },
  // 개발 중 왼쪽 아래에 뜨는 N 표시를 숨깁니다. 오류가 나면 여전히 화면에 알려 줍니다
  devIndicators: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
