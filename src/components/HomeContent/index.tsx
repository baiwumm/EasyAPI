/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-08-10 10:00:00
 * @Description: 首页内容（客户端展示层）
 */
'use client'
import { DatabaseFill, Plus } from '@gravity-ui/icons'
import { Button, Typography } from '@heroui/react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

import AlertContent from '@/components/AlertContent'
import ApiCard from '@/components/ApiCard'
import BlurFade from '@/components/BlurFade'
import CategoryIndicator from '@/components/CategoryIndicator'

import type { Variants } from 'motion/react'

// 卡片级出场动画：y + opacity 逐卡 stagger 淡入（blur 由 BlurFade 区块层负责，避免重复开销）
const cardVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}

// 网格容器作为变体节点：继承 BlurFade 的 initial/animate，通过 staggerChildren 编排子卡片
const cardGridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
}

const cardTransition = { duration: 0.4, ease: 'easeOut' } as const

interface HomeContentProps {
  data: App.Category[]
}

export default function HomeContent({ data }: HomeContentProps) {
  const router = useRouter()
  // 简单表达式无需 useMemo
  const list = data ?? []

  const goAdmin = useCallback(() => {
    router.push('/admin')
  }, [router])

  if (!list?.length) {
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
    <>
      <div className="space-y-6">
        {list.map(({ id, name, apis }) => {
          return (
            <BlurFade key={id} id={`cat-${id}`} inView className="flex flex-col gap-2 scroll-mt-24">
              <Typography type="h1" className="text-lg font-black tracking-normal">{name}</Typography>
              {apis?.length
                ? (
                    <motion.div
                      variants={cardGridVariants}
                      className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]"
                    >
                      {apis.map(item => (
                        <motion.div
                          key={item.id}
                          transition={cardTransition}
                          variants={cardVariants}
                          className="h-full"
                        >
                          <ApiCard data={item} />
                        </motion.div>
                      ))}
                    </motion.div>
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
      <CategoryIndicator categories={list} />
    </>
  )
}
