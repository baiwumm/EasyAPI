/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-25 11:10:45
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-06 14:32:47
 * @Description: 接口卡片
 */
"use client";
import { useRouter } from '@bprogress/next/app';
import { Pin, Star, ThumbsUp } from '@gravity-ui/icons';
import { Card, Chip, cn, Description } from '@heroui/react';
import dayjs from 'dayjs';
import { type FC, memo } from 'react';

type ApiCardProps = {
  data: App.Api;
}

const ApiCard: FC<ApiCardProps> = memo(function ApiCard({ data }) {
  const router = useRouter();
  const { name, desc, path, method, call_count = 0, pinned, is_featured, created_at } = data || {};

  const formatter = new Intl.NumberFormat('zh-CN', {
    notation: 'compact',
    maximumFractionDigits: 2,
  });

  const isNew = dayjs(created_at).isAfter(dayjs().subtract(7, 'day'));
  return (
    <Card
      className={cn("flex flex-col h-full relative overflow-hidden shadow-lg rounded-4xl transition-transform duration-300 hover:-translate-y-1.5 animated-border animate-fade after:border-(--accent) cursor-pointer")}
      onMouseEnter={(e) => {
        e.currentTarget.classList.add('hovered');
      }}
      onClick={() => router.push(path)}
    >
      <Card.Header>
        {isNew ? (
          <div className="flex items-center gap-1">
            <Card.Title className="text-lg font-bold">{name}</Card.Title>
            <Chip color='danger' variant='soft' size='sm'>NEW</Chip>
          </div>
        ) : (
          <Card.Title className="text-lg font-bold">{name}</Card.Title>
        )}
        {desc ? (
          <Card.Description className="text-xs overflow-hidden line-clamp-2 wrap-break-word mt-1">{desc}</Card.Description>
        ) : null}
      </Card.Header>
      <Card.Footer className="flex justify-end">
        <div className='flex items-center gap-2 text-xs text-muted'>
          {/* 调用次数 */}
          <div className="flex items-center gap-1">
            <Star className="size-3" />
            <Description>{formatter.format(call_count)}</Description>
          </div>
          {/* 置顶 */}
          {pinned ? (
            <div className="flex items-center gap-1">
              <Pin className="size-3" />
              <Description>置顶</Description>
            </div>
          ) : null}
          {/* 推荐 */}
          {is_featured ? (
            <div className="flex items-center gap-1">
              <ThumbsUp className="size-3" />
              <Description>推荐</Description>
            </div>
          ) : null}
        </div>
      </Card.Footer>
      <div className="absolute right-2 top-2 flex gap-1">
        <Chip color="success" variant='soft' size='sm'>{method}</Chip>
      </div>
    </Card>
  )
})
export default ApiCard;