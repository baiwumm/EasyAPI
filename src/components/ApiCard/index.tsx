/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-25 11:10:45
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-02-25 14:16:49
 * @Description: 接口卡片
 */
"use client";
import { Star } from '@gravity-ui/icons';
import { Card, Chip, cn } from '@heroui/react';
import NumberFlow from '@number-flow/react';
import { useRouter } from 'next/navigation';
import { type FC, memo } from 'react';

type ApiCardProps = {
  data: App.Api;
}

const ApiCard: FC<ApiCardProps> = memo(function ApiCard({ data }) {
  const router = useRouter();
  const { name, desc, path, method, call_count = 0 } = data || {};
  return (
    <Card
      className={cn("flex flex-col h-full relative overflow-hidden shadow-lg rounded-4xl transition-transform duration-300 hover:-translate-y-1.5 animated-border animate-fade after:border-(--accent)")}
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
        {/* 调用次数 */}
        <div className="flex items-center gap-1 text-xs text-muted">
          <Star className="size-3" />
          <NumberFlow value={call_count} format={{ notation: "compact" }} />
        </div>
      </Card.Footer>
      <div className="absolute right-2 top-2 flex gap-1">
        <Chip color="success" variant='soft' size='sm'>{method}</Chip>
      </div>
    </Card>
  )
})
export default ApiCard;