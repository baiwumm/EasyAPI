/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-07-10 10:55:32
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-10 16:02:00
 * @Description: 首页
 */
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client'
import APICard from '@/components/APICard'; // 接口卡片

export default async function Home() {
  // 获取分类及关联的API接口
  const categories = await prisma.category.findMany({
    include: {
      apis: {
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: {
          stats: true,
          category: true
        },
      }
    }
  });

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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 热门接口区块 */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-6">热门接口</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularApis.map(api => (
            <APICard
              key={api.id}
              api={api}
              callCount={api.stats?.[0]?.callCount || 0}
            />
          ))}
        </div>
      </section>

      {/* 分类展示区块 */}
      <section>
        <div className="space-y-8">
          {categories.map(category => (
            <CategorySection
              key={category.id}
              category={category}
              apis={category.apis}
            />
          ))}
        </div>
      </section>
    </div>
  );
}


// 分类区块组件
function CategorySection({
  category,
  apis
}: {
  category: Prisma.CategoryGetPayload<true>;
  apis: Prisma.ApiGetPayload<true>[];
}) {
  return (
    <div key={category.id}>
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        {category.name}
        <span className="ml-2 text-sm text-gray-500">({apis.length})</span>
      </h3>
      {apis.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {apis.map(api => (
            <APICard
              key={api.id}
              api={api}
              callCount={api.stats?.[0]?.callCount || 0}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">暂无接口</p>
      )}
    </div>
  );
}