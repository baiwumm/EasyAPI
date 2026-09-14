/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-27 10:56:12
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-21 15:42:08
 * @Description: 复制文案
 */
"use client";
import type { FC } from "react";

import { Check, Copy } from "@gravity-ui/icons";
import { Button } from "@heroui/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useCopy } from "@/hooks/use-copy";

interface CopyTextProps {
  content: string;
  timeout?: number;
}

const CopyText: FC<CopyTextProps> = ({ content = "", timeout = 3000 }) => {
  const { copy } = useCopy();
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 卸载时清理悬空定时器
  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  const resetState = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setCopied(false);
    }, timeout);
  }, [timeout]);

  const handleCopy = useCallback(async () => {
    // 已复制状态时不重复执行
    if (copied) return;

    // 无内容 / 浏览器不支持 / 复制失败均由 useCopy 内部统一 toast，此处无需重复兜底
    const ok = await copy(content);

    if (ok) {
      setCopied(true);

      resetState();
    }
  }, [content, copied, resetState, copy]);

  return (
    <Button
      isDisabled={copied}
      size="sm"
      variant="tertiary"
      onPress={handleCopy}
    >
      {copied ? <Check /> : <Copy />}
      {copied ? "已复制" : "复制"}
    </Button>
  );
};

export default CopyText;
