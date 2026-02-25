/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-21 17:57:28
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-25 10:56:23
 * @Description: 顶部导航
 */
"use client"
import { AbbrApi, House } from '@gravity-ui/icons';
import { Button, cn, Tooltip } from '@heroui/react';
import Image from 'next/image';
import Link from "next/link";
import { type FC, type ReactNode } from 'react';

import AppSettings from '@/components/AppSettings';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import UserAvatar from '@/components/UserAvatar';
import { useAppStore } from '@/store/useAppStore';
import pkg from '#/package.json';

type Social = {
  name: string;
  url: string;
  icon: ReactNode;
}

const socials: Social[] = [
  {
    name: "文档",
    url: 'https://api-docs.baiwumm.com/',
    icon: <AbbrApi />
  }
]

const Header: FC = () => {
  const fixedHeader = useAppStore(state => state.fixedHeader);
  return (
    <header className={cn("top-0 border-b border-default h-15 z-20 backdrop-blur-sm", fixedHeader ? 'sticky' : 'static')} id="header">
      <div className="flex justify-between items-center container mx-auto h-full px-4">
        {/* 左侧 Logo */}
        <Link href="/">
          <Image src='/logo.png' width={120} height={32} alt="Logo" />
        </Link>
        {/* 右侧区域 */}
        <div className="flex items-center gap-2">
          <AppSettings />
          <ThemeSwitcher />
          {socials.map(({ name, url, icon }) => (
            <Tooltip key={name} delay={0}>
              <Link href={url} aria-label={name} target="_blank">
                <Button variant="outline" isIconOnly size='sm' className="rounded-full">
                  {icon}
                </Button>
              </Link>
              <Tooltip.Content showArrow>
                <Tooltip.Arrow />
                {name}
              </Tooltip.Content>
            </Tooltip>
          ))}
          <Tooltip>
            <Link href={pkg.author.url} aria-label="主页" target="_blank">
              <Button variant="outline" isIconOnly size='sm' className="rounded-full">
                <House />
              </Button>
            </Link>
            <Tooltip.Content showArrow>
              <Tooltip.Arrow />
              博客
            </Tooltip.Content>
          </Tooltip>
          {/* 登录用户信息 */}
          <UserAvatar />
        </div>
      </div>
    </header >
  )
}
export default Header;