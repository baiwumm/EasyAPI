<template>
  <UHeader :ui="{ container: '!container sm:px-0 lg:px-0', toggle: 'hidden', right: 'gap-0' }">
    <!-- 左侧标题 -->
    <template #title>
      <NuxtLink to="/">
        <NuxtImg src="/logo.svg" alt="logo" class="w-32" />
      </NuxtLink>
    </template>
    <!-- 右侧按钮 -->
    <template #right>
      <!-- 夜间模式 -->
      <ColorMode />
      <!-- 接口文档 -->
      <SocialIcon url="https://api-docs.baiwumm.com/" tip="文档" icon="codicon:book" />
      <!-- 登录用户头像 -->
      <client-only>
        <template v-if="user">
          <UButton
            v-if="user.user_metadata.avatar_url"
            :avatar="{
              src: user.user_metadata.avatar_url,
            }"
            color="neutral"
            variant="ghost"
            size="lg"
            :ui="{
              leadingAvatarSize: 'xs',
            }"
          />
          <UButton v-else icon="ri:user-3-line" color="neutral" variant="ghost" size="lg" />
        </template>
        <template v-else>
          <UTooltip arrow text="登录">
            <NuxtLink to="/login">
              <UButton icon="ri:user-3-line" color="neutral" variant="ghost" size="lg" class="cursor-pointer" />
            </NuxtLink>
          </UTooltip>
        </template>
      </client-only>
      <!-- 跳转管理界面 -->
      <client-only>
        <template v-if="user">
          <UTooltip arrow text="进入管理后台">
            <NuxtLink to="/admin">
              <UButton icon="ri:apps-fill" size="lg" color="neutral" variant="ghost" class="cursor-pointer" />
            </NuxtLink>
          </UTooltip>
        </template>
      </client-only>
      <!-- 注销用户按钮 -->
      <client-only>
        <UTooltip arrow text="注销用户">
          <UButton
            v-if="user"
            icon="ri:logout-box-r-line"
            size="lg"
            color="neutral"
            variant="ghost"
            class="cursor-pointer"
            @click="logout"
            :loading="loading"
          />
        </UTooltip>
      </client-only>
    </template>
  </UHeader>
</template>
<script setup lang="ts">
const client = useSupabaseClient();
const user = useSupabaseUser();

const loading = ref(false);

// 注销用户
const logout = async () => {
  loading.value = true;
  await client.auth.signOut().then(() => {
    loading.value = false;
    navigateTo("/");
  });
};
</script>
