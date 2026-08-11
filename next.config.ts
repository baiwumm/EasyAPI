import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // 禁用 Vercel 图片优化
  },
  experimental: {
    // @heroui/react 是巨型 barrel，按需映射子路径避免全量解析
    optimizePackageImports: ['@heroui/react'],
  },
}

export default nextConfig
