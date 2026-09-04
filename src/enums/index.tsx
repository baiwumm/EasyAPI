import { Enum } from "enum-plus";

/**
 * @description: 请求状态
 */
export const RESPONSE = Enum({
  SUCCESS: { value: 200, label: "请求成功" },
  ERROR: { value: 500, label: "请求失败" },
});

/**
 * @description: 主题模式
 */
export const THEME_MODE = Enum({
  LIGHT: { value: "light", label: "亮色模式" },
  DARK: { value: "dark", label: "暗黑模式" },
  SYSTEM: { value: "system", label: "跟随系统" },
});

/**
 * @description: OAuth Providers
 */
export const OAUTH_PROVIDERS = Enum({
  GOOGLE: { value: "google", label: "使用 Google 登录" },
  GITHUB: { value: "github", label: "使用 Github 登录" },
});

/**
 * @description: Admin Tabs
 */
export const ADMIN_TABS = Enum({
  CATEGOTYS: { value: "categorys", label: "接口分类" },
  APIS: { value: "apis", label: "接口列表" },
});

/**
 * @description: 请求方式
 */
export const REQUEST_METHODS = Enum({
  GET: { value: "GET", label: "GET" },
  POST: { value: "POST", label: "POST" },
  PUT: { value: "PUT", label: "PUT" },
  DELETE: { value: "DELETE", label: "DELETE" },
  PATCH: { value: "PATCH", label: "PATCH" },
});

/**
 * @description: 随机头像 - 风格
 */
export const AVATAR_STYLES = Enum({
  RANDOM: { value: "random", label: "随机风格" },
  ADVENTURER: { value: "adventurer", label: "冒险者" },
  AVATAAARS: { value: "avataaars", label: "卡通人物" },
  BOTTTS: { value: "bottts", label: "机器人" },
  PIXELART: { value: "pixelArt", label: "像素风" },
  FUNEMOJI: { value: "funEmoji", label: "趣味表情" },
  LORELEI: { value: "lorelei", label: "人物插画" },
  MICAH: { value: "micah", label: "简约人物" },
  NOTIONISTS: { value: "notionists", label: "Notion 风格" },
  OPENPEEPS: { value: "openPeeps", label: "开源人物" },
  PERSONAS: { value: "personas", label: "人物头像" },
  THUMBS: { value: "thumbs", label: "手势头像" },
});

/**
 * @description: 条形码 - 类型
 */
export const BARCODE_FORMATS = Enum({
  CODE128: {
    value: "CODE128",
    label: "CODE 128",
    description:
      "高密度条形码，支持完整 ASCII 字符集，是最常用的通用条码格式。",
    example: "HELLO123456",
    charset: "ASCII",
    hint: "",
  },

  CODE39: {
    value: "CODE39",
    label: "CODE 39",
    description: "支持数字、大写字母和少量符号，常用于工业、物流和军工领域。",
    example: "CODE39TEST",
    charset: "0-9 A-Z - . $ / + %",
    hint: "",
  },

  CODE93: {
    value: "CODE93",
    label: "CODE 93",
    description: "CODE39 的升级版本，密度更高，支持完整 ASCII 字符。",
    example: "CODE93TEST",
    charset: "ASCII",
    hint: "",
  },

  EAN13: {
    value: "EAN13",
    label: "EAN-13",
    description: "13位国际商品条码，全球零售商品最常见的条码标准。",
    example: "978020137962",
    charset: "",
    hint: "输入 12 位数字即可，系统会自动补充第 13 位校验码。",
  },

  EAN8: {
    value: "EAN8",
    label: "EAN-8",
    description: "8位商品条码，适用于体积较小的商品包装。",
    example: "9638507",
    charset: "",
    hint: "输入 7 位数字即可，系统会自动补充第 8 位校验码。",
  },

  UPC: {
    value: "UPC",
    label: "UPC",
    description: "北美地区常用的商品条码标准（UPC-A）。",
    example: "12345678999",
    charset: "",
    hint: "输入 11 位数字即可，系统会自动补充第 12 位校验码。",
  },

  ITF14: {
    value: "ITF14",
    label: "ITF-14",
    description: "用于物流包装箱的条码标准，通常用于外箱识别。",
    example: "1001234567890",
    charset: "",
    hint: "输入 13 位数字即可，系统会自动补充第 14 位校验码。",
  },

  MSI: {
    value: "MSI",
    label: "MSI",
    description: "库存管理系统常用条码格式，仅支持数字。",
    example: "123456789",
    charset: "0-9",
    hint: "",
  },

  pharmacode: {
    value: "pharmacode",
    label: "Pharmacode",
    description: "制药行业使用的条码，用于药品包装识别。",
    example: "12345",
    charset: "0-9",
    hint: "",
  },

  codabar: {
    value: "codabar",
    label: "Codabar",
    description: "常用于图书馆、血库和物流系统的条码格式。",
    example: "A123456A",
    charset: "0-9 - $ : / . +",
    hint: "必须以 A、B、C 或 D 开头和结尾。",
  },
});

