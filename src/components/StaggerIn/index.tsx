"use client";
import type { ReactNode } from "react";

import { motion } from "motion/react";
import { Children } from "react";

interface StaggerInProps {
  children: ReactNode;
  className?: string;
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { y: 8, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

/**
 * 结果区 stagger 入场容器：逐个 40ms 交错浮现
 * reduced-motion 由全局 MotionConfig（layout.tsx）自动降级
 */
export default function StaggerIn({ children, className }: StaggerInProps) {
  return (
    <motion.div
      animate="visible"
      className={className}
      initial="hidden"
      variants={container}
    >
      {Children.map(Children.toArray(children), (child) => (
        <motion.div variants={item}>{child}</motion.div>
      ))}
    </motion.div>
  );
}
