/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-06 17:25:42
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-07 14:30:41
 * @Description: 底部版权
 */
import type { FC } from "react";

import { Chip, cn, Description, Link, Separator } from "@heroui/react";
import dayjs from "dayjs";
import Image from "next/image";

import { AUTHOR_HANDLE } from "@/lib/author";
import pkg from "#/package.json";

/** 备案入口（label 缺失时整条过滤掉） */
interface IcpLink {
  image: string;
  url: string;
  label: string;
}

// 备案信息（未配置 env 时过滤掉该入口，避免页脚出现 "undefined" 可点链接）
const IcpLinks: IcpLink[] = [
  {
    image: "/icp.png",
    url: "https://beian.miit.gov.cn/#/Integrated/index",
    label: process.env.NEXT_PUBLIC_ICP,
  },
  {
    image: "/gongan.png",
    url: "https://beian.mps.gov.cn/#/query/webSearch",
    label: process.env.NEXT_PUBLIC_GUAN_ICP,
  },
].filter((item): item is IcpLink => !!item.label);

const Footer: FC = () => {
  return (
    <footer
      className="mx-auto w-full container! px-6 py-4 grid grid-cols-1 lg:grid-cols-3 items-center gap-3 lg:gap-4"
      id="footer"
    >
      {/* 三列布局只在 lg（≥1024px）启用：sm~lg 档三等分每列仅约 197px，
          品牌、版权、备案号都会被挤断行 */}
      <div className="flex items-center justify-center gap-3 justify-self-center lg:justify-self-start whitespace-nowrap">
        <div className="w-22.5 h-6 relative">
          <Image fill alt="Logo" src="/logo.png" />
        </div>
        <Separator className="h-4 self-center" orientation="vertical" />
        <Chip
          className="px-2 py-0.5 text-[10px]"
          color="success"
          size="sm"
          variant="soft"
        >
          <div
            className={cn(
              "relative flex size-2 shrink-0 rounded-full bg-success",
              "before:absolute before:inset-0 before:animate-ping before:rounded-full before:bg-inherit motion-reduce:before:animate-none",
              "after:absolute after:inset-0.5 after:rounded-full after:bg-inherit",
            )}
            data-slot="status-indicator"
          />
          <Chip.Label>服务状态正常</Chip.Label>
        </Chip>
      </div>
      <Description className="justify-self-center text-center whitespace-nowrap">
        &copy; {dayjs().year()}{" "}
        <a
          className="hover:text-accent transition-colors"
          href={pkg.author.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          {AUTHOR_HANDLE}
        </a>
        . All rights reserved.
      </Description>
      <div className="flex gap-2 items-center flex-col sm:flex-row justify-self-center lg:justify-self-end whitespace-nowrap">
        {IcpLinks.map(({ image, url, label }) => (
          <Link
            key={url}
            className="flex gap-1 items-center no-underline whitespace-nowrap"
            href={url}
            target="_blank"
          >
            <Image alt={label} height={14} src={image!} width={14} />
            <Description className="hover:text-accent transition-colors">
              {label}
            </Description>
          </Link>
        ))}{" "}
      </div>
    </footer>
  );
};

export default Footer;
