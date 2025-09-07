<template>
  <div class="flex justify-between flex-col min-h-[inherit] container mx-auto gap-6">
    <h1 class="text-2xl font-black">{{ title }}</h1>
    <div v-if="data && status === 'success'" class="flex items-center justify-center w-full px-4 text-xl sm:text-2xl">
      <div class="self-center text-left w-full max-w-md">
        <div>性别：{{ data.sex }}</div>
        <div>生日：{{ data.birthday }}</div>
        <div>年龄：{{ data.age }}</div>
        <div>星座：{{ data.constellation }}座</div>
        <div>身份证类型：{{ data.cardText }}</div>
        <div>地址：{{ data.address }}</div>
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
      <UInput v-model="id" placeholder="请输入公民身份证号码" class="w-60" @keyup.enter="handleSearch" />
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
import idCard from "idcard";

const toast = useToast();
const id = ref("510101199502152091");

const title = ref("身份证信息查询");

// 获取请求路劲
const path = usePath();

// 请求数据
const { data, status, refresh } = await useFetch(path, {
  query: { id },
  watch: false,
  transform: (res) => (res as any).data,
});

// 查询回调
const handleSearch = async () => {
  // 验证身份证格式
  const isValid = idCard.verify(id.value);
  if (!id.value || !isValid) {
    toast.add({
      title: "请输入合法的身份证号！",
      color: "error",
      icon: "ri:close-circle-line",
    });
    return;
  }
  await refresh();
};

useHead({
  title,
});
</script>
