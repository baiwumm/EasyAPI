/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-25 11:10:45
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-07 15:33:53
 * @Description: 接口卡片
 */
"use client";
import { PinFill, StarFill, ThumbsUpFill } from '@gravity-ui/icons';
import { Card, Chip, cn, Description } from '@heroui/react';
import dayjs from 'dayjs';
import Link from 'next/link';
import { type FC, memo } from 'react';

type ApiCardProps = {
  data: App.Api;
}

const ApiCard: FC<ApiCardProps> = memo(function ApiCard({ data }) {
  const { name, desc, path, method, call_count = 0, pinned, is_featured, created_at } = data || {};

  const formatter = new Intl.NumberFormat('zh-CN', {
    notation: 'compact',
    maximumFractionDigits: 2,
  });

  const isNew = dayjs(created_at).isAfter(dayjs().subtract(7, 'day'));
  return (
    <Link href={path}>
      <Card
        className={cn("flex flex-col h-full relative overflow-hidden rounded-4xl transition-transform duration-300 hover:-translate-y-1.5")}
      >
        <Card.Header>
          <div className="flex items-center gap-2 justify-between">
            <div className="flex-1 flex items-center gap-1 min-w-0">
              <Card.Title className="flex-1 truncate text-base font-bold">{name}</Card.Title>
              {isNew && <Chip color='danger' variant='soft' size='sm' className="shrink-0">NEW</Chip>}
            </div>
            <Chip color="success" variant='soft' size='sm' className='shrink-0'>{method}</Chip>
          </div>
          {desc ? (
            <Card.Description className="text-xs overflow-hidden line-clamp-2 wrap-break-word mt-1">{desc}</Card.Description>
          ) : null}
        </Card.Header>
        <Card.Footer className="flex justify-end">
          <div className='flex items-center gap-2 text-xs text-muted'>
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
  )
})
export default ApiCard;