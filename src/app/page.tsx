/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-21 16:33:59
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-15 17:23:32
 * @Description: 首页
 */
'use client'
import { DatabaseFill, Plus } from '@gravity-ui/icons'
import { Button, Typography } from '@heroui/react'
import { useRequest } from 'ahooks'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'

import AlertContent from '@/components/AlertContent'
import ApiCard from '@/components/ApiCard'
import BlurFade from '@/components/BlurFade'
import ErrorContent from '@/components/ErrorContent'
import SkeletonContent from '@/components/SkeletonContent'
import { get } from '@/lib/utils'
import { getCategorysList } from '@/services/categorys'

const MotionApiCard = motion.create(ApiCard)

export default function Home() {
  const router = useRouter()

  const { data = [], loading, error, run } = useRequest(
    async params =>
      get(await getCategorysList(params), 'data.list', []),
    {
      defaultParams: [{ pageIndex: 0, pageSize: 999 }],
    },
  )

  const reload = () => {
    run({ pageIndex: 0, pageSize: 999 })
  }

  const goAdmin = () => {
    router.push('/admin')
  }

  if (loading) {
    return (
      <SkeletonContent />
    )
  }

  if (error) {
    return (
      <ErrorContent refresh={reload} />
    )
  }

  if (!data.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex-1 size-full max-w-xl max-h-100 border-border p-6 bg-surface rounded-2xl text-center flex justify-center items-center">
          <div className="flex flex-col gap-2 items-center">
            <div className="bg-default text-foreground p-4 rounded-full">
              <DatabaseFill className="size-5" />
            </div>
            <Typography type="h5">一切安静如常 🕊️</Typography>
            <Typography type="body-sm">当前还没有任何分类，请前往后台进行添加。</Typography>
            <Button size="sm" variant="primary" onPress={goAdmin}>
              <Plus />
              添加分类
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {data.map(({ id, name, apis }: App.Category, index) => {
        return (
          <BlurFade key={id} delay={index * 0.04} inView className="space-y-2">
            <h1 className="text-lg font-black">{name}</h1>
            {apis?.length
              ? (
                  <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]">
                    {apis.map((item, idx) => (
                      <MotionApiCard
                        key={item.id}
                        data={item}
                        transition={{
                          delay: 0.04 * idx,
                          duration: 0.4,
                          ease: 'easeOut',
                        }}
                        variants={{
                          hidden: { y: 20, opacity: 0, filter: 'blur(6px)' },
                          visible: { y: 0, opacity: 1, filter: 'none' },
                        }}
                      />
                    ))}
                  </div>
                )
              : (
                  <div className="flex justify-center p-4">
                    <AlertContent
                      title="暂无接口数据"
                      actionText="添加接口"
                      buttonAction={goAdmin}
                      description="该分类还没有任何接口，请前往后台进行添加。"
                      status="accent"
                    />
                  </div>
                )}
          </BlurFade>
        )
      })}
    </div>
  )
}
