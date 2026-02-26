/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-25 11:10:45
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-26 10:48:28
 * @Description: 接口卡片
 */
"use client";
import { useRouter } from '@bprogress/next/app';
import { Pin, Star, ThumbsUp } from '@gravity-ui/icons';
import { Card, Chip, cn } from '@heroui/react';
import { type FC, memo } from 'react';

type ApiCardProps = {
  data: App.Api;
}

const ApiCard: FC<ApiCardProps> = memo(function ApiCard({ data }) {
  const router = useRouter();
  const { name, desc, path, method, call_count = 0, pinned, is_featured } = data || {};

  const formatter = new Intl.NumberFormat('zh-CN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  });
  return (
    <Card
      className={cn("flex flex-col h-full relative overflow-hidden shadow-lg rounded-4xl transition-transform duration-300 hover:-translate-y-1.5 animated-border animate-fade after:border-(--accent) cursor-pointer")}
      onMouseEnter={(e) => {
        e.currentTarget.classList.add('hovered');
      }}
      onClick={() => router.push(path)}
    >
      <Card.Header>
        <Card.Title className="text-lg font-bold">{name}</Card.Title>
        {desc ? (
          <Card.Description className="text-xs overflow-hidden line-clamp-2 wrap-break-word mt-1">{desc}</Card.Description>
        ) : null}
      </Card.Header>
      <Card.Footer className="flex justify-end">
        <div className='flex items-center gap-2 text-xs text-muted'>
          {/* 调用次数 */}
          <div className="flex items-center gap-1">
            <Star className="size-3" />
            <span>{formatter.format(call_count)}</span>
          </div>
          {/* 置顶 */}
          {pinned ? (
            <div className="flex items-center gap-1">
              <Pin className="size-3" />
              <span>置顶</span>
            </div>
          ) : null}
          {/* 推荐 */}
          {is_featured ? (
            <div className="flex items-center gap-1">
              <ThumbsUp className="size-3" />
              <span>推荐</span>
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