<template>
  <div class="flex justify-between flex-col min-h-[inherit] container mx-auto gap-2">
    <h1 class="text-2xl font-black justify-self-start">{{ title }}</h1>

    <!-- 显示二维码 / 加载提示 -->
    <div class="flex justify-center items-center w-full min-h-[280px]">
      <div
        v-if="status === 'pending'"
        class="w-10 h-10 border-4 border-t-green-500 border-gray-300 rounded-full animate-spin"
      ></div>

      <img v-else-if="imgSrc" :src="imgSrc" :alt="text" class="max-w-[80%] max-h-[500px] object-contain" />

      <p v-else class="text-gray-400">暂无二维码</p>
    </div>

    <!-- 控制区 -->
    <div class="flex justify-center items-center flex-col sm:flex-row gap-2">
      <USelect v-model="format" :items="formatOptions" class="w-48" />
      <UInputNumber v-model="size" :min="64" :max="1000" class="w-48" />
      <UInput v-model="text" class="w-48" placeholder="请输入内容" />
      <UButton
        icon="ph:arrows-counter-clockwise-bold"
        size="sm"
        color="primary"
        variant="soft"
        class="cursor-pointer"
        :loading="status === 'pending'"
        @click="handleSearch"
      >
        生成
      </UButton>

      <!-- 下载按钮 -->
      <UButton
        icon="ph:download-simple-bold"
        size="sm"
        color="neutral"
        variant="soft"
        class="cursor-pointer"
        :disabled="!imgSrc || status === 'pending'"
        @click="handleDownload"
      >
        下载
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = useToast();

const title = ref("生成二维码");
const text = ref("Easy Api");
const format = ref("png");
const size = ref(256);

const formatOptions = ref([
  { value: "png", label: "PNG" },
  { value: "svg", label: "SVG" },
  { value: "dataurl", label: "DATAURL" },
]);

const path = usePath();
const imgSrc = ref<string | null>(null);
const status = ref<"idle" | "pending" | "success">("idle");
let currentBlob: Blob | null = null; // 用于下载 PNG/SVG

// 生成二维码
const handleSearch = async () => {
  const value = text.value.trim();
  if (!value) {
    toast.add({ title: "参数 text 必填", color: "error", icon: "ri:close-circle-line" });
    return;
  }
  if (value.length > 2000) {
    toast.add({ title: "参数 text 长度不能超过 2000 个字符", color: "error", icon: "ri:close-circle-line" });
    return;
  }

  status.value = "pending";
  imgSrc.value = null;
  currentBlob = null;

  try {
    if (format.value === "dataurl") {
      const res = await $fetch<{ code: number; data: string }>(path, {
        query: { text: value, format: "dataurl", size: size.value },
      });
      imgSrc.value = res.data;
    } else {
      const res = await $fetch<Blob>(path, {
        query: { text: value, format: format.value, size: size.value },
        responseType: "blob",
      });
      currentBlob = res;
      imgSrc.value = URL.createObjectURL(res);
    }
    status.value = "success";
  } catch (err: any) {
    toast.add({ title: `二维码生成失败: ${err.message || err}`, color: "error", icon: "ri:close-circle-line" });
    status.value = "idle";
  }
};

// 下载二维码
const handleDownload = () => {
  if (!imgSrc.value) return;

  let a = document.createElement("a");
  if (format.value === "dataurl") {
    a.href = imgSrc.value;
    a.download = `qrcode.${format.value}`;
  } else if (currentBlob) {
    a.href = URL.createObjectURL(currentBlob);
    a.download = `qrcode.${format.value}`;
  }
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// 页面加载时生成默认二维码
onMounted(() => {
  handleSearch();
});

useHead({ title });
</script>
