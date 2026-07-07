<script setup lang="ts">
import type { BasicOption } from '@vben/types';

import type { VbenFormSchema } from '#/adapter/form';

import { computed, onMounted, ref } from 'vue';

import { ProfileBaseSetting } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { message } from '#/adapter/tdesign';
import { getUserInfoApi, updateProfileApi } from '#/api';

const userStore = useUserStore();
const profileBaseSettingRef = ref();

const MOCK_ROLES_OPTIONS: BasicOption[] = [
  {
    label: '管理员',
    value: 'super',
  },
  {
    label: '用户',
    value: 'user',
  },
  {
    label: '测试',
    value: 'test',
  },
];

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      fieldName: 'realName',
      component: 'Input',
      label: '姓名',
    },
    {
      fieldName: 'username',
      component: 'Input',
      label: '用户名',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'email',
      component: 'Input',
      label: '邮箱',
    },
    {
      fieldName: 'roles',
      component: 'Select',
      componentProps: {
        mode: 'tags',
        options: MOCK_ROLES_OPTIONS,
        disabled: true,
      },
      label: '角色',
    },
    {
      fieldName: 'desc',
      component: 'Textarea',
      label: '个人简介',
    },
  ];
});

onMounted(async () => {
  const data = await getUserInfoApi();
  profileBaseSettingRef.value.getFormApi().setValues({
    ...data,
    roles: data.roles,
  });
});

async function handleSubmit(values: Record<string, any>) {
  await updateProfileApi({
    realName: values.realName,
    email: values.email,
    desc: values.desc,
  });
  // 更新 store 中的用户信息
  const updated = await getUserInfoApi();
  userStore.setUserInfo(updated);
  message.success('个人信息保存成功');
}
</script>
<template>
  <ProfileBaseSetting
    ref="profileBaseSettingRef"
    :form-schema="formSchema"
    @submit="handleSubmit"
  />
</template>
