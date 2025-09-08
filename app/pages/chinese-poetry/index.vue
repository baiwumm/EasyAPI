<template>
  <div class="flex justify-between flex-col min-h-[inherit] container mx-auto gap-6">
    <h1 class="text-2xl font-black">{{ title }}</h1>
    <div class="flex justify-center items-center mt-6">
      <div class="relative max-w-[90%] sm:max-w-[80%] min-w-[20%]">
        <UIcon name="ri:double-quotes-l" class="!size-[4rem] absolute -top-10 -left-10" />
        <TextType
          v-if="status === 'pending'"
          text="灵感正在路上..."
          :typingSpeed="75"
          :pauseDuration="1500"
          :showCursor="true"
          cursorCharacter="|"
          class="text-xl sm:text-2xl text-cetner py-6"
        />
        <TextType
          v-else
          :text="data.paragraphs?.length ? data.paragraphs.join('\n') : '服务器开小差了...'"
          :typingSpeed="75"
          :pauseDuration="1500"
          :showCursor="true"
          cursorCharacter="|"
          class="text-center text-xl sm:text-2xl leading-[2] py-6"
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
    <div class="flex justify-center gap-2 mt-6">
      <UInput v-model="author" placeholder="请输入诗词作者" class="w-40" @keyup.enter="handleSearch" />
      <UButton
        icon="ph:arrows-counter-clockwise-bold"
        size="sm"
        color="primary"
        variant="soft"
        class="cursor-pointer"
        :loading="status === 'pending'"
        @click="handleSearch"
      >
        吟诗一首
      </UButton>
    </div>
  </div>
</template>
<script setup lang="ts">
// 获取当前时间
const author = ref("李白");

const title = ref("中文诗词");

// 在句子打印完成之后显示来源信息
const showFormContent = ref(false);

// 获取请求路劲
const path = usePath();

// 请求数据
const { data, status, refresh } = await useFetch(path, {
  query: { author },
  watch: false,
  transform: (res) => (res as any).data?.[0],
  onRequest: () => {
    showFormContent.value = false;
  },
});

// 查询回调
const handleSearch = async () => {
  await refresh();
};

// 右下角来源信息
const formContent = computed(() =>
  data.value?.paragraphs?.length
    ? `—— ${data.value?.author || ""}${data.value?.title ? `《${data.value?.title}》` : ""}`
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