/**
 * @description: 条形码 - 生成格式
 */
export const BARCODE_TYPES = Enum({
  SVG: { value: "svg", label: "SVG" },
  PNG: { value: "png", label: "PNG" },
});

/**
 * @description: 随机人物肖像 - 性别
 */
export const PERSON_SEXS = Enum({
  GENERIC: { value: "generic", label: "通用" },
  MALE: { value: "male", label: "男性" },
  FEMALE: { value: "female", label: "女性" },
});

/**
 * @description: 随机人物肖像 - 大小
 */
export const PERSON_SIZES = Enum({
  SIZE_32: { value: 32, label: "32" },
  SIZE_64: { value: 64, label: "64" },
  SIZE_128: { value: 128, label: "128" },
  SIZE_256: { value: 256, label: "256" },
  SIZE_512: { value: 512, label: "512" },
});

/**
 * @description: 邮政编码查询 - 方式
 */
export const POSTALCODE_TYPES = Enum({
  CODE_TO_AREA: { value: 1, label: "邮编查地区" },
  AREA_TO_CODE: { value: 2, label: "地区查邮编" },
});

/**
 * @description: 生成二维码 - 格式
 */
export const QRCODE_FORMATS = Enum({
  PNG: { value: "png", label: "PNG" },
  SVG: { value: "svg", label: "SVG" },
  DATAURL: { value: "dataurl", label: "DATAURL" },
});

/**
 * @description: 随机颜色 - 格式
 */
export const RANDOM_COLOR_FORMATS = Enum({
  ALL: { value: "all", label: "全部" },
  HEX: { value: "hex", label: "Hex" },
  RGB: { value: "rgb", label: "Rgb" },
  HSL: { value: "hsl", label: "Hsl" },
  HSV: { value: "hsv", label: "Hsv" },
});

/**
 * @description: 随机字符串 - 类型
 */
export const RANDOM_STRING_TYPES = Enum({
  ALPHANUMERIC: {
    value: "alphanumeric",
    label: "字母 + 数字",
    description: "最常用的随机字符串类型",
  },
  URL_SAFE: {
    value: "url-safe",
    label: "URL 安全 Base64",
    description: "适用于 URL，不包含 + /",
  },
  NUMERIC: {
    value: "numeric",
    label: "纯数字（0-9）",
    description: "常用于验证码、短信码",
  },
  DISTINGUISHABLE: {
    value: "distinguishable",
    label: "易区分字符",
    description: "去除 0/O、1/l 等易混淆字符",
  },
  HEX: {
    value: "hex",
    label: "十六进制（0-9 a-f）",
    description: "常用于哈希、Token、ID",
  },
  BASE64: {
    value: "base64",
    label: "Base64 编码",
    description: "包含大小写字母、数字、+ /",
  },
  ASCII_PRINTABLE: {
    value: "ascii-printable",
    label: "可打印 ASCII 字符",
    description: "包含字母、数字、符号、标点",
  },
});

/**
 * @description: 随机用户 - 性别
 */
export const RANDOM_USER_GENDER = Enum({
  GENERIC: { value: "generic", label: "随机" },
  MALE: { value: "male", label: "男" },
  FEMALE: { value: "female", label: "女" },
});
