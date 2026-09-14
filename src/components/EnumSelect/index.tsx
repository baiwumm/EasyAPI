"use client";
import type { FC } from "react";

import { ListBox, Select } from "@heroui/react";

interface EnumSelectProps {
  /** enum-plus 枚举实例（内部使用 .items 渲染选项） */
  items: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  "aria-label": string;
  className?: string;
  placeholder?: string;
  variant?: "secondary" | "primary";
  /** 选项较多的列表附加滚动样式 */
  listBoxClassName?: string;
}

/**
 * 枚举下拉选择：收敛散落各页的 Select/Trigger/Popover/ListBox 样板
 * （此前约 15 处每处 20 行的重复结构）
 */
const EnumSelect: FC<EnumSelectProps> = (props) => {
  const {
    items,
    value,
    onChange,
    className,
    placeholder,
    variant,
    listBoxClassName,
    ...rest
  } = props;

  return (
    <Select
      className={className}
      placeholder={placeholder}
      value={value}
      variant={variant}
      onChange={(next) => onChange(next as string)}
      {...rest}
    >
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox className={listBoxClassName}>
          {items.map(({ value: itemValue, label }) => (
            <ListBox.Item key={itemValue} id={itemValue} textValue={label}>
              {label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};

export default EnumSelect;
