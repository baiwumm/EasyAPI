import { Typography } from "@heroui/react";
import Image from "next/image";

import CopyText from "@/components/CopyText";
import ToolPage from "@/components/ToolPage";
import { getBingWallpaper } from "@/lib/server/bing-wallpaper";
import { createPageMetadata } from "@/lib/seo";
import { getUrl } from "@/lib/utils";

/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 14:42:52
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-02 14:11:14
 * @Description: Bing 每日壁纸
 */

const seo = {
  title: "Bing 每日壁纸",
  description:
    "Bing 每日壁纸在线预览：每天返回当天 1080P 与 4K 高清地址及壁纸标题，一天内结果不变，适合做每日背景图或壁纸应用数据源。",
  path: "/bing-wallpaper",
};

export const metadata = createPageMetadata(seo);

// 每日壁纸一天内不变，页面级 ISR 缓存 24 小时
export const revalidate = 86400;

export default async function BingWallpaper() {
  // 模块级缓存：每日壁纸一天内不变，避免每次访问重复请求 Bing
  const wallpaper = await getBingWallpaper();

  return (
    <ToolPage seo={seo}>
      <div className="flex-1 flex flex-col justify-between gap-4">
        <Typography
          className="text-2xl font-black shrink-0 tracking-normal"
          type="h1"
        >
          {seo.title}
        </Typography>
        <div className="relative flex-1 w-full h-full">
          <Image
            fill
            alt={wallpaper.title}
            className="object-cover rounded-2xl"
            src={getUrl(wallpaper.url)}
          />
        </div>
        <div className="flex justify-center shrink-0">
          <CopyText content={wallpaper.url} />
        </div>
      </div>
    </ToolPage>
  );
}
