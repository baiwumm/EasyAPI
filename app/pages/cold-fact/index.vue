<template>
  <div class="flex justify-between flex-col min-h-[inherit] container mx-auto gap-2">
    <h1 class="text-2xl font-black justify-self-start">{{ title }}</h1>
    <div class="flex justify-center items-center mt-6">
      <div class="relative max-w-[85%] min-w-[20%]">
        <UIcon name="ri:double-quotes-l" class="!size-[4rem] absolute -top-10 -left-10" />
        <TextType
          v-if="status === 'pending'"
          text="灵感正在路上..."
          :typingSpeed="75"
          :pauseDuration="1500"
          :showCursor="true"
          cursorCharacter="|"
          class="text-xl text-cetner py-6"
        />
        <TextType
          v-else
          :text="data.content || '服务器开小差了...'"
          :typingSpeed="75"
          :pauseDuration="1500"
          :showCursor="true"
          cursorCharacter="|"
          class="text-xl text-cetner py-6"
          :onSentenceComplete="onSentenceComplete"
        />
        <TextType
          v-if="status === 'success' && showFormContent"
          :text="formContent"
          :typingSpeed="75"
          :pauseDuration="1500"
          :showCursor="false"
          cursorCharacter="|"
          class="absolute -bottom-4 right-0"
        />
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

const title = ref("每日冷知识");

// 在句子打印完成之后显示来源信息
const showFormContent = ref(false);

// 获取请求路劲
const path = usePath();

// 请求数据
const { data, status, refresh } = await useFetch(path, {
  transform: (res) => (res as any).data,
  onRequest: () => {
    showFormContent.value = false;
  },
});

// 右下角来源信息
const formContent = computed(() =>
  data.value?.content
    ? `—— ${data.value?.source || ""}${data.value?.category ? `「${data.value?.category}」` : ""}`
    : ""
);

// 每个句子完成后触发回调
const onSentenceComplete = (sentence: string, index: number) => {
  showFormContent.value = true;
};

useHead({
  title,
});
</script>
