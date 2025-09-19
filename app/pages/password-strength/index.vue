<template>
  <JsonWrapper :title="title" :status="status" :data="data" :onSearch="handleSearch">
    <template #input>
      <UInput v-model="password" placeholder="请输入密码" maxlength="128" class="w-60" @keyup.enter="handleSearch" />
    </template>
  </JsonWrapper>
</template>
<script setup lang="ts">
const toast = useToast();
const password = ref("abc123456");

const title = ref("密码强度检测");

// 获取请求路劲
const path = usePath();

// 请求数据
const { data, status, refresh } = await useFetch(path, {
  query: { password },
  watch: false,
  transform: (res) => (res as any).data,
});

// 查询回调
const handleSearch = async () => {
  if (!password.value) {
    toast.add({
      title: "参数 password 必填",
      color: "error",
      icon: "ri:close-circle-line",
    });
    return;
  }
  if (password.value.length > 128) {
    toast.add({
      title: "参数 password 长度不能超过 128 个字符",
      color: "error",
      icon: "ri:close-circle-line",
    });
    return;
  }
  await refresh();
};
</script>
