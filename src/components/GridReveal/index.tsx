"use client";

import type { ComponentProps } from "react";

import { cn } from "@heroui/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import {
  buildTree,
  clamp01,
  createScene,
  drawScene,
  readAverages,
  selfPaced,
  smoothstep,
  COLOR_MS,
  HOLD,
  WAIT_CAP,
  type Scene,
} from "./engine";

export type GridRevealProps = Omit<ComponentProps<"div">, "children"> & {
  src?: string | null;
  alt?: string;
  progress?: number;
  aspect?: number;
  caption?: string;
  estimatedDuration?: number;
  onRevealComplete?: () => void;
  onError?: () => void;
};

const SHIMMER = {
  backgroundImage:
    "linear-gradient(90deg, rgba(255,255,255,0.5) 40%, rgba(255,255,255,0.98) 50%, rgba(255,255,255,0.5) 60%)",
  backgroundSize: "250% 100%",
} as const;

/** 引擎激活边距：距视口 150px 内才挂载 canvas 引擎 */
const ARM_MARGIN = "150px";

function MotionCaption({
  caption,
  finished,
  reduce,
}: {
  caption: string;
  finished: boolean;
  reduce: boolean;
}) {
  return (
    <motion.div
      layout
      animate={{ opacity: finished ? 0 : 1 }}
      className="pointer-events-none absolute bottom-3 left-3 flex h-6 items-center overflow-hidden bg-black/45 px-2.5 backdrop-blur-md"
      style={{ borderRadius: 9999 }}
      transition={{
        opacity: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
        layout: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
      }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={caption}
          animate={{
            opacity: 1,
            ...(reduce || finished
              ? {}
              : { backgroundPosition: ["105% 0%", "-5% 0%"] }),
          }}
          className={cn(
            "block whitespace-nowrap text-[11px] font-medium leading-6",
            reduce ? "text-white/75" : "bg-clip-text text-transparent",
          )}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          layout="position"
          style={reduce ? undefined : SHIMMER}
          transition={{
            duration: reduce ? 0 : 0.28,
            ease: [0.4, 0, 0.2, 1],
            backgroundPosition: {
              duration: 1.6,
              repeat: Infinity,
              repeatDelay: 0.5,
              ease: [0.45, 0, 0.55, 1],
            },
          }}
        >
          {caption}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

export default function GridReveal({
  src,
  alt = "",
  progress,
  aspect = 1,
  caption,
  estimatedDuration = 6000,
  onRevealComplete,
  onError,
  className,
  style,
  ...props
}: GridRevealProps) {
  const reduce = useReducedMotion() ?? false;
  const ratio = Number.isFinite(aspect) && aspect > 0 ? aspect : 1;
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [revealedSrc, setRevealedSrc] = useState<string | null>(null);
  // F7：canvas 引擎只在接近视口时才挂载。首屏外实例保持普通 <img>，
  // 不建格子树、不加载图片进画布、不跑 rAF——random-image 页最多 20 个
  // 实例，滚动不到的就一张懒加载图片的开销
  const [engineMounted, setEngineMounted] = useState(false);
  const progressRef = useRef(progress);
  const durationRef = useRef(estimatedDuration);
  const doneRef = useRef(onRevealComplete);
  const errorRef = useRef(onError);

  useEffect(() => {
    progressRef.current = progress;
    durationRef.current = estimatedDuration;
    doneRef.current = onRevealComplete;
    errorRef.current = onError;
  });

  // 接近视口时激活引擎；reduce-motion 用户永不激活（普通 img 即最终形态）。
  // 环境没有 IntersectionObserver 时不激活——保持普通 img 即为降级形态
  useEffect(() => {
    if (reduce || engineMounted || !src) return;

    const frame = frameRef.current;

    if (!frame) return;

    // 没有 IntersectionObserver 的环境：保持普通 img 即为降级形态
    if (typeof IntersectionObserver !== "function") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setEngineMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: ARM_MARGIN },
    );

    observer.observe(frame);

    return () => observer.disconnect();
  }, [reduce, engineMounted, src]);

  useEffect(() => {
    // 引擎未激活时画布尚未渲染，不建树不跑动画
    if (!engineMounted) return;

    const canvas = canvasRef.current;
    const frame = frameRef.current;

    if (!canvas || !frame) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const { root, branches } = buildTree(ratio);
    const currentSrc = src ?? null;
    const scene: Scene = createScene(ctx, root);

    let loadedAt = -1;
    let cancelled = false;

    const render = (split: number, now: number) => {
      scene.dark = document.documentElement.classList.contains("dark");
      scene.split = split;
      scene.fade = loadedAt < 0 ? 0 : smoothstep(0, COLOR_MS, now - loadedAt);
      drawScene(scene);
    };

    const repaint = () => {
      if (!reduce) {
        render(scene.split, performance.now());

        return;
      }

      const settled = loadedAt < 0 ? performance.now() : loadedAt + COLOR_MS;

      render(scene.image ? 1 : WAIT_CAP, settled);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = frame.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));

      scene.scale = dpr;

      if (width === scene.width && height === scene.height) return;

      scene.width = width;
      scene.height = height;
      canvas.width = width;
      canvas.height = height;
      repaint();
    };

    resize();

    const observer =
      typeof ResizeObserver === "function" ? new ResizeObserver(resize) : null;

    observer?.observe(frame);

    const load = (url: string, withCors: boolean) => {
      const image = new Image();

      if (withCors) {
        image.crossOrigin = "anonymous";
      }

      image.decoding = "async";

      image.onload = () => {
        if (cancelled) return;

        if (!image.naturalWidth || !image.naturalHeight) {
          errorRef.current?.();

          return;
        }

        scene.image = image;
        loadedAt = performance.now();
        scene.hasColors = readAverages(image, root, branches, scene.split);
        setLoadedSrc(currentSrc);

        if (reduce) {
          repaint();
        }
      };

      image.onerror = () => {
        if (cancelled) return;

        if (withCors) {
          load(url, false);
        } else {
          errorRef.current?.();
        }
      };

      image.src = url;
    };

    if (src) {
      load(src, true);
    }

    if (reduce) {
      repaint();

      return () => {
        cancelled = true;
        observer?.disconnect();
      };
    }

    let frameId = 0;
    let last = 0;
    let elapsed = 0;
    let eased = 0;
    let split = 0;
    let fired = false;
    let stopped = false;
    let visible = true;

    const tick = (now: number) => {
      frameId = requestAnimationFrame(tick);

      if (!last) {
        last = now;
      }

      const dt = Math.min((now - last) / 1000, 0.05);

      last = now;
      elapsed += dt;
      scene.clock = elapsed;

      const ready = scene.image !== null;
      const paced = progressRef.current === undefined;
      let target: number;

      if (ready) {
        target = 1;
      } else if (paced) {
        target = selfPaced(elapsed * 1000, durationRef.current);
      } else {
        target = Math.min(clamp01(progressRef.current as number), HOLD);
      }

      eased += (target - eased) * (1 - Math.exp(-dt * 5.5));

      const wanted = Math.min(eased, ready ? 1 : WAIT_CAP);

      split += (wanted - split) * (1 - Math.exp(-dt * 4));
      render(split, now);

      if (!fired && ready && eased > 0.995 && now - loadedAt > COLOR_MS) {
        fired = true;
        setRevealedSrc(currentSrc);
        doneRef.current?.();
      }

      if (fired && split > 0.9995) {
        render(1, now);
        stopped = true;
        cancelAnimationFrame(frameId);
      }
    };

    const start = () => {
      if (stopped) return;

      last = 0;
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(tick);
    };

    const visibility =
      typeof IntersectionObserver === "function"
        ? new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting === visible) return;

              visible = entry.isIntersecting;

              if (visible) {
                start();
              } else {
                cancelAnimationFrame(frameId);
              }
            },
            { rootMargin: ARM_MARGIN },
          )
        : null;

    visibility?.observe(frame);
    start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      observer?.disconnect();
      visibility?.disconnect();
    };
  }, [reduce, ratio, src, engineMounted]);

  useEffect(() => {
    const loaded = loadedSrc === (src ?? null);

    if (reduce && loaded) {
      doneRef.current?.();
    }
  }, [loadedSrc, reduce, src]);

  const loaded = loadedSrc === (src ?? null);
  const revealed = revealedSrc === (src ?? null);
  const finished = reduce ? loaded : revealed;

  return (
    <div
      ref={frameRef}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl bg-default [corner-shape:squircle]",
        className,
      )}
      data-slot="grid-reveal"
      style={{ aspectRatio: ratio, ...style }}
      {...props}
    >
      {/* 引擎激活前：普通 <img>（浏览器原生懒加载），图片加载即视为展示完成 */}
      {src && !engineMounted ? (
        // eslint-disable-next-line @next/next/no-img-element -- picsum 跨域外链需原样直出，next/image 要配 remotePatterns（next.config.ts 禁改）；引擎激活后此 img 即卸载
        <img
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          decoding="async"
          loading="lazy"
          src={src}
          onError={() => errorRef.current?.()}
          onLoad={() => {
            setLoadedSrc(src);
            doneRef.current?.();
          }}
        />
      ) : null}

      {engineMounted ? (
        <canvas
          ref={canvasRef}
          className="block h-full w-full"
          {...(alt
            ? { role: "img", "aria-label": alt }
            : { "aria-hidden": true })}
        />
      ) : null}

      {caption ? (
        <MotionCaption caption={caption} finished={finished} reduce={reduce} />
      ) : null}
    </div>
  );
}
