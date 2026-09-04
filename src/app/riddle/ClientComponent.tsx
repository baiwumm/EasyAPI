"use client";
import type { FC } from "react";
import type { ClientComponentProps } from "@/typings";

import { QuoteOpen } from "@gravity-ui/icons";
import { Typography } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import CopyText from "@/components/CopyText";
import RefreshButton from "@/components/RefreshButton";
import RequestContent from "@/components/RequestContent";
import TypingAnimation from "@/components/TypingAnimation";
import { useSwrQuery } from "@/hooks/use-swr";
import { get } from "@/lib/utils";
import { getApiData } from "@/services/common";

const ClientComponent: FC<ClientComponentProps> = ({ title }) => {
  const pathname = usePathname();

  // 请求数据
  const {
    data = {},
    loading,
    error,
    mutate,
  } = useSwrQuery(pathname, async () =>
    get(await getApiData(pathname), "data", {}),
  );

  const formContent = useMemo(() => {
    return `${get(data, "riddle", "")} ——「${get(data, "answer", "")}」`;
  }, [data]);

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
          reFresh={mutate}
        >
          <div className="relative max-w-[85%] min-w-[20%]">
            <QuoteOpen className="size-14! absolute -top-10 -left-10 text-muted" />
            <TypingAnimation
              className="text-xl sm:text-2xl py-6"
              loop={false}
              pauseDuration={1500}
              text={formContent}
              typingSpeed={75}
            />
          </div>
        </RequestContent>
      </div>
      {/* 底部区域 */}
      <div className="flex justify-center shrink-0">
        <div className="flex items-center gap-2">
          <RefreshButton
            loading={loading}
            text="换一句"
            onPress={() => mutate()}
          />
          <CopyText content={formContent} />
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;
