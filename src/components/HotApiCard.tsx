/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-07-11 10:33:30
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-11 11:14:36
 * @Description: 热门卡片
 */
import prisma from '@/lib/prisma';
import APICard from '@/components/APICard'; // 接口卡片
import { Alert } from "@heroui/react";

export default async function HotApiCard() {
  // 获取热门接口
  const apis = await prisma.api.findMany({
    include: {
      stats: { orderBy: { callCount: 'desc' }, take: 1 }, // 获取最新统计
      category: true
    },
    take: 6
  });

  // 客户端排序（如果必须按统计值排序）
  const popularApis = apis.sort((a, b) =>
    (b.stats[0]?.callCount || 0) - (a.stats[0]?.callCount || 0)
  );
  return popularApis?.length ? (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4">
      {popularApis.map(api => (
        <APICard
          key={api.id}
          api={api}
          callCount={api.stats?.[0]?.callCount || 0}
        />
      ))}
    </div>
  ) : (
    // 空数据提示
    <div className="flex items-center justify-center w-full">
      <div className="flex flex-col w-full">
        <div className="w-full flex items-center">
          <Alert color="default" title="暂无数据" />
        </div>
      </div>
    </div>
  )
}