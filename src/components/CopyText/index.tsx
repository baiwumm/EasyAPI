/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-27 10:56:12
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-07-21 15:42:08
 * @Description: 复制文案
 */
"use client";
import type { FC } from "react";

import { Check, CircleXmark, Copy } from "@gravity-ui/icons";
import { Button, toast } from "@heroui/react";
import { useCallback, useRef, useState } from "react";

import { useCopy } from "@/hooks/use-copy";

interface CopyTextProps {
  content: string;
  timeout?: number;
}

const CopyText: FC<CopyTextProps> = ({ content = "", timeout = 3000 }) => {
  const { copy, isSupported } = useCopy();
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

    // 无内容
    if (!content) {
      toast.danger("复制失败，缺少内容!", {
        indicator: <CircleXmark />,
      });

      return;
    }

    // 浏览器不支持
    if (!isSupported) {
      toast.danger("复制失败，当前浏览器不支持！", {
        indicator: <CircleXmark />,
      });

      return;
    }

    try {
      await copy(content);

      setCopied(true);

      resetState();
    } catch {
      toast.danger("复制失败，请手动复制!", {
        indicator: <CircleXmark />,
      });
    }
  }, [content, copied, isSupported, resetState, copy]);

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
