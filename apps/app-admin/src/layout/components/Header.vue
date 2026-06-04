<template>
  <Toolbar class="h-16">
    <template #start>
      <Breadcrumb :model="themeStore.breadcrumbs">
        <template #item="{ item, props }">
          <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
            <a :href="href" v-bind="props.action" @click="navigate">
              <span v-if="item.icon" :class="[item.icon, 'text-color']" />
              <span class="text-primary font-semibold">{{ item.label }}</span>
            </a>
          </router-link>
          <a v-else :href="item.url" :target="item.target" v-bind="props.action">
            <span v-if="item.icon" :class="[item.icon, 'text-color mr-2']" />
            <span class="text-surface-700 dark:text-surface-0">{{ item.label }}</span>
          </a>
        </template>
        <template #separator> / </template>
      </Breadcrumb>
    </template>

    <template #end>
      <div class="flex items-center">
        <Button size="small" icon="pi pi-plus" class="mr-2" severity="secondary" text />
        <Button size="small" icon="pi pi-print" class="mr-2" severity="secondary" text />
        <Button size="small" icon="pi pi-upload" severity="secondary" text />
      </div>
    </template>
  </Toolbar>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/stores/theme.store'
import { useRoute } from 'vue-router'
import { watch } from 'vue'

const themeStore = useThemeStore()
const route = useRoute()

// 监听路由变化，更新面包屑
watch(
  () => route.path,
  () => {
    themeStore.generateBreadcrumbs(route)
  },
  { immediate: true },
)
</script>

<style scoped></style>
