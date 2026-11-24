/*
 * @Description: 工具页 SSR 内容块：介绍 / 使用步骤 / 接口示例 / 常见问题。
 * 服务端渲染保证爬虫与 AI 引擎可直接读取（此前工具页正文只有客户端加载的交互区）；
 * 内容同时驱动 lib/seo.ts 的 HowTo / FAQPage 结构化数据，两处必须保持一致
 */
import type { FC } from "react";
import type { ToolContentData } from "@/lib/seo";

import { Typography } from "@heroui/react";

interface ToolContentProps {
  content: ToolContentData;
}

const ToolContent: FC<ToolContentProps> = ({ content }) => (
  <section className="border-border mx-auto w-full container! border-t px-6 py-8">
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Typography className="text-lg font-black" type="h2">
          工具介绍
        </Typography>
        <Typography type="body">{content.intro}</Typography>
      </div>
      <div className="flex flex-col gap-2">
        <Typography className="text-lg font-black" type="h2">
          使用步骤
        </Typography>
        <ol className="list-decimal flex flex-col gap-1 pl-5">
          {content.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
      {content.example ? (
        <div className="flex flex-col gap-2">
          <Typography className="text-lg font-black" type="h2">
            接口调用示例
          </Typography>
          <div className="bg-default text-foreground overflow-x-auto rounded-xl p-4">
            <code className="text-sm whitespace-pre">
              {content.example.code}
            </code>
          </div>
          {content.example.label ? (
            <Typography type="body-sm">{content.example.label}</Typography>
          ) : null}
        </div>
      ) : null}
      <div className="flex flex-col gap-4">
        <Typography className="text-lg font-black" type="h2">
          常见问题
        </Typography>
        {content.faqs.map(({ answer, question }) => (
          <div key={question} className="flex flex-col gap-1">
            <Typography className="font-bold" type="h3">
              {question}
            </Typography>
            <Typography type="body">{answer}</Typography>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ToolContent;
