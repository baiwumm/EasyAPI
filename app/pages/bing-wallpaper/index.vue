<template>
  <div class="flex justify-between flex-col min-h-[inherit] container mx-auto gap-2">
    <h1 class="text-2xl font-black justify-self-start">bind 每日壁纸</h1>
    <div class="flex justify-center items-center w-full">
      <TextType
        v-if="status === 'pending'"
        text="灵感正在路上..."
        :typingSpeed="75"
        :pauseDuration="1500"
        :showCursor="true"
        cursorCharacter="|"
        class="text-lg sm:text-2xl text-cetner py-6"
      />
      <NuxtImg v-else :src="data" alt="bind 每日壁纸" class="w-[90%]" />
    </div>
    <div class="flex justify-center gap-2">
      <UButton
        icon="ph:copy-bold"
        size="sm"
        color="neutral"
        variant="soft"
        class="cursor-pointer"
        @click="copyText(data)"
      >
        复制
      </UButton>
    </div>
  </div>
</template>
<script setup lang="ts">
const { copyText } = useCopy();

// 请求数据
const { data, status } = await useFetch("/api/bing-wallpaper", {
  transform: (res) => (res as any).data,
});
</script>
