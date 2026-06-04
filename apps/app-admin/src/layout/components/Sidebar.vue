<template>
  <Card
    class="w-full h-full flex flex-col"
    :pt="{
      root: 'flex flex-col',
      body: 'flex-1 flex flex-col overflow-hidden',
      content: 'flex-1 overflow-hidden',
    }"
  >
    <template #title>
      <div class="flex justify-center items-center">
        <Avatar class="flex items-center justify-cente overflow-hidden" size="large">
          <template #default>
            <img :src="logoImg" class="bg-primary-100 w-full h-full" alt="logo" />
          </template>
        </Avatar>
        <div class="text-xl w-2/3 text-center text-color">
          <span class="text-xl font-semibold tracking-wider"
            >{{ title }}</span
          >
        </div>
      </div>
      <Divider></Divider>
    </template>

    <template #content>
      <PanelMenu :model="items" class="w-full h-full">
        <template #item="{ item, active }">
          <router-link
            v-if="item.route"
            v-slot="{ href, navigate, isActive }"
            :to="item.route"
            custom
          >
            <a
              v-ripple
              class="flex items-center cursor-pointer py-1.5 text-sm transition-colors duration-200"
              :class="[
                isActive
                  ? 'text-primary bg-primary-50 dark:bg-primary-900/20'
                  : 'text-surface-700 dark:text-surface-0 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100',
                item.parentId !== 0 ? 'mt-2' : '',
              ]"
              :href="href"
              @click="navigate"
            >
              <span class="ml-2" :class="item.icon" />
              <span class="ml-2">{{ item.label }}</span>
            </a>
          </router-link>
          <a
            v-else
            v-ripple
            class="flex items-center cursor-pointer py-1.5 text-sm transition-colors duration-200"
            :class="[
              active
                ? 'text-primary bg-primary-50 dark:bg-primary-900/20'
                : 'text-surface-700 dark:text-surface-0 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100',
              item.parentId !== 0 ? 'mt-2' : '',
            ]"
            :href="item.url"
            :target="item.target"
          >
            <span class="ml-2" :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
            <span v-if="item.items" class="pi pi-angle-down text-primary ml-auto" />
          </a>
        </template>
      </PanelMenu>
    </template>

    <template #footer>
      <div class="rounded-lg border border-surface-200">
        <button
          v-ripple
          class="relative overflow-hidden w-full bg-transparent flex items-start p-2 pl-4 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-none cursor-pointer transition-colors duration-200"
        >
          <Avatar
            image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
            class="mr-2"
            shape="circle"
          />
          <span class="inline-flex flex-col items-start">
            <span class="font-bold">Amy Elsner</span>
            <span class="text-sm">Admin</span>
          </span>
        </button>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import logoImg from '@/assets/logo.png'
import type { MenuItem } from '@/types/menu.type'
import { getParentPath } from '@/utils/tools'
import { computed } from 'vue'

const props = defineProps<{
  menuList?: MenuItem[]
}>()
const title = import.meta.env.VITE_TITLE

type ItemMenu = {
  label: string
  icon?: string
  route?: string
  items?: ItemMenu[]
  id: number
  parentId: number
}

const items = computed(() => {
  const menuList = props.menuList || []

  // 构建菜单树形结构
  const buildMenuTree = (items: MenuItem[], parentId: number = 0): ItemMenu[] => {
    return items
      .filter((item) => item.parent_id === parentId)
      .sort((a, b) => a.sort - b.sort)
      .map((item) => {
        const menuItem: ItemMenu = {
          label: item.name,
          icon: item.icon ? `pi pi-${item.icon}` : 'pi pi-circle',
          id: item.id,
          parentId: item.parent_id,
        }

        // 查找子菜单
        const children = buildMenuTree(items, item.id)
        if (children.length > 0) {
          menuItem.items = children
        } else {
          // 叶子节点，添加路由
          menuItem.route = getParentPath(props.menuList || [], item.id)
        }

        return menuItem
      })
  }

  return buildMenuTree(menuList)
})
</script>

<style scoped></style>
