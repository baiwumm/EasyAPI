<template>
  <div class="container mx-auto flex flex-col gap-6">
    <template v-if="categoryStatus === 'pending'">
      <USkeleton class="h-20 w-full" v-for="i in 3" :key="i" />
    </template>
    <template v-else>
      <div v-for="item in categoryList?.data?.list || []" :key="item.id">
        <div class="flex items-center gap-2">
          <BlurText
            :text="item.name"
            :delay="200"
            class-name="text-xl font-semibold"
            animate-by="letters"
            direction="top"
            :threshold="0.1"
            root-margin="0px"
            :step-duration="0.35"
          />
        </div>
        <div
          v-if="item.apis?.length"
          class="grid gap-5 w-full justify-center grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] mt-2"
        >
          <AnimatedContent
            :distance="15"
            direction="vertical"
            :reverse="false"
            :duration="1.2"
            ease="power3.out"
            :initial-opacity="0"
            :animate-opacity="true"
            :scale="0.9"
            :threshold="0.1"
            :delay="0"
            v-for="child in item.apis || []"
            :key="child.id"
          >
            <UPageCard
              class="relative"
              :title="child.name"
              :description="child.desc"
              :to="child.path"
              spotlight
              spotlight-color="primary"
              :ui="{
                container: 'p-2 sm:p-4',
                title: 'text-lg',
                description: 'text-xs line-clamp-2 leading-6',
              }"
              @click="handleClick(child.name)"
            >
              <div class="flex gap-1 absolute top-2 right-2">
                <!-- 请求方式 -->
                <UBadge variant="soft" size="sm" :color="methodColorMap[child.method]">{{ child.method }}</UBadge>
              </div>
              <!-- 底部标签 -->
              <div class="flex justify-end text-xs text-gray-500 mt-2 gap-3">
                <!-- 调用次数 -->
                <div class="flex items-center gap-1">
                  <UIcon name="ri:star-line" />
                  <span>{{ formatNumberWithUnit(child.call_count) }}</span>
                </div>
                <!-- 推荐 -->
                <div class="flex items-center gap-1" v-if="child.is_featured">
                  <UIcon name="ri:thumb-up-line" />
                  <span>推荐</span>
                </div>
                <!-- 置顶 -->
                <div class="flex items-center gap-1" v-if="child.pinned">
                  <UIcon name="tabler:pinned" />
                  <span>置顶</span>
                </div>
              </div>
            </UPageCard>
          </AnimatedContent>
        </div>
        <div v-else class="flex justify-center items-center flex-col">
          <UAlert
            color="neutral"
            variant="subtle"
            title="此分类暂无接口!"
            description="请前往后台添加数据."
            icon="i-lucide-terminal"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { track } from "@vercel/analytics";
import type { PageResponse, CategoryList, Response } from "~/lib/type";
import { REQUEST_METHOD } from "~/lib/enum";
import type { BadgeProps } from "#ui/types";

const toast = useToast();

defineOgImageComponent("Nuxt", {
  headline: "Greetings",
  title: `${process.env.NUXT_SITE_NAME} 👋`,
  description: "A beautiful and modern API aggregation platform!",
});

const methodColorMap = ref<Record<REQUEST_METHOD, BadgeProps["color"]>>({
  GET: "success",
  POST: "warning",
  PUT: "info",
  DELETE: "error",
  PATCH: "info",
});

// 请求分类列表
const { data: categoryList, status: categoryStatus } = await useFetch<Response<PageResponse<CategoryList>>>(
  "/api/admin/categorys",
  {
    query: { current: 1, pageSize: 999 },
    onRequestError: ({ error }) => {
      toast.add({
        title: "请求失败.",
        description: error.message,
      });
    },
  }
);

// 点击卡片回调
const handleClick = (name: string) => {
  track(name);
};

useHead({
  title: "一个精美、现代化的 API 聚合平台！",
});
</script>
