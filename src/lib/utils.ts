import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

/**
 * 格式化数字为带单位的字符串
 * @param num 要格式化的数字
 * @param lang 语言（'zh' | 'en'），默认为中文
 * @returns 格式化后的字符串
 */
export function formatNumberWithUnit(num: number, lang: 'zh' | 'en' = 'zh'): string {
  const units = {
    zh: ['', '万', '亿', '万亿'],
    en: ['', 'K', 'M', 'B', 'T']
  };

  const unitThresholds = {
    zh: [10000, 100000000, 1000000000000],
    en: [1000, 1000000, 1000000000, 1000000000000]
  };

  const currentUnits = units[lang];
  const thresholds = unitThresholds[lang];

  // 处理负数
  const isNegative = num < 0;
  num = Math.abs(num);

  // 处理小于最小单位的情况
  if (num < thresholds[0]) {
    return `${isNegative ? '-' : ''}${num}`;
  }

  // 找出合适的单位
  let unitIndex = 0;
  while (unitIndex < thresholds.length && num >= thresholds[unitIndex]) {
    unitIndex++;
  }
  unitIndex = Math.min(unitIndex, currentUnits.length - 1);

  // 计算带单位的值
  const dividedNum = num / (unitIndex > 0 ? thresholds[unitIndex - 1] : 1);
  const formattedNum = dividedNum.toFixed(1);

  // 移除 .0 的情况（如 1.0 -> 1）
  const finalNum = formattedNum.endsWith('.0')
    ? formattedNum.slice(0, -2)
    : formattedNum;

  return `${isNegative ? '-' : ''}${finalNum}${currentUnits[unitIndex]}`;
}