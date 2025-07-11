/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-07-10 10:55:32
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-11 11:30:12
 * @Description: 首页
 */
import { Spinner } from "@heroui/react";
import { Icon } from '@iconify/react';
import { Suspense } from 'react'

import CategoryCard from '@/components/CategoryCard'; // 分类区域卡片
import HotApiCard from '@/components/HotApiCard'; // 热门卡片


export default async function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 热门接口区块 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">热门接口</h2>
        <Suspense fallback={(
          <div className="flex justify-center items-center min-h-[120px]">
            <Spinner color="default" variant="gradient" label="加载中..." classNames={{ label: "text-sm text-gray-500" }} />
          </div>
        )}>
          <HotApiCard />
        </Suspense>
      </section>

      {/* 分类展示区块 */}
      <section>
        <Suspense fallback={(
          <div className="flex justify-center items-center min-h-[120px]">
            <Icon
              icon="svg-spinners:180-ring-with-bg"
              className="w-12 h-12 text-gray-400 dark:text-gray-300 animate-spin"
            />
          </div>
        )
        }>
          <CategoryCard />
        </Suspense>
      </section>
    </div>
  );
}