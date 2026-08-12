import './globals.css'

import { Toast } from '@heroui/react'
import { Analytics } from '@vercel/analytics/next'
import { MotionConfig } from 'motion/react'
import { ThemeProvider } from 'next-themes'

import { GoogleUtilities, MicrosoftClarity } from '@/components/Analytics'
import Footer from '@/components/Footer'
import FullLoading from '@/components/FullLoading'
import MapleMonoFont from '@/components/MapleMonoFont'
import pkg from '#/package.json'

import Provider from './Provider'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://api.baiwumm.com'),
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
        url: `${process.env.NEXT_PUBLIC_APP_URL}/opengraph-image`,
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
    images: [`${process.env.NEXT_PUBLIC_APP_URL}/opengraph-image`],
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
        <meta name="apple-mobile-web-app-title" content={process.env.NEXT_PUBLIC_APP_NAME} />
        {/* Google 统计 */}
        <GoogleUtilities />
        {/* 微软统计 */}
        <MicrosoftClarity />
        {/* Vercel 分析 */}
        <Analytics />
      </head>
      <body className="bg-background text-foreground flex min-h-screen flex-col">
        {/* 远程字体非阻塞加载（水合后注入，避免阻塞首屏渲染） */}
        <MapleMonoFont />
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
      </body>
    </html>
  )
}
