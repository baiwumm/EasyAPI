/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-21 16:33:59
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-07 15:17:37
 * @Description: 首页
 */
"use client";
import { useRequest } from 'ahooks';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';

import AlertContent from '@/components/AlertContent';
import ApiCard from '@/components/ApiCard';
import BlurFade from '@/components/BlurFade';
import SkeletonContent from '@/components/SkeletonContent'
import { get } from '@/lib/utils';
import { getCategorysList } from '@/services/categorys';

const MotionApiCard = motion.create(ApiCard);

export default function Home() {
  const router = useRouter();

  const { data = [], loading, error, run } = useRequest(
    async (params) =>
      get(await getCategorysList(params), 'data.list', []),
    {
      defaultParams: [{ pageIndex: 0, pageSize: 999 }],
    }
  );

  const reload = () => {
    run({ pageIndex: 0, pageSize: 999 });
  };

  const goAdmin = () => {
    router.push('/admin');
  };

  if (loading) {
    return (
      <SkeletonContent />
    );
  }

  if (error) {
    return (
      <div className="w-full flex-1 flex justify-center items-center">
        <AlertContent
          status="danger"
          title="请求失败"
          description="服务暂时不可用，请稍后重试。"
          actionText="重新加载"
          buttonVariant="danger"
          buttonAction={reload}
        />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="w-full flex-1 flex justify-center items-center">
        <AlertContent
          status="accent"
          title="暂无分类数据"
          description="当前还没有任何分类，请前往后台进行添加。"
          actionText="添加分类"
          buttonAction={goAdmin}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.map(({ id, name, apis }: App.Category, index) => {
        return (
          <BlurFade key={id} inView delay={index * 0.04} className="space-y-2">
            <h1 className="text-lg font-black">{name}</h1>
            {apis?.length ? (
              <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]">
                {apis.map((item, idx) => (
                  <MotionApiCard
                    key={item.id}
                    variants={{
                      hidden: { y: 20, opacity: 0, filter: 'blur(6px)' },
                      visible: { y: 0, opacity: 1, filter: 'none' }
                    }}
                    transition={{
                      delay: 0.04 * idx,
                      duration: 0.4,
                      ease: "easeOut"
                    }}
                    data={item}
                  />
                ))}
              </div>
            ) : (
              <div className="flex justify-center p-4">
                <AlertContent
                  status="accent"
                  title="暂无接口数据"
                  description="该分类还没有任何接口，请前往后台进行添加。"
                  actionText="添加接口"
                  buttonAction={goAdmin}
                />
              </div>
            )}
          </BlurFade>
        );
      })}
    </div>
  );
}

