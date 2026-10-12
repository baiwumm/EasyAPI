"use client";
import type { ReactNode } from "react";

import { cn } from "@heroui/react";

interface StaggerInProps {
  children: ReactNode;
  className?: string;
}

/**
 * 结果区 stagger 入场容器：逐个 40ms 交错浮现
 * D13：不再给每个 child 包 motion.div（额外包装会破坏 grid/flex 布局），
 * 动画由 CSS 直接落在真实子元素上（globals.css 的 .stagger-in > *），
 * 交错延迟由 nth-child 规则给出；reduced-motion 由 CSS 媒体查询降级，
 * 且 CSS 首帧即生效，不会有 motion 挂载后才隐藏的闪动
 */
export default function StaggerIn({ children, className }: StaggerInProps) {
  return <div className={cn("stagger-in", className)}>{children}</div>;
}
