/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-25 11:10:45
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-07 15:33:53
 * @Description: 接口卡片
 */
"use client";
import type { Api } from "@/typings";
import type { FC } from "react";

import { PinFill, StarFill, ThumbsUpFill } from "@gravity-ui/icons";
import { Card, Chip, cn, Description } from "@heroui/react";
import dayjs from "dayjs";
import Link from "next/link";
import { memo, useEffect, useState } from "react";

interface ApiCardProps {
  data: Api;
}

// 模块级常量：避免每次重渲染创建新的 Intl 实例
const formatter = new Intl.NumberFormat("zh-CN", {
  notation: "compact",
  maximumFractionDigits: 2,
});

const ApiCard: FC<ApiCardProps> = memo(function ApiCard({ data }) {
  const {
    name,
    desc,
    path,
    method,
    call_count = 0,
    pinned,
    is_featured,
    created_at,
  } = data || {};

  // 「新」依赖当前时间：在渲染里直接算 dayjs() 会让 SSR 与 CSR 各算一次，
  // created_at 正好压在 7 天边界时出现 hydration mismatch。挂载后再算，
  // 两侧首次渲染保持一致（只差 chip 的出现时机）（G6）
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    setIsNew(dayjs(created_at).isAfter(dayjs().subtract(7, "day")));
  }, [created_at]);

  return (
    // 整卡是一个链接，补 aria-label 让读屏软件能念出「去哪里」而不是一堆子文本
    <Link aria-label={`查看接口：${name ?? ""}`} href={path}>
      <Card
        className={cn(
          "flex flex-col h-full relative overflow-hidden rounded-4xl transition-transform duration-300 hover:-translate-y-1.5",
        )}
      >
        <Card.Header>
          <div className="flex items-center gap-2 justify-between">
            <div className="flex-1 flex items-center gap-1 min-w-0">
              <Card.Title className="flex-1 truncate text-base font-bold">
                {name}
              </Card.Title>
              {isNew && (
                <Chip
                  className="shrink-0"
                  color="danger"
                  size="sm"
                  variant="soft"
                >
                  NEW
                </Chip>
              )}
            </div>
            <Chip className="shrink-0" color="success" size="sm" variant="soft">
              {method}
            </Chip>
          </div>
          {desc ? (
            // line-clamp-2 会截断描述，补 title 让悬停能看到完整文案
            <Card.Description
              className="text-xs overflow-hidden line-clamp-2 wrap-break-word mt-1"
              title={desc}
            >
              {desc}
            </Card.Description>
          ) : null}
        </Card.Header>
        <Card.Footer className="flex justify-end">
          <div className="flex items-center gap-2 text-xs text-muted">
            {/* 调用次数 */}
            <div className="flex items-center gap-0.5">
              <StarFill className="size-3" />
              <Description>{formatter.format(call_count)}</Description>
            </div>
            {/* 置顶 */}
            {pinned ? (
              <div className="flex items-center gap-0.5">
                <PinFill className="size-3" />
                <Description>置顶</Description>
              </div>
            ) : null}
            {/* 推荐 */}
            {is_featured ? (
              <div className="flex items-center gap-0.5">
                <ThumbsUpFill className="size-3" />
                <Description>推荐</Description>
              </div>
            ) : null}
          </div>
        </Card.Footer>
      </Card>
    </Link>
  );
});

export default ApiCard;
