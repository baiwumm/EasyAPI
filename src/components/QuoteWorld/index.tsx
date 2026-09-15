/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-02-28 09:53:08
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-11 09:32:10
 * @Description: 一言文案页模板（T1 引言页模板）
 * - mode="quote"（默认）：通用文案页，9 个纯 page.tsx 页面复用；
 *   通过 formWhoField/fromField 指定署名字段
 * - mode="hitokoto"：每日一言（类型筛选 TagGroup，内部状态驱动参数）
 * - mode="poetry"：今日诗词（作者筛选 + 空数据兜底 + 段落拼接）
 * - mode="riddle"：谜语（谜面与答案合成文案，无署名）
 */
"use client";
import type { Key } from "@heroui/react";
import type { FC } from "react";

import { QuoteOpen } from "@gravity-ui/icons";
import { Input, Tag, TagGroup, Typography } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import AlertContent from "@/components/AlertContent";
import CopyText from "@/components/CopyText";
import RefreshButton from "@/components/RefreshButton";
import RequestContent from "@/components/RequestContent";
import TypingAnimation from "@/components/TypingAnimation";
import { useSwrQuery } from "@/hooks/use-swr";
import { get } from "@/lib/utils";
import { getApiData } from "@/services/common";

/** 一言官方句子类型（与 /api/hitokoto 白名单一致） */
const HITOKOTO_TYPES = [
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

type QuoteMode = "quote" | "hitokoto" | "poetry" | "riddle";

interface QuoteWorldProps {
  title: string;
  mode?: QuoteMode;
  /** 署名字段（仅 quote 模式）：fromWho 与 from 两个来源字段名 */
  formWhoField?: string;
  fromField?: string;
}

const QuoteWorld: FC<QuoteWorldProps> = ({
  title,
  mode = "quote",
  formWhoField = "",
  fromField = "",
}) => {
  const pathname = usePathname();
  const [showFormContent, setShowFormContent] = useState(false);
  // hitokoto 类型筛选（空 = 全部）
  const [selected, setSelected] = useState<Iterable<Key>>(() => new Set([]));
  // poetry 作者筛选
  const [author, setAuthor] = useState("李白");

  // 参数处理（mode 决定筛选参数）
  const params = useMemo(() => {
    if (mode === "hitokoto") {
      return { type: Array.from(selected).join(",") };
    }
    if (mode === "poetry") {
      return { author };
    }

    return {};
  }, [mode, selected, author]);

  // 请求数据（key 固定为路由，参数走闭包；点击刷新用 mutate）
  const {
    data = {},
    isLoading,
    loading,
    error,
    mutate,
  } = useSwrQuery(pathname, async () => {
    const res = get(await getApiData(pathname, params), "data", {});

    // poetry 的响应是数组，取第一首
    return mode === "poetry" ? get(res, "[0]", {}) : res;
  });

  // 刷新入口：原 onBefore 的 UI 重置逻辑在请求前执行
  const handleRefresh = () => {
    setShowFormContent(false);
    mutate();
  };

  // 主文案
  const content = useMemo(() => {
    if (mode === "poetry") {
      return get(data, "paragraphs", []).join("\n");
    }
    if (mode === "riddle") {
      return `${get(data, "riddle", "")} ——「${get(data, "answer", "")}」`;
    }

    return get(data, "content", "");
  }, [mode, data]);

  // 右下角来源信息
  const formContent = useMemo(() => {
    if (mode === "poetry") {
      const paragraphs = get(data, "paragraphs", []);
      const poetryAuthor = get(data, "author");
      const poetryTitle = get(data, "title", "");

      return paragraphs?.length
        ? `—— ${poetryAuthor || ""}${poetryTitle ? `《${poetryTitle}》` : ""}`
        : "";
    }
    if (!formWhoField || !fromField) {
      return null;
    }
    const from_who = get(data, formWhoField);
    const from = get(data, fromField, "");

    return content ? `—— ${from_who || ""}${from ? `「${from}」` : ""}` : "";
  }, [mode, data, content, formWhoField, fromField]);

  // 稳定引用：避免每次渲染新建函数导致 TypingAnimation 的 effect 重跑
  const onSentenceComplete = useCallback(() => {
    setShowFormContent(true);
  }, []);

  // poetry 空数据兜底
  const isEmptyPoetry =
    mode === "poetry" && !get(data, "paragraphs", [])?.length;

  return (
    <div className="flex-1 flex flex-col justify-between gap-4">
      {/* 头部区域 */}
      <div className="shrink-0">
        {mode === "hitokoto" ? (
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
                  {HITOKOTO_TYPES.map((item) => (
                    <Tag key={item.value} id={item.value}>
                      {item.label}
                    </Tag>
                  ))}
                </TagGroup.List>
              </TagGroup>
            </div>
          </div>
        ) : (
          <Typography className="text-2xl font-black tracking-normal" type="h1">
            {title}
          </Typography>
        )}
      </div>
      {/* 中间区域 */}
      <div className="flex-1 flex justify-center items-center">
        <RequestContent
          error={error}
          // 必须用替换式 loading（含刷新中）：TypingAnimation 是有状态动画
          // （loop=false 打完一句状态机即停止），只能靠刷新期间卸载子树、
          // 新数据到达后重挂载来重新打字。改用 isLoading 保留旧子树会导致
          // "换一句"请求了新数据但内容不更新
          loading={loading}
          loadingText="灵感正在路上..."
          reFresh={handleRefresh}
        >
          {isEmptyPoetry ? (
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
                text={content}
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
          {mode === "poetry" ? (
            <Input
              aria-label="作者"
              className="w-64"
              placeholder="请输入诗词作者"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleRefresh();
                }
              }}
            />
          ) : null}
          <RefreshButton
            loading={loading}
            text={mode === "poetry" ? "吟诗一首" : "换一句"}
            onPress={handleRefresh}
          />
          <CopyText content={content} />
        </div>
      </div>
    </div>
  );
};

export default QuoteWorld;
