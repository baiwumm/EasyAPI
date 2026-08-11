'use client'

import {
  motion,
  useInView,
} from 'motion/react'
import { useMemo, useRef } from 'react'

import type {
  MotionProps,
  UseInViewOptions,
  Variants,
} from 'motion/react'

interface BlurFadeProps extends MotionProps {
  children: React.ReactNode
  id?: string
  className?: string
  variant?: {
    hidden: { y: number }
    visible: { y: number }
  }
  duration?: number
  delay?: number
  offset?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  inView?: boolean
  inViewMargin?: MarginType
  blur?: string
}

type MarginType = UseInViewOptions['margin']

export default function BlurFade({
  children,
  className,
  variant,
  duration = 0.65,
  delay = 0,
  offset = 20,
  direction = 'up',
  inView = false,
  inViewMargin = '-50px',
  blur = '6px',
  ...props
}: BlurFadeProps) {
  const ref = useRef(null)
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin })
  const isInView = !inView || inViewResult
  // 变体随方向/偏移/模糊参数变化，仅在参数变化时重建，避免每次渲染分配新对象
  const defaultVariants = useMemo<Variants>(() => ({
    hidden: {
      [direction === 'left' || direction === 'right' ? 'x' : 'y']:
        direction === 'right' || direction === 'down' ? -offset : offset,
      opacity: 0,
      filter: `blur(${blur})`,
    },
    visible: {
      [direction === 'left' || direction === 'right' ? 'x' : 'y']: 0,
      opacity: 1,
      filter: 'none',
    },
  }), [direction, offset, blur])
  const combinedVariants = variant || defaultVariants
  return (
    <motion.div
      ref={ref}
      animate={isInView ? 'visible' : 'hidden'}
      exit="hidden"
      initial="hidden"
      transition={{
        delay: 0.04 + delay,
        duration,
        ease: 'easeOut',
      }}
      variants={combinedVariants}
      className={className}
      style={{ willChange: 'transform, opacity, filter' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
