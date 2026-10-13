/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2025-11-20 14:09:32
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-07 18:20:23
 * @Description: 回到顶部
 */
"use client";
import type { FC } from "react";
import type { MotionStyle } from "motion/react";

import { ArrowUp } from "@gravity-ui/icons";
import { ProgressCircle } from "@heroui/react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const MotionProgressCircle = motion.create(ProgressCircle);
const MotionArrowUp = motion.create(ArrowUp);

interface BackTopProps {
  visibilityHeight?: number; // 滚动高度达到此参数值才出现 BackTop
}

// easeOutCubic：减速收尾，比浏览器原生 smooth 滚动更自然
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

// 圆环周长：与 HeroUI ProgressCircle 内部一致（r=16），
// 由 stroke-dashoffset 反推进度，避免每帧 setState 触发 React 重渲染（D3）
const RING_CIRCUMFERENCE = 2 * Math.PI * 16;

// 会触发滚动的按键，用于中断回顶动画（Enter/Space 由按钮 click 处理）
const SCROLL_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
  "Spacebar",
]);

const BackTop: FC<BackTopProps> = ({ visibilityHeight = 150 }) => {
  const { scrollY, scrollYProgress } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  // 平滑进度：spring 让百分比数字柔和过渡，数字本身用 motion value 直接驱动，避免 React re-render
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 25,
    mass: 0.4,
  });
  const percent = useTransform(smoothProgress, (latest) =>
    Math.round(latest * 100),
  );

  // 圆环进度同样由 MotionValue 直接驱动：写成 CSS 变量后交给
  // stroke-dashoffset 消费，滚动时 motion 只写一次 DOM style，
  // 不再每帧 setState 让整个 BackTop 重渲染（D3）
  const ringOffset = useTransform(
    percent,
    (v) => RING_CIRCUMFERENCE * (1 - v / 100),
  );

  const [visible, setVisible] = useState(false);
  const [direction, setDirection] = useState<"up" | "down">("down");
  const [scrolling, setScrolling] = useState(false);

  const lastScrollYRef = useRef(0);
  const lastUpdateRef = useRef(0);
  const scrollingRef = useRef(false);
  const rafRef = useRef(0);

  // 显隐 + 滚动方向（80ms throttle）
  useMotionValueEvent(scrollY, "change", (latest) => {
    // 回顶动画进行中保持可见，避免中途退出时「点击重启」的边界问题
    const shouldShow = latest > visibilityHeight || scrollingRef.current;

    setVisible((prev) => (prev === shouldShow ? prev : shouldShow));

    const now = Date.now();

    if (now - lastUpdateRef.current < 80) return;
    lastUpdateRef.current = now;

    const delta = latest - lastScrollYRef.current;

    lastScrollYRef.current = latest;

    // 回顶动画进行中不更新方向，避免打断箭头动画
    if (scrollingRef.current || Math.abs(delta) <= 4) return;
    setDirection(delta > 0 ? "down" : "up");
  });

  // 结束/取消回顶动画，并按当前实际位置刷新显隐。兜底：动画期间最后一次
  // scroll 事件可能在 scrollingRef 置 false 之前触发，导致到顶后按钮残留
  const finishScrolling = useCallback(() => {
    scrollingRef.current = false;
    setScrolling(false);
    setVisible(window.scrollY > visibilityHeight);
  }, [visibilityHeight]);

  // 回顶动画：自定义缓动，可被再次点击或用户滚动中断
  const scrollToTop = () => {
    // 再次点击 = 取消
    if (scrollingRef.current) {
      cancelAnimationFrame(rafRef.current);
      finishScrolling();

      return;
    }

    const startY = window.scrollY;

    if (startY <= 0) return;

    // 系统偏好减少动态效果时直接跳转
    if (prefersReducedMotion) {
      window.scrollTo(0, 0);

      return;
    }

    // 距离越远用时越长，上限 900ms
    const duration = Math.min(900, 250 + startY * 0.25);
    const startTime = performance.now();
    let prevTarget = startY;

    scrollingRef.current = true;
    setScrolling(true);

    const step = (now: number) => {
      // 上一帧的期望位置与实际位置偏差过大 → 用户拖动滚动条或外部代码接管了滚动，立即让位
      if (Math.abs(window.scrollY - prevTarget) > 24) {
        finishScrolling();

        return;
      }

      const progress = Math.min(1, (now - startTime) / duration);
      const target = Math.round(startY * (1 - easeOutCubic(progress)));

      window.scrollTo(0, target);
      prevTarget = target;

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        finishScrolling();
      }
    };

    rafRef.current = requestAnimationFrame(step);
  };

  // 用户主动滚动（滚轮 / 触摸 / 滚动键）时立即取消回顶动画，让用户随时接管
  useEffect(() => {
    if (!scrolling) return;

    const cancel = () => {
      cancelAnimationFrame(rafRef.current);
      finishScrolling();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      // 输入框内按空格不会滚动、按钮聚焦时空格会触发 click，均由对应元素自己处理，避免双重触发
      const target = event.target as Element | null;

      if (
        target?.closest(
          'button, input, textarea, select, [contenteditable="true"]',
        )
      )
        return;
      if (SCROLL_KEYS.has(event.key)) cancel();
    };

    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchmove", cancel, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchmove", cancel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [scrolling, finishScrolling]);

  // 组件卸载时清理未完成的 rAF
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          animate={{ opacity: 1, y: 0, scale: 1 }}
          aria-label={scrolling ? "停止回到顶部" : "回到顶部"}
          className="backtop fixed right-4 bottom-4 z-50 grid size-10 cursor-pointer place-items-center rounded-full bg-transparent p-0 outline-none select-none focus-visible:ring-2 focus-visible:ring-foreground/40"
          exit={{ opacity: 0, y: 24, scale: 0.5 }}
          initial={{ opacity: 0, y: 24, scale: 0.5 }}
          style={
            {
              // MotionStyle 的类型定义里没有 CSS 变量这一项，这里显式断言
              "--backtop-ring-offset": ringOffset,
            } as MotionStyle
          }
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.85 }}
          onClick={scrollToTop}
        >
          {/* 圆环仅作视觉进度展示，避免与按钮语义重复播报 */}
          <MotionProgressCircle
            aria-hidden="true"
            className="pointer-events-none"
            color="accent"
            size="lg"
            value={0}
          >
            {/* 中间内容 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {scrolling ? (
                  <motion.div
                    key="scrolling"
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      duration: 0.7,
                      repeat: prefersReducedMotion ? 0 : Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <MotionArrowUp className="text-accent" />
                  </motion.div>
                ) : direction === "up" ? (
                  <MotionArrowUp
                    key="arrow"
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="text-accent"
                    exit={{ opacity: 0, y: 6, scale: 0.8 }}
                    initial={{ opacity: 0, y: 6, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  />
                ) : (
                  <motion.span
                    key="percent"
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="text-xs font-medium text-muted tabular-nums"
                    exit={{ opacity: 0, y: -6, scale: 0.8 }}
                    initial={{ opacity: 0, y: -6, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {percent}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* 圆环轨道 */}
            <ProgressCircle.Track>
              <ProgressCircle.TrackCircle strokeWidth={3} />
              {/* 过渡交给上层的 spring，关掉组件自带的 300ms 过渡，
                  否则两段缓动叠在一起会有近 600ms 的滞后感 */}
              <ProgressCircle.FillCircle
                className="transition-none"
                strokeWidth={3}
              />
            </ProgressCircle.Track>
          </MotionProgressCircle>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackTop;
