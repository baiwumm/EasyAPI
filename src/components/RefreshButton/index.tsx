/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2026-03-09 17:38:28
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2026-03-09 17:40:58
 * @Description: 查询按钮
 */
import type { ButtonProps } from "@heroui/react";
import type { FC } from "react";

import { ArrowsRotateLeft } from "@gravity-ui/icons";
import { Button, Spinner } from "@heroui/react";

interface RefreshButtonProps {
  text?: string;
  loading?: boolean;
  onPress?: ButtonProps["onPress"];
}

const RefreshButton: FC<RefreshButtonProps> = ({
  text = "查询",
  loading = false,
  onPress,
}) => {
  return (
    <Button
      className="bg-accent-soft text-accent hover:bg-accent-soft-hover"
      isPending={loading}
      size="sm"
      onPress={onPress}
    >
      {({ isPending }) => (
        <>
          {isPending ? (
            <Spinner color="current" size="sm" />
          ) : (
            <ArrowsRotateLeft />
          )}
          {text}
        </>
      )}
    </Button>
  );
};

export default RefreshButton;
