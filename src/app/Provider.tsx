/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-22 09:42:15
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-02 13:39:07
 * @Description: 上下文提供者
 */
"use client"
import { AppProgressProvider as ProgressProvider } from '@bprogress/next';
import { Toast } from '@heroui/react';
import { useRafInterval } from 'ahooks'
import { MotionConfig } from 'motion/react';
import { useTheme } from "next-themes";
import { type FC, type PropsWithChildren, useState,ViewTransition } from 'react';

import BackTop from '@/components/BackTop';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Squares from '@/components/Squares';
import { THEME_MODE } from '@/enums';
import { useAvailableHeight } from '@/hooks/use-available-height';

const directions = ['diagonal', 'up', 'right', 'down', 'left'] as const

type Direction = typeof directions[number]

const directionSpeedMap = {
  diagonal: 0.35,
  up: 0.15,
  down: 0.15,
  left: 0.25,
  right: 0.25,
} as const

function getRandomDirection(current: Direction): Direction {
  let next = current
  while (next === current) {
    next = directions[Math.floor(Math.random() * directions.length)]
  }
  return next
}

function getSpeed(direction: Direction) {
  const base = directionSpeedMap[direction]
  const noise = (Math.random() - 0.5) * 0.1 // ±0.05扰动
  return Math.max(0.05, base + noise)
}

const Providers: FC<PropsWithChildren> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === THEME_MODE.DARK;
  const [direction, setDirection] = useState<Direction>('diagonal')
  const [speed, setSpeed] = useState(0.2)

  // 计算主体内容高度
  const mainHeight = useAvailableHeight({
    elementIds: ['header', 'footer'],
    debounceMs: 0,
  });

   useRafInterval(() => {
    setDirection((prev) => {
      const next = getRandomDirection(prev)
      setSpeed(getSpeed(next))
      return next
    })
  }, 5000)
  return (
    <MotionConfig reducedMotion="user">
      <ProgressProvider
        color="var(--accent)"
        options={{ showSpinner: true }}
        shallowRouting
      >
        {/* 顶部 */}
        <Header />
        {/* 主体内容 */}
        <ViewTransition name='blur-slide'>
          <main className="container mx-auto p-4 flex flex-col gap-4" style={{ minHeight: mainHeight }}>
            {children}
          </main>
        </ViewTransition>
        {/* 底部版权 */}
        <Footer />
        {/* 背景 */}
        <div className="fixed inset-0 -z-10">
          <Squares
            speed={speed}
            squareSize={40}
            direction={direction}
            borderColor={isDark ? '#3A3A3A' : '#D1D1D1'}
            hoverFillColor={isDark ? '#2C2C2C' : '#B0B0B0'}
          />
        </div>
        <Toast.Provider placement='top' />
        <BackTop />
      </ProgressProvider>
    </MotionConfig>
  );
};
export default Providers;