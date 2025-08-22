import { CategoryOptions } from "~/lib/config";

export default defineEventHandler(() => {
  return {
    message: "一个精美、现代化的 API 聚合平台！ 🚀",
    categories: CategoryOptions,
  };
});
