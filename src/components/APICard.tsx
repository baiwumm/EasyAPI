/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-07-10 15:28:34
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-25 18:14:36
 * @Description: 接口卡片
 */
'use client'
import { Card, CardBody } from "@heroui/react";
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useState } from 'react';

import type { Api } from '@/lib/type';
import { formatNumberWithUnit } from '@/lib/utils';

type APICardProps = {
  api: Api;
}

export default function APICard({ api }: APICardProps) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link href={`/apis/${api.path}`} target='_blank' className="block">
      <Card
        className={`card-base animated-border animate-fade after:border-green-500/50 dark:after:border-green-400/50 ${isHovered ? '' : 'hovered'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardBody>
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{api.name}</h2>
            <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400" />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-2">
            {api.desc}
          </div>
          <div className="flex justify-end text-xs text-gray-500 mt-4 gap-3">
            <div className="flex items-center gap-1">
              <Icon icon='ri:star-line' />
              <span>{formatNumberWithUnit(api.call_count)}</span>
            </div>
            {api.is_featured ? (
              <div className="flex items-center gap-1">
                <Icon icon='ri:thumb-up-line' />
                <span>推荐</span>
              </div>
            ) : null}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}