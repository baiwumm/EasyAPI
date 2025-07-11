/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-07-10 10:55:32
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-11 17:25:18
 * @Description: 全局布局文件
 */
import { HeroUIProvider } from "@heroui/react";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from 'next-themes';

import BaiDuAnalytics from '@/components/BaiDuAnalytics'; // 百度统计
import CloudflareAnalytics from '@/components/CloudflareAnalytics'; // Cloudflare Analytics
import Footer from '@/components/Footer'; // 底部布局
import GoogleUtilities from '@/components/GoogleUtilities'; // 谷歌统计
import Header from '@/components/Header'; // 头部布局
import MicrosoftClarity from '@/components/MicrosoftClarity'; // Microsoft Clarity
import UmamiAnalytics from '@/components/UmamiAnalytics'; // Umami Analytics

import pkg from '../../package.json'



export const metadata: Metadata = {
  title: `${process.env.SITE_TITLE} - ${process.env.SITE_DESCRIPTION}`, // 网站标题
  description: process.env.SITE_DESCRIPTION,
  applicationName: process.env.SITE_TITLE, // 应用名称
  authors: { name: pkg.author.name, url: pkg.author.url }, // 网站作者
  keywords: '简单,API,接口,实用工具,新闻资讯', // 网站关键词
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: process.env.SITE_URL,
    title: process.env.SITE_TITLE,
    description: process.env.SITE_DESCRIPTION,
    siteName: process.env.SITE_TITLE,
  },
  twitter: {
    card: 'summary_large_image',
    title: process.env.SITE_TITLE,
    description: process.env.SITE_DESCRIPTION,
    creator: pkg.author.github,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* 百度统计 */}
      <BaiDuAnalytics />
      {/* 微软分析 Clarity 代码 */}
      <MicrosoftClarity />
      {/* 谷歌统计 */}
      <GoogleUtilities />
      {/* umami - 站点统计分析 */}
      <UmamiAnalytics />
      {/* Cloudflare 统计代码 */}
      <CloudflareAnalytics />
      <body>
        <HeroUIProvider>
          <ThemeProvider attribute="class" defaultTheme={process.env.DEFAULT_THEME}>
            {/* 头部布局 */}
            <Header />
            <main>{children}</main>
            {/* 底部 */}
            <Footer />
          </ThemeProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
