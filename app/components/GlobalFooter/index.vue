<template>
  <USeparator
    :avatar="{
      src: '/favicon.png',
    }"
  />
  <UFooter :ui="{ container: '!container sm:px-0 lg:px-0' }">
    <template #left>
      <UButton
        v-for="({ icon, url, tip }, index) in FooterRecord"
        :key="index"
        :to="url"
        target="_blank"
        variant="link"
        size="sm"
        color="neutral"
      >
        <div class="flex items-center gap-2">
          <img :src="`/${icon}`" :alt="tip" class="w-4" />
          {{ tip }}
        </div>
      </UButton>
    </template>
    <template #right>
      <!-- 社交图标 -->
      <SocialIcon v-for="({ icon, url, tip }, index) in FooterSocial" :key="index" :icon="icon" :url="url" :tip="tip" />
    </template>
  </UFooter>
</template>
<script setup lang="ts">
import { FooterSocial, FooterRecord } from "~/lib/constant";
</script>
