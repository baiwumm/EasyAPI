<template>
  <div class="flex justify-between flex-col min-h-[inherit] container mx-auto gap-2">
    <h1 class="text-2xl font-black">{{ title }}</h1>
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
          class="text-xl sm:text-2xl text-cetner py-6"
        />
        <TextType
          v-else
          :text="data || '服务器开小差了...'"
          :typingSpeed="75"
          :pauseDuration="1500"
          :showCursor="true"
          cursorCharacter="|"
          class="text-xl sm:text-2xl text-cetner py-6"
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
        @click="copyText(data as string)"
      >
        复制
      </UButton>
    </div>
  </div>
</template>
<script setup lang="ts">
const { copyText } = useCopy();

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});

// 获取请求路劲
const path = usePath();

// 请求数据
const { data, status, refresh } = await useFetch(path, {
  query: { format: "text" },
});

useHead({
  title: props.title,
});
</script>
