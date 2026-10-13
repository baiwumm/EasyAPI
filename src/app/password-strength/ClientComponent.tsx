"use client";

import type { GetColumnsFn } from "@/components/JsonContent";
import type { ChipProps } from "@heroui/react";
import type { ZxcvbnResult } from "@zxcvbn-ts/core";
import type { FC } from "react";
import type { ClientComponentProps } from "@/typings";

import { useState } from "react";
import { Chip, Input, toast } from "@heroui/react";

import JsonContent from "@/components/JsonContent";
import { postApiData } from "@/services/common";

// zxcvbn 结果里不再回显 password 字段（见 api/password-strength），
// 密码展示直接用输入框里的本地值
type PasswordStrengthResult = Omit<ZxcvbnResult, "password">;

const ClientComponent: FC<ClientComponentProps> = ({ title }) => {
  const [password, setPassword] = useState("abc123456");

  // 请求数据
  const onRefresh = () => {
    if (!password?.trim()) {
      toast.danger("参数 password 必填");

      return false;
    }
    if (password.length > 128) {
      toast.danger("参数 password 长度不能超过 128 个字符");

      return false;
    }

    return true;
  };

  const getColumns: GetColumnsFn<PasswordStrengthResult> = (data) => {
    const { score, guesses, crackTimesDisplay, feedback } = data || {};

    const scoreMap = ["非常弱", "弱", "一般", "强", "非常强"];

    const scoreColor: ChipProps["color"][] = [
      "danger",
      "danger",
      "warning",
      "warning",
      "success",
    ];

    return [
      { label: "密码", children: <Chip>{password || "--"}</Chip> },

      {
        label: "密码强度",
        children: (
          <Chip color={scoreColor[score]} variant="soft">
            {score !== undefined ? scoreMap[score] : "--"}
          </Chip>
        ),
      },

      {
        label: "预计破解次数",
        children: guesses ? `${guesses.toLocaleString()} 次` : "--",
      },

      {
        label: "在线攻击破解时间",
        children: crackTimesDisplay?.onlineNoThrottling10PerSecond || "--",
      },

      {
        label: "离线攻击破解时间",
        children: crackTimesDisplay?.offlineFastHashing1e10PerSecond || "--",
      },

      {
        label: "安全提示",
        children: feedback?.warning || "未发现明显风险",
      },

      {
        label: "改进建议",
        children: feedback?.suggestions?.join("；") || "密码强度较好",
      },
    ];
  };

  return (
    <JsonContent
      getColumns={getColumns}
      params={{ password }}
      searchText="检测"
      sendData={postApiData}
      title={title}
      onRefresh={onRefresh}
    >
      <Input
        aria-label="密码"
        className="w-50"
        placeholder="请输入密码"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
    </JsonContent>
  );
};

export default ClientComponent;
