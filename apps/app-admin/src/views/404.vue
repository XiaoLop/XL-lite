<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-ground p-4">
    <Card class="w-full max-w-md text-center shadow-2xl">
      <template #content>
        <div class="py-8">
          <!-- 404 图标 -->
          <div class="mb-6">
            <i class="pi pi-exclamation-circle text-8xl text-primary-500"></i>
          </div>

          <!-- 错误代码 -->
          <h1 class="text-6xl font-bold text-primary-500 mb-4">404</h1>

          <!-- 错误标题 -->
          <h2 class="text-2xl font-semibold text-surface-900 mb-3">页面未找到</h2>

          <!-- 错误描述 -->
          <p class="text-surface-600 mb-8 leading-relaxed">
            抱歉，您访问的页面不存在或已被移除。<br />
            请检查网址是否正确，或返回首页继续浏览。
          </p>

          <!-- 操作按钮 -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              label="返回首页"
              icon="pi pi-home"
              severity="primary"
              size="large"
              @click="goHome"
            />
            <Button
              label="返回上一页"
              icon="pi pi-arrow-left"
              severity="secondary"
              variant="outlined"
              size="large"
              @click="goBack"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'

const router = useRouter()

// 返回首页
const goHome = () => {
  router.push('/')
}

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<style scoped>
:deep(.p-card) {
  border-radius: 1rem;
}

:deep(.p-card-content) {
  padding: 0;
}
</style>
