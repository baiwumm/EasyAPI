/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-07-11 11:22:45
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-11 16:47:41
 * @Description: 分类区域卡片
 */
import { Alert } from "@heroui/react";
import { Api, Category } from '@prisma/client';

import APICard from '@/components/APICard'; // 接口卡片
import prisma from '@/lib/prisma';


export default async function CategoryCard() {
  // 获取分类及关联的API接口
  const categories = await prisma.category.findMany({
    include: {
      apis: {
        orderBy: { createdAt: 'desc' },
        include: {
          category: true
        },
      }
    }
  });
  return categories?.length ? (
    <div className="space-y-8">
      {categories.map(category => (
        <CategorySection
          key={category.id}
          category={category}
          apis={category.apis}
        />
      ))}
    </div>
  ) : null
}

// 分类区块组件
function CategorySection({
  category,
  apis
}: {
  category: Category;
  apis: Api[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xl font-semibold flex items-center">
        {category.name}
        <span className="ml-2 text-xs text-gray-500">({category.description})</span>
      </h3>
      {apis.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-4">
          {apis.map(api => (
            <APICard key={api.id} api={api} />
          ))}
        </div>
      ) : (
        // 空数据提示
        <div className="flex items-center justify-center w-full">
          <div className="flex flex-col w-full">
            <div className="w-full flex items-center">
              <Alert color="default" title="此分类暂无数据" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}