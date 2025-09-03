<template>
  <div class="flex justify-between flex-col min-h-[inherit] container mx-auto gap-2">
    <h1 class="text-2xl font-black justify-self-start">今日诗词</h1>
    <div class="flex justify-center items-center mt-6">
      <div class="relative max-w-[80%] min-w-[20%]">
        <UIcon name="ri:double-quotes-l" class="!size-[4rem] absolute -top-10 -left-10" />
        <TextType
          v-if="status === 'pending'"
          text="灵感正在路上..."
          :typingSpeed="75"
          :pauseDuration="1500"
          :showCursor="true"
          cursorCharacter="|"
          class="text-lg sm:text-2xl text-cetner py-6"
        />
        <TextType
          v-else
          :text="data.content || '服务器开小差了...'"
          :typingSpeed="75"
          :pauseDuration="1500"
          :showCursor="true"
          cursorCharacter="|"
          class="text-lg sm:text-2xl text-cetner py-6"
        />
        <div v-if="status === 'success'" class="absolute -bottom-4 right-0">
          —— {{ data?.author || "" }}{{ data?.origin ? `「${data?.origin}」` : "" }}
        </div>
      </div>
    </div>
    <div class="flex justify-center gap-2">
      <UButton
        icon="ph:arrows-counter-clockwise-bold"
        size="sm"
        color="primary"
        variant="soft"
        class="cursor-pointer"
        :loading="status === 'pending'"
        @click="() => refresh()"
      >
        换一句
      </UButton>
      <UButton
        icon="ph:copy-bold"
        size="sm"
        color="neutral"
        variant="soft"
        class="cursor-pointer"
        @click="copyText(data.content)"
      >
        复制
      </UButton>
    </div>
  </div>
</template>
<script setup lang="ts">
const { copyText } = useCopy();

// 请求数据
const { data, status, refresh } = await useFetch("/api/diary-poetry", {
  transform: (res) => (res as any).data,
});
</script>
