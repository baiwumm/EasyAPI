/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-07-10 10:55:32
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-10 14:38:46
 * @Description: 首页
 */
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Prisma } from '@prisma/client'

export default async function Home() {
  // 获取分类及关联的API接口
  const categories = await prisma.category.findMany({
    include: {
      apis: {
        where: { isFeatured: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: {
          category: true
        },
      }
    }
  });

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
        <h2 className="text-2xl font-semibold mb-6">热门接口</h2>
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
        <h2 className="text-2xl font-semibold mb-6">全部接口分类</h2>
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

// API卡片组件
function APICard({ api, callCount }: {
  api: Prisma.ApiGetPayload<{ include: { category: true } }>;
  callCount: number;
}) {
  return (
    <Link href={`/apis/${api.path}`} className="block">
      <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold">{api.name}</h3>
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {api.method}
          </span>
        </div>
        <p className="text-gray-600 my-2 line-clamp-2">{api.description}</p>
        <div className="flex justify-between items-center mt-4">
          {api.category && (
            <span className="text-sm text-purple-600">
              {api.category.name}
            </span>
          )}
          <span className="text-sm text-gray-500">{callCount}次调用</span>
        </div>
      </div>
    </Link>
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
              callCount={0}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">暂无接口</p>
      )}
    </div>
  );
}