<template>
  <div class="flex justify-between items-center flex-col min-h-[inherit] container mx-auto gap-2">
    <h1 class="text-2xl font-black place-self-start">{{ title }}</h1>
    <div class="flex justify-center items-center max-w-[95%] min-w-[20%] flex-wrap gap-2">
      <template v-if="status === 'success'">
        <UButton
          color="neutral"
          variant="outline"
          v-for="v in data || []"
          class="cursor-pointer"
          @click="copyText(getColorString(v))"
          icon="ph:copy-bold"
        >
          <span
            class="w-2 h-2 rounded mr-2"
            :style="{ backgroundColor: isHsv ? hsvStringToHex(getColorString(v)) : getColorString(v) }"
          />
          <span :style="{ color: isHsv ? hsvStringToHex(getColorString(v)) : getColorString(v) }">{{
            getColorString(v)
          }}</span>
        </UButton>
      </template>
      <div v-else class="w-10 h-10 border-4 border-t-green-500 border-gray-300 rounded-full animate-spin"></div>
    </div>
    <div class="flex justify-center flex-col sm:flex-row gap-2">
      <USelect v-model="format" :items="formatOptions" class="w-48" placeholder="请选择返回格式" />
      <UInputNumber v-model="count" :min="1" :max="50" class="w-48" placeholder="请输入生成的数量" />
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

const title = ref("随机颜色");
const format = ref("all"); // 类型组合
const count = ref(10); // 生成的数量
const isHsv = ref(false); // 是否为 hsv 格式

function hsvStringToHex(hsv: string): string {
  const HSV_REGEX = /^hsv\(\s*([0-9]+(?:\.[0-9]+)?)\s*,\s*([0-9]+(?:\.[0-9]+)?)%?\s*,\s*([0-9]+(?:\.[0-9]+)?)%?\s*\)$/i;
  // 解析 "hsv(h, s%, v%)"
  const match = hsv.match(HSV_REGEX);
  if (!match) {
    return "#000000"; // 默认返回黑色
  }

  let [, hStr, sStr, vStr] = match;
  let h = parseFloat(hStr as string);
  let s = parseFloat(sStr as string);
  let v = parseFloat(vStr as string);

  // 归一化
  s /= 100;
  v /= 100;

  const c = v * s;
  const hh = h / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  let r = 0,
    g = 0,
    b = 0;

  if (hh >= 0 && hh < 1) [r, g, b] = [c, x, 0];
  else if (hh >= 1 && hh < 2) [r, g, b] = [x, c, 0];
  else if (hh >= 2 && hh < 3) [r, g, b] = [0, c, x];
  else if (hh >= 3 && hh < 4) [r, g, b] = [0, x, c];
  else if (hh >= 4 && hh < 5) [r, g, b] = [x, 0, c];
  else if (hh >= 5 && hh < 6) [r, g, b] = [c, 0, x];

  const m = v - c;
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b
    .toString(16)
    .padStart(2, "0")}`.toUpperCase();
}

const formatOptions = ref([
  { value: "all", label: "全部" },
  { value: "hex", label: "Hex" },
  { value: "rgb", label: "Rgb" },
  { value: "hsl", label: "Hsl" },
  { value: "hsv", label: "Hsv" },
]);

// 获取颜色字符串
const getColorString = (v) => v.hex || v.string || v;

// 获取请求路劲
const path = usePath();

// 请求数据
const { data, status, refresh } = await useFetch(path, {
  query: { format, count },
  watch: false,
  transform: (res) => (res as any).data,
  onResponse: () => {
    isHsv.value = format.value === "hsv";
  },
});

useHead({
  title,
});
</script>
