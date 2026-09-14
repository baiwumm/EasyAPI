"use client";
import { CircleXmarkFill } from "@gravity-ui/icons";
import { toast } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createElement } from "react";

import { RESPONSE } from "@/enums";
import { useSwrMutation } from "@/hooks/use-swr";
import { isSuccess } from "@/lib/utils";

interface UseImageGenerationOptions {
  /** 生成查询参数（每次 trigger 闭包捕获最新值） */
  params: Record<string, string>;
  /** 响应为 SVG 文本，转 data URL 展示（如 type=format=svg） */
  svgResponse: boolean;
  /** 成功响应本身是 JSON（如 dataurl 格式），从 data 取图片地址 */
  jsonSuccessData: boolean;
}

/**
 * 图片生成页（barcode/qrcode）共享逻辑：
 * - 请求业务接口并对 JSON 错误响应做 toast 兜底（qrcode dataurl 的成功
 *   JSON 由 jsonSuccessData 接管）
 * - blob URL 的创建/替换 revoke/卸载 revoke
 * - 生成失败清空旧图，避免旧结果被误读为本次成功
 * - 挂载自动生成一次 + 下载函数
 */
export function useImageGeneration({
  params,
  svgResponse,
  jsonSuccessData,
}: UseImageGenerationOptions) {
  const pathname = usePathname();
  const [imgSrc, setImgSrc] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const { loading, error, trigger } = useSwrMutation(
    `${pathname}:generate`, // mutation key 加后缀，避免与其他查询 key 冲突
    async () => {
      const searchParams = new URLSearchParams(params);

      const res = await fetch(`/api/${pathname}?${searchParams.toString()}`);

      const contentType = res.headers.get("content-type") || "";

      // JSON 响应：dataurl 的成功结果或业务错误信息，按 code 区分
      if (contentType.includes("application/json")) {
        const { code, msg, data } = await res.json();

        if (jsonSuccessData && isSuccess(code) && typeof data === "string") {
          return data;
        }

        if (!isSuccess(code)) {
          toast.danger(msg || RESPONSE.label(RESPONSE.ERROR), {
            indicator: createElement(CircleXmarkFill),
            timeout: 3000,
          });
        }

        return null;
      }

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      if (svgResponse) {
        const svgText = await res.text();

        // 转为 data URL 以便 img 标签显示
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
      }

      // 其他二进制格式
      const blob = await res.blob();

      return URL.createObjectURL(blob);
    },
    {
      // 网络异常：清掉旧图，避免把旧结果误读为本次生成成功
      onError: () => {
        setImgSrc("");
        setDownloadUrl("");
      },
      onSuccess: (url) => {
        if (downloadUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(downloadUrl);
        }
        if (url) {
          setImgSrc(url);
          setDownloadUrl(url);
        } else {
          // 业务失败：清掉旧图
          setImgSrc("");
          setDownloadUrl("");
        }
      },
    },
  );

  // 挂载自动生成一次（等价原自动模式）
  useEffect(() => {
    trigger();
  }, []);

  // 卸载时回收 blob URL
  useEffect(() => {
    return () => {
      if (imgSrc && imgSrc.startsWith("blob:")) {
        URL.revokeObjectURL(imgSrc);
      }
    };
  }, [imgSrc]);

  // 下载图片
  const downloadImage = (filename: string) => {
    if (!downloadUrl) return;
    toast.success("正在下载中...");
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { imgSrc, downloadUrl, loading, error, trigger, downloadImage };
}
