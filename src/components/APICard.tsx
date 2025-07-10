/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-07-10 15:28:34
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-10 16:59:35
 * @Description: 接口卡片
 */
'use client'
import { useState } from 'react';
import { Prisma } from '@prisma/client';
import Link from 'next/link';

export default function APICard({ api, callCount }: {
  api: Prisma.ApiGetPayload<{ include: { category: true } }>;
  callCount: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link href={`/apis/${api.path}`} target='_blank' className="block">
      <div
        className={`card-base animated-border animate-fade after:border-green-500/50 dark:after:border-green-400/50 ${isHovered ? '' : 'hovered'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start justify-between relative">
          <div className="flex flex-col gap-2">
            <div className="text--lg font-bold text-gray-900 dark:text-gray-100">
              <span>{api.name}</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {api.description}
            </div>
            <div className="mt-1text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              <span>{callCount}</span>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400" />
        </div>
      </div>
    </Link>
  );
}