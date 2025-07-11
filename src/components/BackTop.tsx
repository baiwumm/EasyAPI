/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-07-11 14:56:46
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2025-07-11 14:58:21
 * @Description: 回到顶部
 */
'use client';

import { CircularProgress } from '@heroui/react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function BackTop() {
  // 使用useScroll钩子来追踪滚动信息
  const { scrollYProgress } = useScroll();
  // 滚动百分比
  const [scrollPercentage, setScrollPercentage] = useState<number>(0);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setScrollPercentage(Math.round(latest * 100));
  });

  // 回到顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // 为平滑滚动
    });
  };

  // 保持每次加载时回到顶部
  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <div className="cursor-pointer" onClick={scrollToTop}>
      <CircularProgress
        aria-label="Loading..."
        size="sm"
        value={scrollPercentage}
        color="success"
        formatOptions={{ minimumFractionDigits: 0, maximumFractionDigits: 0 }}
        showValueLabel={true}
      />
    </div>
  );
}