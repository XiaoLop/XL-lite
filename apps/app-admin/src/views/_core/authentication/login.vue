<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import { computed, markRaw, onMounted, ref } from 'vue';

import { AuthenticationLogin, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { getCaptchaApi } from '#/api';
import { useAuthStore } from '#/store';

import CaptchaInput from './captcha-input.vue';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

const captchaId = ref('');
const captchaImage = ref('');

async function refreshCaptcha() {
  try {
    const result = await getCaptchaApi();
    captchaId.value = result.captchaId;
    captchaImage.value = result.captchaImage;
  } catch {
    // 获取验证码失败，不做特殊处理
  }
}

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
    {
      component: markRaw(CaptchaInput),
      componentProps: {
        captchaImage: captchaImage.value,
        onRefresh: refreshCaptcha,
        placeholder: '请输入验证码',
      },
      fieldName: 'captcha',
      label: '验证码',
      rules: z.string().min(1, { message: '请输入验证码' }),
    },
  ];
});

async function handleSubmit(values: Record<string, any>) {
  try {
    await authStore.authLogin({
      username: values.username,
      password: values.password,
      captcha: values.captcha,
      captchaId: captchaId.value,
    });
  } catch {
    refreshCaptcha();
  }
}

onMounted(() => {
  refreshCaptcha();
});
</script>

<template>
  <AuthenticationLogin
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    :show-code-login="false"
    :show-forget-password="false"
    :show-qrcode-login="false"
    :show-register="false"
    :show-third-party-login="false"
    @submit="handleSubmit"
  />
</template>
