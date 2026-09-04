"use client";
import type { Key } from "@heroui/react";
import type { FC } from "react";
import type { ClientComponentProps } from "@/typings";

import { QuoteOpen } from "@gravity-ui/icons";
import { Tag, TagGroup, Typography } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import CopyText from "@/components/CopyText";
import RefreshButton from "@/components/RefreshButton";
import RequestContent from "@/components/RequestContent";
import TypingAnimation from "@/components/TypingAnimation";
import { useSwrQuery } from "@/hooks/use-swr";
import { get } from "@/lib/utils";
import { getApiData } from "@/services/common";

const typesOptions = [
  { value: "a", label: "动画" },
  { value: "b", label: "漫画" },
  { value: "c", label: "游戏" },
  { value: "d", label: "文学" },
  { value: "e", label: "原创" },
  { value: "f", label: "网络" },
  { value: "g", label: "其他" },
  { value: "h", label: "影视" },
  { value: "i", label: "诗词" },
  { value: "j", label: "网易云" },
  { value: "k", label: "哲学" },
  { value: "l", label: "抖机灵" },
];

const ClientComponent: FC<ClientComponentProps> = ({ title }) => {
  const pathname = usePathname();
  const [selected, setSelected] = useState<Iterable<Key>>(() => new Set([]));
  const [showFormContent, setShowFormContent] = useState(false);

  // 参数处理
  const params = useMemo(
    () => ({ type: Array.from(selected).join(",") }),
    [selected],
  );

  // 请求数据
  // 请求数据（key 固定为路由，参数走闭包；点击刷新用 mutate）
  const {
    data = {},
    loading,
    error,
    mutate,
  } = useSwrQuery(pathname, async () =>
    get(await getApiData(pathname, params), "data", {}),
  );

  // 刷新入口：原 onBefore 的 UI 重置逻辑在请求前执行
  const handleRefresh = () => {
    setShowFormContent(false);
    mutate();
  };

  // 右下角来源信息
  const formContent = useMemo(() => {
    const content = get(data, "content", "");
    const from_who = get(data, "from_who");
    const from = get(data, "from", "");

    return content ? `—— ${from_who || ""}${from ? `「${from}」` : ""}` : "";
  }, [data]);

  // 稳定引用：避免每次渲染新建函数导致 TypingAnimation 的 effect 重跑
  const onSentenceComplete = useCallback(() => {
    setShowFormContent(true);
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
          <Typography
            className="text-2xl font-black justify-self-start tracking-normal"
            type="h1"
          >
            {title}
          </Typography>
          <div className="justify-self-start lg:justify-self-center">
            <TagGroup
              aria-label="筛选类型"
              selectionMode="multiple"
              size="sm"
              onSelectionChange={(keys) => setSelected(keys)}
            >
              <TagGroup.List className="lg:flex-nowrap min-w-0 sm:min-w-max">
                {typesOptions.map((item) => (
                  <Tag key={item.value} id={item.value}>
                    {item.label}
                  </Tag>
                ))}
              </TagGroup.List>
            </TagGroup>
          </div>
        </div>
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        <RequestContent
          error={error}
          loading={loading}
          loadingText="灵感正在路上..."
          reFresh={handleRefresh}
        >
          <div className="relative max-w-[85%] min-w-[20%]">
            <QuoteOpen className="size-14! absolute -top-10 -left-10 text-muted" />
            <TypingAnimation
              className="text-xl sm:text-2xl py-6"
              loop={false}
              pauseDuration={1500}
              text={get(data, "content", "服务器开小差了...")}
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
        </RequestContent>
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2">
          <RefreshButton
            loading={loading}
            text="换一句"
            onPress={handleRefresh}
          />
          <CopyText content={get(data, "content", "")} />
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;
