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
            <div
              class="relative h-full cursor-pointer card-base animated-border animate-fade after:border-green-500/50 dark:after:border-green-400/50 shadow-md dark:shadow-[0_4px_6px_-1px_rgb(255,255,255,0.1)]"
              shadow="hover"
              @mouseenter="($event.target as HTMLElement)?.classList?.add('hovered')"
            >
              <div class="flex flex-col gap-3">
                <div class="flex gap-2 items-center">
                  <div class="flex flex-col gap-0.5">
                    <div class="flex gap-1 items-center">
                      <div class="text-lg font-semibold">{{ child.name }}</div>
                    </div>
                  </div>
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-6">
                  {{ child.desc }}
                </div>
              </div>
              <div class="flex gap-1 absolute top-2 right-2">
                <!-- 置顶标签 -->
                <UBadge variant="soft" v-if="child.pinned" size="sm">置顶</UBadge>
                <!-- 是否推荐 -->
                <UBadge color="secondary" variant="soft" v-if="child.is_featured" size="sm">推荐</UBadge>
              </div>
            </div>
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
import type { PageResponse, CategoryList, Response, ApiList } from "~/lib/type";
const client = useSupabaseClient<ApiList>();
const toast = useToast();

defineOgImageComponent("Nuxt", {
  headline: "Greetings",
  title: `${process.env.NUXT_SITE_NAME} 👋`,
  description: "A beautiful personal site navigation!",
});

// 请求分类列表
const { data: categoryList, status: categoryStatus } = await useFetch<Response<PageResponse<CategoryList>>>(
  "/api/categorys",
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

definePageMeta({
  title: "一个精美、现代化的 API 聚合平台！",
});
</script>
