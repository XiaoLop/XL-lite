<template>
  <div class="w-full h-full flex bg-surface-100 p-2">
    <div
      class="group transition-all duration-300 ease-in-out mr-2 shrink-0"
      :class="themeStore.expand ? 'w-64' : 'w-16'"
    >
      <Sidebar :menuList="themeStore.menuList"></Sidebar>
    </div>
    <div class="flex-1 flex flex-col min-w-0">
      <div class="shrink-0">
        <Header></Header>
      </div>
      <div class="flex-1 min-h-0 mt-2 shrink-0 overflow-hidden">
        <ScrollPanel style="width: 100%; height: 100%">
          <router-view></router-view>
        </ScrollPanel>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import { useThemeStore } from '@/stores/theme.store'

const themeStore = useThemeStore()
</script>

<style scoped></style>
