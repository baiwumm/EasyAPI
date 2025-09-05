<template>
  <div class="flex justify-between items-center flex-col min-h-[inherit] max-h-[80%] container mx-auto gap-3">
    <h1 class="place-self-start text-2xl font-black">{{ title }}</h1>
    <div v-if="data && status === 'success'" class="flex items-center justify-center w-full">
      <UCard class="overflow-y-scroll max-h-[30rem] max-w-full min-w-[30%]" :ui="{ body: '!py-2' }">
        <ClientOnly>
          <div class="py-2 border-b last:border-b-0 border-gray-200 dark:border-white/25" v-for="(item, index) in data">
            <!-- 索引 -->
            <div class="flex justify-between items-center w-full gap-2">
              <div
                class="text-xs px-2 rounded flex-initial shrink-0 aspect-square flex items-center"
                :style="{
                  backgroundColor: item.label
                    ? hotLableColor[item.label]
                    : hotTagColor[index] || (!isLight ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0,0,0,.04)'),
                  color:
                    isLight && (item.label ? hotLableColor[item.label] : hotTagColor[index]) ? '#ffffff' : 'inherit',
                }"
              >
                {{ item.label || index + 1 }}
              </div>
              <!-- 标题 -->
              <OverflowDetector :record="item" />
              <!-- 热度 -->
              <div className="flex-initial shrink-0 text-xs text-black/45 dark:text-white" v-if="item.hot">
                {{ formatNumber(item.hot) }}
              </div>
              <div className="flex-initial shrink-0 text-xs text-black/45 dark:text-white" v-if="item.tip">
                {{ `${prefix || ""}${item.tip}${suffix || ""}` }}
              </div>
            </div>
          </div>
        </ClientOnly>
      </UCard>
    </div>
    <div
      v-else-if="status === 'pending'"
      class="w-10 h-10 border-4 border-t-green-500 border-gray-300 rounded-full animate-spin"
    ></div>
    <div v-else class="flex justify-center max-h-[inherit]">
      <TextType
        text="服务器开小差了..."
        :typingSpeed="75"
        :pauseDuration="1500"
        :showCursor="true"
        cursorCharacter="|"
        class="text-xl sm:text-2xl text-cetner py-6"
      />
    </div>
    <div class="flex justify-center gap-2">
      <UButton
        icon="ph:arrows-counter-clockwise-bold"
        size="sm"
        color="primary"
        variant="soft"
        class="cursor-pointer"
        :loading="status === 'pending'"
        @click="handleSearch"
      >
        获取最新
      </UButton>
      <UButton
        icon="ri-fire-line"
        size="sm"
        color="neutral"
        variant="soft"
        to="https://hot.baiwumm.com"
        target="_blank"
        class="cursor-pointer"
      >
        今日热榜
      </UButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import { hotLableColor, hotTagColor } from "~/lib/constant";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    required: false,
  },
  suffix: {
    type: String,
    required: false,
  },
});

const colorMode = useColorMode();

const isLight = colorMode.value === "light";

// 请求数据
const { data, status, refresh } = await useFetch(`/api/${props.path}`, {
  transform: (res) => (res as any).data,
});

// 查询回调
const handleSearch = async () => {
  await refresh();
};

useHead({
  title: props.title,
});
</script>
