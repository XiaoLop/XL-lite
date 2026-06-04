<script setup lang="ts">
import { initToast } from '@/hooks/toast'
import { useToast } from 'primevue/usetoast'

initToast(useToast())
</script>

<template>
  <Toast />
  <router-view></router-view>
</template>

<style scoped></style>
