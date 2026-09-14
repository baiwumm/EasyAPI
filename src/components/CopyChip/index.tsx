"use client";
import type { FC } from "react";

import { Copy } from "@gravity-ui/icons";
import { Chip } from "@heroui/react";

import { useCopy } from "@/hooks/use-copy";

interface CopyChipProps {
  value: string;
  label?: string;
  color?: React.ComponentProps<typeof Chip>["color"];
  variant?: React.ComponentProps<typeof Chip>["variant"];
}

/**
 * 可点击复制的 Chip
 * 通过 render 以 button 元素渲染（键盘可达，Enter/Space 原生触发），
 * 复制反馈由 useCopy 统一 toast。
 * Chip 的泛型无法从 JSX 推断出 button，此处做一次显式收窄。
 */
const CopyChip: FC<CopyChipProps> = ({ value, label, color, variant }) => {
  const { copy } = useCopy();

  const renderButton = (props: React.ComponentProps<"button">) => (
    <button
      {...props}
      className={`${props.className ?? ""} cursor-pointer`}
      type="button"
      onClick={() => copy(value)}
    />
  );

  return (
    <Chip
      color={color}
      render={renderButton as React.ComponentProps<typeof Chip>["render"]}
      size="lg"
      variant={variant}
    >
      <Copy />
      <Chip.Label>{label ?? value}</Chip.Label>
    </Chip>
  );
};

export default CopyChip;
