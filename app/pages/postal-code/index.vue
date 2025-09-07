<template>
  <div class="flex justify-between flex-col min-h-[inherit] container mx-auto gap-6">
    <h1 class="text-2xl font-black">{{ title }}</h1>
    <div v-if="data && status === 'success'" class="flex items-center justify-center w-full px-4 text-xl sm:text-2xl">
      <div class="self-center text-left w-full max-w-md">
        <div>省份：{{ data.province || "-" }}</div>
        <div>城市：{{ data.city || "-" }}</div>
        <div>区域：{{ data.area || "-" }}</div>
        <div>区域编码：{{ data.areaCode || "-" }}</div>
        <div>邮政编码：{{ data.postCode || "-" }}</div>
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
      <UInput v-model="keyword" placeholder="请输入邮政编码" maxLength="6" class="w-60" @keyup.enter="handleSearch" />
      <UButton
        icon="ph:arrows-counter-clockwise-bold"
        size="sm"
        color="primary"
        variant="soft"
        class="cursor-pointer"
        :loading="status === 'pending'"
        @click="handleSearch"
      >
        查询
      </UButton>
    </div>
  </div>
</template>
<script setup lang="ts">
const type = ref("1");
const keyword = ref("524200");

const title = ref("邮政编码查询");

// 获取请求路劲
const path = usePath();

// 请求数据
const { data, status, refresh } = await useFetch(path, {
  query: { type, keyword },
  watch: false,
  transform: (res) => (res as any).data,
});

// 查询回调
const handleSearch = async () => {
  await refresh();
};

useHead({
  title,
});
</script>
