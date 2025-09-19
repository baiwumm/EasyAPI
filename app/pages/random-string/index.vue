<template>
  <div class="flex justify-between items-center flex-col min-h-[inherit] container mx-auto gap-2">
    <h1 class="text-2xl font-black place-self-start">{{ title }}</h1>
    <div class="flex justify-center items-center max-w-[95%] min-w-[20%] flex-wrap gap-2">
      <template v-if="status === 'success'">
        <UBadge
          color="neutral"
          variant="soft"
          v-for="v in data || []"
          class="cursor-pointer"
          @click="copyText(v)"
          icon="ph:copy-bold"
          >{{ v }}</UBadge
        >
      </template>
      <div v-else class="w-10 h-10 border-4 border-t-green-500 border-gray-300 rounded-full animate-spin"></div>
    </div>
    <div class="flex justify-center flex-col sm:flex-row gap-2">
      <USelect v-model="typeVal" multiple :items="typeOptions" class="w-48" placeholder="请选择类型组合" />
      <UInputNumber v-model="length" :min="1" :max="100" class="w-48" placeholder="请输入字符串长度" />
      <UInputNumber v-model="count" :min="1" :max="50" class="w-48" placeholder="请输入生成的数量" />
      <UInput v-model="exclude" class="w-48" placeholder="请输入需要排除的字符" />
      <UButton
        icon="ph:arrows-counter-clockwise-bold"
        size="sm"
        color="primary"
        variant="soft"
        class="cursor-pointer"
        :loading="status === 'pending'"
        @click="() => refresh()"
      >
        生成
      </UButton>
    </div>
  </div>
</template>
<script setup lang="ts">
const { copyText } = useCopy();

const title = ref("随机字符串");
const typeVal = ref<string[]>(["number", "lower", "upper"]); // 类型组合
const length = ref(16); // 字符串长度
const count = ref(10); // 生成的数量
const exclude = ref(""); // 需要排除的字符

const typeOptions = ref([
  { value: "number", label: "数字" },
  { value: "lower", label: "小写字母" },
  { value: "upper", label: "大写字母" },
  { value: "symbol", label: "特殊字符" },
]);

// 获取请求路劲
const path = usePath();
const type = computed(() => typeVal.value.join(","));

// 请求数据
const { data, status, refresh } = await useFetch(path, {
  query: { type, length, count, exclude },
  watch: false,
  transform: (res) => (res as any).data,
});

useHead({
  title,
});
</script>
