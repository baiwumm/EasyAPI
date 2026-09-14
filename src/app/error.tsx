"use client";
/*
 * @Description: 根级错误边界
 * 此前项目没有任何 error.tsx，RSC 抛错（如 bing-wallpaper 首次抓取失败）
 * 会直接落到 Next 默认错误页；此处用品牌化 UI 兜底并支持重试
 */
import type { FC } from "react";

import AlertContent from "@/components/AlertContent";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const Error: FC<ErrorProps> = ({ error, reset }) => {
  // 客户端渲染错误默认无日志（RSC 错误由服务端记录），此处留痕便于排查
  // eslint-disable-next-line no-console
  console.error(error);

  return (
    <div className="flex-1 flex justify-center items-center">
      <AlertContent
        actionText="重试"
        buttonAction={reset}
        description="页面出现异常，请稍后重试。"
        status="danger"
        title="页面出错了"
      />
    </div>
  );
};

export default Error;
