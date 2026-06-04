<template>
  <div class="menu-management">
    <ConfirmDialog />
    <Toast />

    <Card>
      <template #content>
        <MenuTable
          :menu-list="menuList"
          :loading="loading"
          @add="handleAdd"
          @add-child="handleAddChild"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </template>
    </Card>

    <MenuForm
      v-model:visible="formVisible"
      :is-edit="isEdit"
      :menu-data="currentMenu"
      :menu-list="menuList"
      :submitting="submitting"
      @submit="handleFormSubmit"
      @cancel="handleFormCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import MenuTable from './components/MenuTable.vue'
import MenuForm from './components/MenuForm.vue'
import {
  getMenusApi,
  createMenuApi,
  updateMenuApi,
  deleteMenuApi,
  type CreateMenuDto,
  type UpdateMenuDto,
} from '@/api/menu'
import type { MenuItem } from '@/types/menu.type'

const toast = useToast()

// 数据状态
const menuList = ref<MenuItem[]>([])
const loading = ref(false)
const submitting = ref(false)

// 表单状态
const formVisible = ref(false)
const isEdit = ref(false) // 是否是编辑
const currentMenu = ref<MenuItem | null>(null)

// 获取菜单列表
const fetchMenuList = async () => {
  loading.value = true
  try {
    const res = await getMenusApi()
    menuList.value = res.data
  } catch {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '获取菜单列表失败',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

// 打开新增弹窗
const handleAdd = () => {
  isEdit.value = false
  currentMenu.value = null
  formVisible.value = true
}

// 打开新增子菜单弹窗
const handleAddChild = (parent: MenuItem) => {
  isEdit.value = false
  currentMenu.value = {
    id: 0,
    name: '',
    icon: '',
    path: '',
    component: '',
    permission_code: '',
    sort: 0,
    parent_id: parent.id,
    type: parent.type,
  } as MenuItem
  formVisible.value = true
}

// 打开编辑弹窗
const handleEdit = (menu: MenuItem) => {
  isEdit.value = true
  currentMenu.value = { ...menu }
  formVisible.value = true
}

// 删除菜单
const handleDelete = async (id: number) => {
  try {
    await deleteMenuApi(id)
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '删除菜单成功',
      life: 3000,
    })
    fetchMenuList()
  } catch {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '删除菜单失败',
      life: 3000,
    })
  }
}

// 提交表单
const handleFormSubmit = async (formData: {
  name: string
  type: import('@/types/menu.type').MenuType
  icon?: string
  path?: string
  component?: string
  permission_code?: string
  sort: number
  parent_id?: number
}) => {
  submitting.value = true
  try {
    if (isEdit.value && currentMenu.value) {
      // 编辑
      const updateData: UpdateMenuDto = {
        name: formData.name,
        type: formData.type,
        icon: formData.icon,
        path: formData.path,
        component: formData.component,
        permission_code: formData.permission_code,
        sort: formData.sort,
        parent_id: formData.parent_id,
      }
      await updateMenuApi(currentMenu.value.id, updateData)
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '更新菜单成功',
        life: 3000,
      })
    } else {
      // 新增
      const createData: CreateMenuDto = {
        name: formData.name,
        type: formData.type,
        icon: formData.icon,
        path: formData.path,
        component: formData.component,
        permission_code: formData.permission_code,
        sort: formData.sort,
        parent_id: formData.parent_id,
      }
      await createMenuApi(createData)
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '创建菜单成功',
        life: 3000,
      })
    }
    formVisible.value = false
    fetchMenuList()
  } catch {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: isEdit.value ? '更新菜单失败' : '创建菜单失败',
      life: 3000,
    })
  } finally {
    submitting.value = false
  }
}

// 取消表单
const handleFormCancel = () => {
  formVisible.value = false
  currentMenu.value = null
}

// 初始化
onMounted(() => {
  fetchMenuList()
})
</script>

<style scoped>
.menu-management {
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.menu-management :deep(.p-card) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.menu-management :deep(.p-card-content) {
  flex: 1;
  padding: 0;
}
</style>
