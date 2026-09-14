import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // 修复报告完成后由 fix(#43) 评估关闭
  },
  images: {
    unoptimized: true, // 禁用 Vercel 图片优化
  },
  poweredByHeader: false,
  experimental: {
    // @heroui/react 是巨型 barrel，按需映射子路径避免全量解析
    optimizePackageImports: ["@heroui/react"],
  },
  async headers() {
    // 基础安全响应头（保守集合：不影响功能，站点无被嵌入需求）
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
