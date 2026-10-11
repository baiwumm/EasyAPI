"use client";
import type { FC } from "react";

import { Copy } from "@gravity-ui/icons";
import { Chip } from "@heroui/react";
import { useCallback } from "react";

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
 *
 * 点击挂在原生 button 的 onClick 上而不是 Chip 的 onPress：HeroUI v3 的 Chip
 * 是基于基础 span、没有 RAC Button 的 onPress 抽象，见不到 onPress 这个 prop。
 * render 函数用 useCallback 稳定引用：该组件常在列表里成片渲染
 * （random-string / random-idcard / color-conversion），每次渲染新建函数
 * 会让所有 Chip 白白重渲染。
 */
const CopyChip: FC<CopyChipProps> = ({ value, label, color, variant }) => {
  const { copy } = useCopy();

  const renderButton = useCallback(
    (props: React.ComponentProps<"button">) => (
      <button
        {...props}
        className={`${props.className ?? ""} cursor-pointer`}
        type="button"
        onClick={() => copy(value)}
      />
    ),
    [copy, value],
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
