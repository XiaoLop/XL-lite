<template>
  <div class="m-2 h-full">
    <ScrollPanel style="width: 100%; height: 100%" class="bg-surface-0">
      <div class="icons-grid">
        <div
          v-for="icon in icons"
          :key="icon"
          class="icon-item"
          @click="copyIcon(icon)"
          :title="icon"
        >
          <i :class="['pi', icon]"></i>
          <span class="icon-name">{{ icon }}</span>
        </div>
      </div>

      <Toast />
    </ScrollPanel>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import icons from './data'

const toast = useToast()

const copyIcon = async (iconName: string) => {
  try {
    await navigator.clipboard.writeText(iconName)
    toast.add({
      severity: 'success',
      summary: '复制成功',
      detail: `已复制: ${iconName}`,
      life: 2000,
    })
  } catch {
    toast.add({
      severity: 'error',
      summary: '复制失败',
      detail: '请手动复制图标类名',
      life: 2000,
    })
  }
}
</script>

<style scoped>
.icons-header {
  margin-bottom: 1.5rem;
}

.icons-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.icons-header p {
  margin: 0;
  color: var(--text-color-secondary);
}

.icons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  border: 1px solid var(--surface-200);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--surface-card);
}

.icon-item:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.icon-item:active {
  transform: translateY(0);
}

.icon-item i {
  font-size: 2rem;
  margin-bottom: 0.75rem;
  color: var(--text-color);
}

.icon-name {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
  text-align: center;
  word-break: break-all;
  line-height: 1.4;
}
</style>
