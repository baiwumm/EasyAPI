/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-21 17:57:28
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-09-16 09:20:51
 * @Description: 顶部导航
 */
"use client";
import type { FC, ReactNode } from "react";

import { AbbrApi, HouseFill, LogoGithub } from "@gravity-ui/icons";
import { Button, Tooltip } from "@heroui/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

import ThemeSwitcher from "@/components/ThemeSwitcher";
import TimeAndLunar from "@/components/TimeAndLunar";
import pkg from "#/package.json";

/** 用户头像：依赖 supabase-js，拆为独立 chunk 按需加载 */
const UserAvatar = dynamic(() => import("@/components/UserAvatar"));

interface Social {
  name: string;
  url: string;
  icon: ReactNode;
  /** 外部链接新标签页打开 */
  external?: boolean;
}

const socials: Social[] = [
  {
    name: "接口文档",
    url: "/docs",
    icon: <AbbrApi />,
  },
  {
    name: "GitHub",
    url: "https://github.com/baiwumm/EasyAPI",
    icon: <LogoGithub />,
    external: true,
  },
];

const Header: FC = () => {
  return (
    <header
      className="sticky top-0 p-4 z-20 backdrop-blur-sm container mx-auto flex justify-between items-center"
      id="header"
    >
      {/* 左侧 Logo */}
      <Link href="/">
        <div className="w-30 h-8 relative justify-self-start">
          <Image fill priority alt="Logo" src="/logo.png" />
        </div>
      </Link>
      <TimeAndLunar />
      {/* 右侧区域 */}
      <div className="flex items-center gap-2 justify-self-end">
        <ThemeSwitcher />
        {socials.map(({ name, url, icon, external }) => (
          <Tooltip key={name} delay={0}>
            <Link
              aria-label={name}
              href={url}
              target={external ? "_blank" : undefined}
            >
              <Button isIconOnly size="sm" variant="ghost">
                {icon}
              </Button>
            </Link>
            <Tooltip.Content showArrow>
              <Tooltip.Arrow />
              {name}
            </Tooltip.Content>
          </Tooltip>
        ))}
        {/* 作者个人主页：站外链接，新标签页打开 */}
        <Tooltip>
          <Link aria-label="个人主页" href={pkg.author.url} target="_blank">
            <Button isIconOnly size="sm" variant="ghost">
              <HouseFill />
            </Button>
          </Link>
          <Tooltip.Content showArrow>
            <Tooltip.Arrow />
            个人主页
          </Tooltip.Content>
        </Tooltip>
        {/* 登录用户信息 */}
        <UserAvatar />
      </div>
    </header>
  );
};

export default Header;
