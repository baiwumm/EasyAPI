<template>
  <div class="flex justify-between flex-col min-h-[inherit] container mx-auto gap-6">
    <h1 class="text-2xl font-black">中文诗词</h1>
    <div v-if="data && status === 'success'" class="flex justify-center items-center">
      <div class="relative max-w-[90%] sm:max-w-[80%] min-w-[20%]">
        <UIcon name="ri:double-quotes-l" class="!size-[4rem] absolute -top-10 -left-10" />
        <TextType
          :text="data.paragraphs.join('\n')"
          :typingSpeed="75"
          :pauseDuration="1500"
          :showCursor="true"
          cursorCharacter="|"
          class="text-center text-xl sm:text-2xl leading-[2] py-6"
        />
        <div class="absolute -bottom-4 right-0">
          —— {{ data?.author || "" }}{{ data?.title ? `《${data?.title}》` : "" }}
        </div>
      </div>
    </div>
    <div v-else-if="status === 'pending'" class="flex justify-center">
      <TextType
        text="灵感正在路上..."
        :typingSpeed="75"
        :pauseDuration="1500"
        :showCursor="true"
        cursorCharacter="|"
        class="text-xl sm:text-2xl text-cetner py-6"
      />
    </div>
    <div v-else class="flex justify-center">
      <TextType
        text="服务器开小差了..."
        :typingSpeed="75"
        :pauseDuration="1500"
        :showCursor="true"
        cursorCharacter="|"
        class="text-xl sm:text-2xl text-cetner py-6"
      />
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

// 请求数据
const { data, status, refresh } = await useFetch("/api/chinese-poetry", {
  query: { author },
  watch: false,
  transform: (res) => (res as any).data?.[0],
});

// 查询回调
const handleSearch = async () => {
  await refresh();
};

useHead({
  title: "中文诗词",
});
</script>
