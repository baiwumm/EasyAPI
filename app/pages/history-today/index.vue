<template>
  <div class="flex justify-between flex-col min-h-[inherit] container mx-auto gap-6">
    <h1 class="text-2xl font-black">历史上的今天</h1>
    <div v-if="items?.length && status === 'success'" class="flex justify-center overflow-x-scroll w-full">
      <UTimeline orientation="horizontal" :default-value="items?.length - 1" :items="items">
        <template #title="{ item }">
          <h1 class="text-lg cursor-pointer" @click="goToPage(isMobile ? item.mobileUrl : item.url)">
            {{ item.title }}
          </h1>
        </template>
      </UTimeline>
    </div>
    <div v-else-if="status === 'pending'" class="flex justify-center">
      <TextType
        :text="getRandomFunnyText()"
        :typingSpeed="75"
        :pauseDuration="1500"
        :showCursor="true"
        cursorCharacter="|"
        class="text-2xl text-cetner py-6"
      />
    </div>
    <div v-else class="flex justify-center">
      <TextType
        text="服务器开小差了..."
        :typingSpeed="75"
        :pauseDuration="1500"
        :showCursor="true"
        cursorCharacter="|"
        class="text-2xl text-cetner py-6"
      />
    </div>
    <div class="flex justify-center gap-2">
      <UInput v-model="time" placeholder="请输入 MM-DD 的形式" maxLength="5" class="w-40" @keyup.enter="handleSearch" />
      <UButton
        icon="ph:arrows-counter-clockwise-bold"
        size="sm"
        color="primary"
        variant="soft"
        class="cursor-pointer"
        :loading="status === 'pending'"
        @click="handleSearch"
      >
        探索今日历史
      </UButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { TimelineItem } from "@nuxt/ui";

const dayjs = useDayjs();
const toast = useToast();
// 小于 768px 认为是移动端
const isMobile = useMediaQuery("(max-width: 768px)");

type Data = {
  id: number;
  title: string;
  year: string;
  type: string;
  url: string;
  mobileUrl: string;
};

// 图标映射
const iconMap = reactive<Record<string, string>>({
  birth: "ri-cake-line",
  event: "ri-calendar-event-line",
  death: "ri-flower-line",
});

// 有趣的文案数组
const funnyTexts = [
  "时间旅行者正在整理历史档案...",
  "正在翻阅古老的历史典籍...",
  "历史学家们正在激烈讨论中...",
  "穿越时空获取历史数据...",
  "正在唤醒沉睡的历史记忆...",
  "历史的长河正在流淌...",
  "时光机启动中，请稍候...",
  "正在与古人进行跨时空对话...",
  "历史碎片正在拼凑中...",
  "考古学家挖掘数据中...",
];

// 随机选择一条文案
const getRandomFunnyText = (): string => {
  const randomIndex = Math.floor(Math.random() * funnyTexts.length);
  return funnyTexts[randomIndex] || "";
};

// 获取当前时间
const time = ref(dayjs().format("MM-DD"));

// 请求数据
const { data, status, refresh } = await useFetch<Data[]>("/api/history-today", {
  query: { time },
  watch: false,
  transform: (res) => (res as any).data,
});

// 数据子项
const items = computed<TimelineItem[]>(() =>
  data.value?.length
    ? data.value.map((v: Data) => ({
        ...v,
        date: `${v.year}年`,
        title: v.title,
        icon: iconMap[v.type] || "i-lucide-palette",
      }))
    : []
);

// 查询回调
const handleSearch = async () => {
  // 验证日期格式
  const timeRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  if (time.value && !timeRegex.test(time.value)) {
    toast.add({
      title: "参数格式不对，请使用 MM-DD 的形式，例如：01-01",
      color: "error",
      icon: "ri:close-circle-line",
    });
    return;
  }
  await refresh();
};

// 跳转页面
const goToPage = (url: string) => {
  window.open(url);
};

useHead({
  title: "历史上的今天",
});
</script>
