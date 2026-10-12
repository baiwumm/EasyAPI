/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-01-30 09:49:14
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-01-30 09:56:56
 * @Description: 提示框占位
 */

import type { AlertProps, ButtonVariants } from "@heroui/react";
import type { FC, ReactNode } from "react";

import { Alert, Button } from "@heroui/react";

interface AlertContentProps {
  status: AlertProps["status"];
  title: ReactNode;
  description: ReactNode;
  actionText: ReactNode;
  buttonVariant?: ButtonVariants["variant"];
  buttonAction?: () => void;
  className?: string;
}

const AlertContent: FC<AlertContentProps> = ({
  status,
  title,
  description,
  actionText,
  buttonVariant = "primary",
  buttonAction,
  className = "max-w-lg shadow-lg",
}) => {
  return (
    <Alert className={className} status={status}>
      <Alert.Indicator />
      {/* D15：只保留一个操作按钮。内容区移动端保持纵向（按钮在描述下方）、
          桌面端转横向（文字块 grow 顶开、按钮靠右），DOM 中不再有
          视觉隐藏的重复交互元素 */}
      <Alert.Content className="sm:flex-row">
        <div className="flex min-w-0 grow flex-col items-start">
          <Alert.Title>{title}</Alert.Title>
          <Alert.Description className="text-xs">
            {description}
          </Alert.Description>
        </div>
        <Button
          className="mt-2 shrink-0 sm:mt-0 sm:ml-4"
          size="sm"
          variant={buttonVariant}
          onPress={buttonAction}
        >
          {actionText}
        </Button>
      </Alert.Content>
    </Alert>
  );
};

export default AlertContent;
