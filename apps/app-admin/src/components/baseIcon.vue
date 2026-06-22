<template>

<IconCom></IconCom>

</template>

<script setup lang="ts" >
import { createIconifyIcon } from '@vben/icons';

const props = defineProps({
  icon: {
    type: String,
    required: true,
  }
});

const IconCom = createIconifyIcon(props.icon); 


</script>

<style scoped>

</style>