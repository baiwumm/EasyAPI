/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-07-10 13:56:00
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-10 13:57:50
 * @Description: 详情页
 */
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function APIDetailPage({
  params
}: {
  params: { path: string };
}) {
  // 获取接口详情
  const api = await prisma.api.findUnique({
    where: { path: params.path },
    include: {
      category: true,
      stats: true
    }
  });

  if (!api) return notFound();

  // 更新调用统计
  await prisma.apiStat.upsert({
    where: { apiId: api.id },
    create: { apiId: api.id, callCount: 1 },
    update: { callCount: { increment: 1 }, lastCalled: new Date() }
  });

  // 解析JSON字段
  const responseExample = api.responseFormat
    ? JSON.stringify(api.responseFormat, null, 2)
    : '{}';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* 头部信息 */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {api.category.name}
            </span>
            <span className="text-sm text-gray-500">
              调用次数: {api.stats?.[0]?.callCount || 0}
            </span>
          </div>
          <h1 className="text-3xl font-bold">{api.name}</h1>
          <p className="text-xl text-gray-600 mt-2">{api.description}</p>
        </header>

        {/* 基础信息卡片 */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">请求方式</h3>
            <code className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
              {api.method}
            </code>
          </div>
          <div>
            <h3 className="font-semibold mb-2">接口路径</h3>
            <code className="bg-gray-200 px-3 py-1 rounded">
              /{api.path}
            </code>
          </div>
        </div>

        {/* 返回结果示例 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">返回示例</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            {responseExample}
          </pre>
        </section>

        {/* 在线测试区块 */}
        <section>
          <h2 className="text-xl font-semibold mb-4">在线测试</h2>
          <div className="border rounded-lg p-6">
            <div className="flex gap-4">
              <select className="border rounded px-3 py-2">
                <option>{api.method}</option>
              </select>
              <code className="flex-1 bg-gray-100 px-3 py-2 rounded">
                {process.env.NEXT_PUBLIC_SITE_URL}/api{api.path}
              </code>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded">
                发送
              </button>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded" id="test-result">
              响应结果将显示在这里...
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const apis = await prisma.api.findMany({
    select: { path: true }
  });
  return apis.map(api => ({ path: api.path }));
}