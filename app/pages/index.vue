<template>
  <div class="container mx-auto flex flex-col gap-6">
    <div v-for="(item, index) in CategoryOptions" :key="index">
      <div class="flex items-center gap-2">
        <BlurText
          :text="item.title"
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
        v-if="item.children?.length"
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
          v-for="child in item.children || []"
          :key="child.operationId"
        >
          <div
            class="relative h-full cursor-pointer card-base animated-border animate-fade after:border-green-500/50 dark:after:border-green-400/50 shadow-md dark:shadow-[0_4px_6px_-1px_rgb(255,255,255,0.1)]"
            shadow="hover"
            @mouseenter="($event.target as HTMLElement)?.classList?.add('hovered')"
            @click="openDocs(child.operationId)"
          >
            <div class="text-lg font-semibold">{{ child.name }}</div>
            <div class="flex gap-1 absolute top-2 right-2">
              <!-- 请求方式 -->
              <UBadge variant="soft" size="sm" :color="methodColorMap[child.method || 'GET']">{{
                child.method || "GET"
              }}</UBadge>
            </div>
            <!-- 底部标签 -->
            <div class="flex justify-end text-xs text-gray-500 mt-4 gap-3">
              <!-- 推荐 -->
              <div class="flex items-center gap-1" v-if="child.is_featured">
                <UIcon name="ri:thumb-up-line" />
                <span>推荐</span>
              </div>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CategoryOptions } from "~/lib/config";
import { REQUEST_METHOD } from "~/lib/enum";
import type { BadgeProps } from "#ui/types";

defineOgImageComponent("Nuxt", {
  headline: "Greetings",
  title: `${process.env.NUXT_SITE_NAME} 👋`,
  description: "A beautiful and modern API aggregation platform!",
});

definePageMeta({
  title: "一个精美、现代化的 API 聚合平台！",
});

const methodColorMap = ref<Record<REQUEST_METHOD, BadgeProps["color"]>>({
  GET: "success",
  POST: "warning",
  PUT: "info",
  DELETE: "error",
  PATCH: "info",
});

const openDocs = (operationId: string) => {
  window.open(`https://api-docs.baiwumm.com/easy-api/apireference/${operationId}`);
};
</script>
