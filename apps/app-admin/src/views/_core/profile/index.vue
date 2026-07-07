<script setup lang="ts">
import { ref } from 'vue';

import { Profile } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { message } from '#/adapter/tdesign';
import { updateAvatarApi, uploadAvatarFileApi } from '#/api';

import ProfileBase from './base-setting.vue';
import ProfileNotificationSetting from './notification-setting.vue';
import ProfilePasswordSetting from './password-setting.vue';
import ProfileSecuritySetting from './security-setting.vue';

const userStore = useUserStore();

const tabsValue = ref<string>('basic');
const avatarUploading = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const tabs = ref([
  {
    label: '基本设置',
    value: 'basic',
  },
  {
    label: '安全设置',
    value: 'security',
  },
  {
    label: '修改密码',
    value: 'password',
  },
  {
    label: '新消息提醒',
    value: 'notice',
  },
]);

function triggerAvatarUpload() {
  fileInputRef.value?.click();
}

async function handleAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  // 校验文件类型和大小
  if (!file.type.startsWith('image/')) {
    message.error('请上传图片文件');
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    message.error('图片大小不能超过 2MB');
    return;
  }

  try {
    avatarUploading.value = true;
    const { url } = await uploadAvatarFileApi(file);
    const updated = await updateAvatarApi(url);
    userStore.setUserInfo(updated);
    message.success('头像更新成功');
  } finally {
    avatarUploading.value = false;
    // 清空 input，允许重复选同一文件
    input.value = '';
  }
}
</script>
<template>
  <Profile
    v-model:model-value="tabsValue"
    title="个人中心"
    :user-info="userStore.userInfo"
    :tabs="tabs"
  >
    <template #avatar>
      <div
        class="relative cursor-pointer group size-20"
        :class="{ 'opacity-70 pointer-events-none': avatarUploading }"
        @click="triggerAvatarUpload"
      >
        <img
          :src="userStore.userInfo?.avatar || '/avatar.png'"
          class="size-20 rounded-full object-cover"
          alt="avatar"
        />
        <div
          class="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs select-none"
        >
          {{ avatarUploading ? '上传中...' : '更换头像' }}
        </div>
      </div>
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleAvatarChange"
      />
    </template>
    <template #content>
      <ProfileBase v-if="tabsValue === 'basic'" />
      <ProfileSecuritySetting v-if="tabsValue === 'security'" />
      <ProfilePasswordSetting v-if="tabsValue === 'password'" />
      <ProfileNotificationSetting v-if="tabsValue === 'notice'" />
    </template>
  </Profile>
</template>
