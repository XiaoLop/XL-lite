<template>
  <div class="menu-table">
    <Toolbar class="mb-4">
      <template #start>
        <Button
          label="新增菜单"
          icon="pi pi-plus"
          class="p-button-success mr-2"
          size="small"
          @click="$emit('add')"
        />
      </template>
    </Toolbar>

    <TreeTable
      :value="treeData"
      :loading="loading"
      class="p-treetable-sm"
      scrollable
      scrollHeight="flex"
      size="small"
    >
      <Column field="name" header="菜单名称" :sortable="true" expander>
        <template #body="{ node }">
          <div class="flex align-items-center gap-2">
            <i v-if="node.data.icon" :class="node.data.icon" class="text-gray-500"></i>
            <span>{{ node.data.name }}</span>
          </div>
        </template>
      </Column>
      <Column field="type" header="类型" style="width: 100px">
        <template #body="{ node }">
          <Tag :value="getTypeLabel(node.data.type)" :severity="getTypeSeverity(node.data.type)" />
        </template>
      </Column>
      <Column field="path" header="路由路径" style="width: 200px">
        <template #body="{ node }">
          <span class="text-gray-600">{{ node.data.path || '-' }}</span>
        </template>
      </Column>
      <Column field="component" header="组件路径" style="width: 200px">
        <template #body="{ node }">
          <span class="text-gray-600">{{ node.data.component || '-' }}</span>
        </template>
      </Column>
      <Column field="permission_code" header="权限标识" style="width: 180px">
        <template #body="{ node }">
          <span class="text-gray-600">{{ node.data.permission_code || '-' }}</span>
        </template>
      </Column>
      <Column field="sort" header="排序" style="width: 80px">
        <template #body="{ node }">
          <span class="text-gray-600">{{ node.data.sort }}</span>
        </template>
      </Column>
      <Column header="操作" style="width: 200px">
        <template #body="{ node }">
          <div class="flex gap-2">
            <Button
              icon="pi pi-plus"
              class="p-button-text p-button-sm"
              v-tooltip.top="'添加子菜单'"
              @click="$emit('add-child', node.data)"
            />
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-sm p-button-warning"
              v-tooltip.top="'编辑'"
              @click="$emit('edit', node.data)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-sm p-button-danger"
              v-tooltip.top="'删除'"
              @click="handleDelete(node.data)"
            />
          </div>
        </template>
      </Column>
      <template #empty>
        <div class="text-center py-4 text-gray-500">暂无菜单数据</div>
      </template>
    </TreeTable>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import type { MenuItem } from '@/types/menu.type'
import { MenuType } from '@/types/menu.type'

interface TreeNode {
  key: string
  data: MenuItem
  children?: TreeNode[]
}

const props = defineProps<{
  menuList: MenuItem[]
  loading?: boolean
}>()

const emit = defineEmits<{
  add: []
  'add-child': [parent: MenuItem]
  edit: [menu: MenuItem]
  delete: [id: number]
}>()

const confirm = useConfirm()

// 构建树形结构
const treeData = computed<TreeNode[]>(() => {
  const buildTree = (items: MenuItem[], parentId: number | null = null): TreeNode[] => {
    return items
      .filter((item) => {
        // 兼容 parent_id 为 null 或 0 的根菜单情况
        const currentParentId = parentId === null ? 0 : parentId
        return item.parent_id === currentParentId
      })
      .sort((a, b) => a.sort - b.sort)
      .map((item) => ({
        key: String(item.id),
        data: item,
        children: buildTree(items, item.id),
      }))
  }
  return buildTree(props.menuList)
})

// 类型标签
const getTypeLabel = (type: MenuType): string => {
  const labels: Record<MenuType, string> = {
    [MenuType.MENU]: '菜单',
    [MenuType.BUTTON]: '按钮',
    [MenuType.DIRECT]: '目录',
  }
  return labels[type] || type
}

// 类型样式
const getTypeSeverity = (type: MenuType): string => {
  const severities: Record<MenuType, string> = {
    [MenuType.MENU]: 'success',
    [MenuType.BUTTON]: 'info',
    [MenuType.DIRECT]: 'warning',
  }
  return severities[type] || 'secondary'
}

// 删除菜单
const handleDelete = (menu: MenuItem) => {
  confirm.require({
    message: `确定要删除菜单 "${menu.name}" 吗？其子菜单也会被一并删除。`,
    header: '确认删除',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: '确认',
    rejectLabel: '取消',
    acceptClass: 'p-button-danger',
    accept: () => {
      emit('delete', menu.id)
    },
  })
}
</script>

<style scoped>
.menu-table {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.p-treetable) {
  flex: 1;
}

:deep(.p-treetable-tbody > tr) {
  cursor: default;
}

:deep(.p-treetable-tbody > tr:hover) {
  background-color: var(--surface-100);
}
</style>
