import './globals.css'

import { Toast } from '@heroui/react'
import { Analytics } from '@vercel/analytics/next'
import { MotionConfig } from 'motion/react'
import { ThemeProvider } from 'next-themes'

import { GoogleUtilities, MicrosoftClarity } from '@/components/Analytics'
import Footer from '@/components/Footer'
import FullLoading from '@/components/FullLoading'
import pkg from '#/package.json'

import Provider from './Provider'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME}`,
    default: `${process.env.NEXT_PUBLIC_APP_TITLE} | ${process.env.NEXT_PUBLIC_APP_NAME}`,
  },
  description: process.env.NEXT_PUBLIC_APP_DESC,
  keywords: process.env.NEXT_PUBLIC_APP_KEYWORDS,
  authors: [{ name: process.env.NEXT_PUBLIC_COPYRIGHT, url: pkg.author.url }],
  creator: process.env.NEXT_PUBLIC_COPYRIGHT,
  publisher: process.env.NEXT_PUBLIC_COPYRIGHT,
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description: process.env.NEXT_PUBLIC_APP_DESC,
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: process.env.NEXT_PUBLIC_APP_NAME,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og.png`,
        width: 1200,
        height: 630,
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description: process.env.NEXT_PUBLIC_APP_DESC,
    creator: 'baiwumm',
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/og.png`],
  },
  manifest: `${process.env.NEXT_PUBLIC_APP_URL}/manifest.json`,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="version" content={pkg.version} />
        <meta name="apple-mobile-web-app-title" content="Easy Api" />
        {/* 预连接字体 CDN，缩短样式表下载前的 DNS/TCP/TLS 握手耗时 */}
        <link crossOrigin="anonymous" href="https://cdn.baiwumm.com" rel="preconnect" />
        {/* 字体样式表（RSC 中 link 不能带事件处理器，保持同步加载与原始行为一致） */}
        <link href="https://cdn.baiwumm.com/fonts/MapleMono-CN-Regular/result.css" rel="stylesheet" />
        {/* 页面刷新时清除分类锚点 hash：阻止浏览器原生定位导致"刷新后自动滚动"；
            直接访问带 #cat- 的分享链接（非刷新）仍会正常定位到分类 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var e=performance.getEntriesByType&&performance.getEntriesByType("navigation")[0];if(e&&e.type==="reload"&&location.hash){history.replaceState(null,"",location.pathname+location.search)}}catch(err){}})();`,
          }}
        />
      </head>
      <body className="bg-background text-foreground flex min-h-screen flex-col">
        <ThemeProvider attribute="class" enableSystem={false}>
          <MotionConfig reducedMotion="user">
            <FullLoading>
              <Provider>
                {children}
              </Provider>
            </FullLoading>
            <Toast.Provider placement="top" />
          </MotionConfig>
        </ThemeProvider>
        {/* 底部版权：纯展示组件，作为 RSC 渲染，不进入客户端 bundle */}
        <Footer />
        {/* 统计代码：放在 body 而非 head，符合 next/script 使用约束 */}
        <GoogleUtilities />
        <MicrosoftClarity />
        <Analytics />
      </body>
    </html>
  )
}
