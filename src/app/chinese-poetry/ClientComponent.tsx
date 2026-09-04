"use client";
import type { FC } from "react";
import type { ClientComponentProps } from "@/typings";

import { QuoteOpen } from "@gravity-ui/icons";
import { Input, Typography } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import AlertContent from "@/components/AlertContent";
import RefreshButton from "@/components/RefreshButton";
import RequestContent from "@/components/RequestContent";
import TypingAnimation from "@/components/TypingAnimation";
import { useSwrQuery } from "@/hooks/use-swr";
import { get } from "@/lib/utils";
import { getApiData } from "@/services/common";

const ClientComponent: FC<ClientComponentProps> = ({ title }) => {
  const pathname = usePathname();
  const [author, setAuthor] = useState("李白");
  const [showFormContent, setShowFormContent] = useState(false);

  // 参数处理
  const params = useMemo(() => ({ author }), [author]);

  // 请求数据
  // 请求数据（key 固定为路由，参数走闭包；点击刷新用 mutate）
  const {
    data = {},
    loading,
    error,
    mutate,
  } = useSwrQuery(pathname, async () =>
    get(await getApiData(pathname, params), "data.[0]", {}),
  );

  // 刷新入口：原 onBefore 的 UI 重置逻辑在请求前执行
  const handleRefresh = () => {
    setShowFormContent(false);
    mutate();
  };

  // 右下角来源信息
  const formContent = useMemo(() => {
    const paragraphs = get(data, "paragraphs", []);
    const author = get(data, "author");
    const title = get(data, "title", "");

    return paragraphs?.length
      ? `—— ${author || ""}${title ? `《${title}》` : ""}`
      : "";
  }, [data]);

  // 稳定引用：避免每次渲染新建函数导致 TypingAnimation 的 effect 重跑
  const onSentenceComplete = useCallback(() => {
    setShowFormContent(true);
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <Typography className="text-2xl font-black tracking-normal" type="h1">
          {title}
        </Typography>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        <RequestContent
          error={error}
          loading={loading}
          loadingText="灵感正在路上..."
          reFresh={handleRefresh}
        >
          {!get(data, "paragraphs", [])?.length ? (
            <AlertContent
              actionText="重新加载"
              buttonAction={handleRefresh}
              buttonVariant="danger"
              description=""
              status="danger"
              title="暂无诗词数据，请重新输入作者名称。"
            />
          ) : (
            <div className="relative max-w-[85%] min-w-[20%]">
              <QuoteOpen className="size-14! absolute -top-10 -left-10 text-muted" />
              <TypingAnimation
                className="text-xl sm:text-2xl py-6"
                loop={false}
                pauseDuration={1500}
                text={get(data, "paragraphs", []).join("\n")}
                typingSpeed={75}
                onSentenceComplete={onSentenceComplete}
              />
              {showFormContent && formContent ? (
                <TypingAnimation
                  className="absolute -bottom-4 right-0 text-muted"
                  loop={false}
                  pauseDuration={1500}
                  showCursor={false}
                  text={formContent}
                  typingSpeed={75}
                />
              ) : null}
            </div>
          )}
        </RequestContent>
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2">
          <Input
            aria-label="作者"
            className="w-64"
            placeholder="请输入诗词作者"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />
          <RefreshButton
            loading={loading}
            text="吟诗一首"
            onPress={handleRefresh}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;
