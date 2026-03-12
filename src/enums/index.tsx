import { Enum } from 'enum-plus';

/**
 * @description: 请求状态
 */
export const RESPONSE = Enum({
  SUCCESS: { value: 200, label: '请求成功' },
  ERROR: { value: 500, label: '请求失败' }
})

/**
 * @description: 主题模式
 */
export const THEME_MODE = Enum({
  LIGHT: { value: 'light', label: '亮色模式' },
  DARK: { value: 'dark', label: '暗黑模式' },
  SYSTEM: { value: 'system', label: '跟随系统' }
});

/**
 * @description: OAuth Providers
 */
export const OAUTH_PROVIDERS = Enum({
  GOOGLE: { value: 'google', label: '使用 Google 登录' },
  GITHUB: { value: 'github', label: '使用 Github 登录' },
})

/**
 * @description: Admin Tabs
 */
export const ADMIN_TABS = Enum({
  CATEGOTYS: { value: 'categorys', label: '接口分类' },
  APIS: { value: 'apis', label: '接口列表' },
})

/**
 * @description: 请求方式
 */
export const REQUEST_METHODS = Enum({
  GET: { value: 'GET', label: 'GET' },
  POST: { value: 'POST', label: 'POST' },
  PUT: { value: 'PUT', label: 'PUT' },
  DELETE: { value: 'DELETE', label: 'DELETE' },
  PATCH: { value: 'PATCH', label: 'PATCH' }
})

/**
 * @description: 随机头像
 */
export const AVATAR_STYLES = Enum({
  RANDOM: { value: 'random', label: '随机风格' },
  ADVENTURER: { value: 'adventurer', label: '冒险者' },
  AVATAAARS: { label: "卡通人物", value: "avataaars" },
  BOTTTS: { label: "机器人", value: "bottts" },
  PIXELART: { label: "像素风", value: "pixelArt" },
  FUNEMOJI: { label: "趣味表情", value: "funEmoji" },
  LORELEI: { label: "人物插画", value: "lorelei" },
  MICAH: { label: "简约人物", value: "micah" },
  NOTIONISTS: { label: "Notion 风格", value: "notionists" },
  OPENPEEPS: { label: "开源人物", value: "openPeeps" },
  PERSONAS: { label: "人物头像", value: "personas" },
  THUMBS: { label: "手势头像", value: "thumbs" }
})

/**
 * @description: 条形码类型
 */
export const BARCODE_FORMATS = Enum({
  CODE128: {
    value: "CODE128",
    label: "CODE 128",
    description: "高密度条形码，支持完整 ASCII 字符集，最常用的通用条码",
    regex: /^[\x00-\x7F]+$/,
    message: "CODE128 只支持 ASCII 字符（不支持中文）",
    example: "HELLO123456"
  },
  CODE39: {
    value: "CODE39",
    label: "CODE 39",
    description: "支持数字、大写字母和少量符号，常用于工业、物流和军工领域",
    regex: /^[0-9A-Z\-\. $/+%]+$/,
    message: "CODE39 只支持大写字母、数字和 - . $ / + %",
    example: "CODE39TEST"
  },
  CODE93: {
    value: "CODE93",
    label: "CODE 93",
    description: "CODE39 的升级版本，密度更高，可靠性更强",
    regex: /^[\x00-\x7F]+$/,
    message: "CODE93 只支持 ASCII 字符",
    example: "CODE93TEST"
  },
  EAN13: {
    value: "EAN13",
    label: "EAN-13",
    description: "13位国际商品条码，全球零售商品最常见",
    regex: /^\d{13}$/,
    message: "EAN13 必须是 13 位数字",
    example: "978020137962"
  },
  EAN8: {
    value: "EAN8",
    label: "EAN-8",
    description: "8位商品条码，用于体积较小的商品",
    regex: /^\d{8}$/,
    message: "EAN8 必须是 8 位数字",
    example: "96385074"
  },
  UPC: {
    value: "UPC",
    label: "UPC",
    description: "美国和加拿大常用的商品条码（12位）",
    regex: /^\d{12}$/,
    message: "UPC 必须是 12 位数字",
    example: "123456789999"
  },
  ITF14: {
    value: "ITF14",
    label: "ITF-14",
    description: "用于物流和外箱包装的条码，固定14位数字",
    regex: /^\d{14}$/,
    message: "ITF14 必须是 14 位数字",
    example: "10012345678902"
  },
  MSI: {
    value: "MSI",
    label: "MSI",
    description: "库存管理条码，常见于仓储系统",
    regex: /^\d+$/,
    message: "MSI 只支持数字",
    example: "123456789"
  },
  pharmacode: {
    value: "pharmacode",
    label: "Pharmacode",
    description: "制药行业条码，用于药品包装识别",
    regex: /^\d+$/,
    message: "Pharmacode 只支持数字",
    example: "12345"
  },
  codabar: {
    value: "codabar",
    label: "Codabar",
    description: "常用于图书馆、血库和物流系统",
    regex: /^[A-D][0-9\-$:/.+]+[A-D]$/,
    message: "Codabar 必须以 A-D 开头和结尾",
    example: "A123456A"
  }
});

/**
 * @description: 条形码生成格式
 */
export const BARCODE_TYPES = Enum({
  SVG: { value: 'svg', label: 'SVG' },
  PNG: { value: 'png', label: 'PNG' },
})