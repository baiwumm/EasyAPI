"use client";
import { CircleXmarkFill } from "@gravity-ui/icons";
import { toast } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { createElement } from "react";

import { RESPONSE } from "@/enums";
import { useSwrMutation } from "@/hooks/use-swr";
import { httpRequest } from "@/lib/request";
import { isSuccess } from "@/lib/utils";

interface UseImageGenerationOptions {
  /** 接口路径（不含 /api 前缀），显式传入而不是从 route 推导，避免页面路径与接口路径隐式耦合 */
  apiPath: string;
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
  apiPath,
  params,
  svgResponse,
  jsonSuccessData,
}: UseImageGenerationOptions) {
  const [imgSrc, setImgSrc] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  // 记录「当前持有的 blob URL」，替换、失败、卸载时统一回收（G7）
  const blobUrlRef = useRef("");

  const clearResult = () => {
    setImgSrc("");
    setDownloadUrl("");
  };

  // 换新结果前先释放上一个 blob URL：此前 onError 分支没 revoke，反复失败会泄漏
  const releaseBlobUrl = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = "";
    }
  };

  const { loading, error, trigger } = useSwrMutation(
    `${apiPath}:generate`, // mutation key 加后缀，避免与其他查询 key 冲突
    async () => {
      // 走统一请求层：复用超时与 401 会话过期处理（此前直接 fetch 两项都没有）
      const res = await httpRequest.raw(apiPath, params);

      const contentType = res.headers.get("content-type") || "";

      // JSON 响应：dataurl 的成功结果或业务错误信息，按 code 区分
      if (contentType.includes("application/json")) {
        const { code, msg, data } = (await res.json()) as {
          code: number;
          msg?: string;
          data?: unknown;
        };

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
      return URL.createObjectURL(await res.blob());
    },
    {
      // 网络异常：清掉旧图，避免把旧结果误读为本次生成成功
      onError: () => {
        releaseBlobUrl();
        clearResult();
      },
      onSuccess: (url) => {
        releaseBlobUrl();

        if (url) {
          if (url.startsWith("blob:")) {
            blobUrlRef.current = url;
          }

          setImgSrc(url);
          setDownloadUrl(url);
        } else {
          // 业务失败：清掉旧图
          clearResult();
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
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

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
