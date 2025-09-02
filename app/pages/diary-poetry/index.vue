<template>
  <div class="flex justify-between flex-col min-h-[inherit] container mx-auto">
    <h1 class="text-2xl font-black justify-self-start">今日诗词</h1>
    <div class="flex justify-center items-center">
      <div class="relative max-w-[80%] min-w-[20%]">
        <UIcon name="ri:double-quotes-l" class="!size-[4rem] absolute -top-10 -left-10" />
        <TextType
          v-if="status === 'pending'"
          text="灵感正在路上..."
          :typingSpeed="75"
          :pauseDuration="1500"
          :showCursor="true"
          cursorCharacter="|"
          class="text-2xl text-cetner py-6"
        />
        <TextType
          v-else
          :text="data.content || '服务器开小差了...'"
          :typingSpeed="75"
          :pauseDuration="1500"
          :showCursor="true"
          cursorCharacter="|"
          class="text-2xl text-cetner py-6"
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
      <UButton icon="ph:copy-bold" size="sm" color="neutral" variant="soft" class="cursor-pointer" @click="copyText">
        复制
      </UButton>
    </div>
  </div>
</template>
<script setup lang="ts">
const toast = useToast();

// 请求数据
const { data, status, refresh } = await useFetch("/api/diary-poetry", {
  transform: (res) => (res as any).data,
});

// 初始化 useClipboard
const { copy, isSupported } = useClipboard({ source: data.value.content });

// 复制当前文案到剪贴板
const copyText = async () => {
  if (!data.value.content) return;

  if (!isSupported.value) {
    toast.add({
      title: "复制失败，当前浏览器不支持！",
      color: "error",
      icon: "ri:close-circle-line",
    });
    return;
  }

  try {
    await copy(data.value.content);
    toast.add({
      title: "文案已复制！",
      color: "success",
      icon: "ri:checkbox-circle-line",
    });
  } catch (err) {
    toast.add({
      title: "复制失败，请手动复制!",
      color: "error",
      icon: "ri:close-circle-line",
    });
  }
};
</script>
