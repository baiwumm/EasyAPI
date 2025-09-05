/**
 * Pick a list of properties from an object
 * into a new object
 */
export const pick = <T extends object, TKeys extends keyof T>(
  obj: T,
  keys: TKeys[]
): Pick<T, TKeys> => {
  if (!obj) return {} as Pick<T, TKeys>
  return keys.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) acc[key] = obj[key]
    return acc
  }, {} as Pick<T, TKeys>)
}

/**
 * Omit a list of properties from an object
 * returning a new object with the properties
 * that remain
 */
export const omit = <T, TKeys extends keyof T>(
  obj: T,
  keys: TKeys[]
): Omit<T, TKeys> => {
  if (!obj) return {} as Omit<T, TKeys>
  if (!keys || keys.length === 0) return obj as Omit<T, TKeys>
  return keys.reduce(
    (acc, key) => {
      // Gross, I know, it's mutating the object, but we
      // are allowing it in this very limited scope due
      // to the performance implications of an omit func.
      // Not a pattern or practice to use elsewhere.
      delete acc[key]
      return acc
    },
    { ...obj }
  )
}

/**
 * Dynamically get a nested value from an array or
 * object with a string.
 *
 * @example get(person, 'friends[0].name')
 */
export const get = <TDefault = unknown>(
  value: any,
  path: string,
  defaultValue?: TDefault
): TDefault => {
  const segments = path.split(/[\.\[\]]/g)
  let current: any = value
  for (const key of segments) {
    if (current === null) return defaultValue as TDefault
    if (current === undefined) return defaultValue as TDefault
    const dequoted = key.replace(/['"]/g, '')
    if (dequoted.trim() === '') continue
    current = current[dequoted]
  }
  if (current === undefined) return defaultValue as TDefault
  return current
}

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

/**
 * @description: 转化数字
 */
export const formatNumber = (num: number | string): number | string => {
  num = Number(num);
  if (isNaN(num)) {
    return num;
  }
  // 如果小于 10000，直接显示
  if (num < 10000) {
    return num;
  }
  const unit = '万';
  num /= 10000;
  num = num.toFixed(2);
  return num + unit;
};