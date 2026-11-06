import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 서버 없이 배포할 수 있도록 정적 파일로 내보냅니다
  output: "export",
  // GitHub Pages는 저장소 이름이 경로에 붙습니다
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  images: { unoptimized: true },
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
