<script lang="ts" setup>
import { computed, ref } from 'vue';

import { Input } from 'tdesign-vue-next';

interface Props {
  modelValue?: string;
  captchaImage?: string;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  captchaImage: '',
  placeholder: '请输入验证码',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  refresh: [];
}>();

const inputValue = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});

const imgLoading = ref(false);

function handleRefresh() {
  if (imgLoading.value) return;
  emit('refresh');
}

function handleImageLoad() {
  imgLoading.value = false;
}

function handleImageError() {
  imgLoading.value = false;
}
</script>

<template>
  <div class="flex items-center gap-2">
    <Input
      v-model="inputValue"
      :placeholder="placeholder"
      class="flex-1"
    />
    <div
      class="h-[32px] w-[100px] cursor-pointer overflow-hidden rounded"
      @click="handleRefresh"
    >
      <img
        v-if="captchaImage"
        :src="captchaImage"
        alt="验证码"
        class="h-full w-full object-contain"
        @error="handleImageError"
        @load="handleImageLoad"
      />
      <div
        v-else
        class="flex h-full w-full items-center justify-center text-xs text-gray-400"
      >
        点击刷新
      </div>
    </div>
  </div>
</template>
