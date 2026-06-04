<template>
  <Dialog :visible="visible" :header="isEdit ? '编辑菜单' : '新增菜单'" :modal="true" :closable="false"
    :style="{ width: '650px' }" :breakpoints="{ '768px': '95vw' }" class="menu-form-dialog">
    <div class="form-container">
      <!-- 基础信息区域 -->
      <div class="form-section">
        <div class="section-header">
          <i class="pi pi-info-circle section-icon"></i>
          <span class="section-title">基础信息</span>
        </div>

        <div class="form-grid">
          <!-- 上级菜单 -->
          <div class="form-field full-width">
            <label for="parent_id">
              <i class="pi pi-sitemap field-icon"></i>
              上级菜单
            </label>
            <TreeSelect id="parent_id" v-model="selectedParentMenu" :options="parentMenuOptions" placeholder="请选择上级菜单"
              class="w-full" :disabled="!isEdit && !!form.parent_id" showClear />
            <small class="field-hint">
              <i class="pi pi-lightbulb"></i>
              不选择则为顶级菜单
            </small>
          </div>

          <!-- 菜单名称 -->
          <div class="form-field">
            <label for="name">
              <i class="pi pi-tag field-icon"></i>
              菜单名称 <span class="required">*</span>
            </label>
            <InputText id="name" v-model="form.name" placeholder="请输入菜单名称" :class="{ 'p-invalid': errors.name }" />
            <small v-if="errors.name" class="error-message">
              <i class="pi pi-exclamation-circle"></i>
              {{ errors.name }}
            </small>
          </div>

          <!-- 菜单类型 -->
          <div class="form-field">
            <label for="type">
              <i class="pi pi-th-large field-icon"></i>
              菜单类型 <span class="required">*</span>
            </label>
            <Select id="type" v-model="form.type" :options="menuTypeOptions" optionLabel="label" optionValue="value"
              placeholder="请选择类型" :class="{ 'p-invalid': errors.type }" />
            <small v-if="errors.type" class="error-message">
              <i class="pi pi-exclamation-circle"></i>
              {{ errors.type }}
            </small>
          </div>
        </div>
      </div>

      <!-- 配置信息区域 -->
      <div class="form-section">
        <div class="section-header">
          <i class="pi pi-cog section-icon"></i>
          <span class="section-title">配置信息</span>
        </div>

        <div class="form-grid">
          <!-- 图标 -->
          <div class="form-field">
            <label for="icon">
              <i class="pi pi-palette field-icon"></i>
              图标
            </label>
            <div class="icon-input-wrapper">
              <InputText id="icon" v-model="form.icon" placeholder="如：pi pi-home" />
              <div v-if="form.icon" class="icon-preview">
                <i :class="form.icon"></i>
              </div>
            </div>
            <small class="field-hint">
              <i class="pi pi-lightbulb"></i>
              PrimeIcons 图标类名
            </small>
          </div>

          <!-- 排序 -->
          <div class="form-field">
            <label for="sort">
              <i class="pi pi-sort field-icon"></i>
              排序
            </label>
            <InputNumber id="sort" v-model="form.sort" :min="0" placeholder="序号" />
            <small class="field-hint">
              <i class="pi pi-lightbulb"></i>
              数字越小越靠前
            </small>
          </div>

          <!-- 路由路径 -->
          <div v-if="form.type !== MenuType.BUTTON" class="form-field">
            <label for="path">
              <i class="pi pi-link field-icon"></i>
              路由路径
            </label>
            <InputText id="path" v-model="form.path" placeholder="如：/system/menu" />
          </div>

          <!-- 组件路径 -->
          <div v-if="form.type === MenuType.MENU" class="form-field">
            <label for="component">
              <i class="pi pi-file field-icon"></i>
              组件路径
            </label>
            <InputText id="component" v-model="form.component" placeholder="如：views/System/Menu/index.vue" />
          </div>

          <!-- 权限标识 -->
          <div class="form-field full-width">
            <label for="permission_code">
              <i class="pi pi-shield field-icon"></i>
              权限标识
            </label>
            <InputText id="permission_code" v-model="form.permission_code" placeholder="如：system:menu:create" />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <Button label="取消" icon="pi pi-times" class="p-button-outlined p-button-secondary" @click="handleCancel" />
        <Button label="确定" icon="pi pi-check" :loading="submitting" class="p-button-primary ml-2"
          @click="handleSubmit" />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { MenuItem } from '@/types/menu.type'
import { MenuType } from '@/types/menu.type'

interface FormData {
  name: string
  type: MenuType | null
  icon: string
  path: string
  component: string
  permission_code: string
  sort: number
  parent_id: number | null
}

const props = defineProps<{
  visible: boolean
  isEdit: boolean
  menuData?: MenuItem | null // 编辑菜单数据
  menuList: MenuItem[] // 菜单列表
  submitting?: boolean
}>()

// 提交数据类型
interface SubmitData {
  name: string
  type: MenuType
  icon?: string
  path?: string
  component?: string
  permission_code?: string
  sort: number
  parent_id?: number
}

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'submit', data: SubmitData): void
  (e: 'cancel'): void
}>()

// 表单数据
const form = ref<FormData>({
  name: '',
  type: null,
  icon: '',
  path: '',
  component: '',
  permission_code: '',
  sort: 0,
  parent_id: null,
})

// 选中的父级菜单
const selectedParentMenu = ref<Record<number, boolean> | null>(null)
// 表单验证错误
const errors = ref<Partial<Record<keyof FormData, string>>>({})

// 菜单类型选项
const menuTypeOptions = [
  { label: '菜单', value: MenuType.MENU },
  { label: '按钮', value: MenuType.BUTTON },
  { label: '目录', value: MenuType.DIRECT },
]

// 树形选项类型
interface TreeOption {
  key: string
  label: string
  data: MenuItem
  children?: TreeOption[]
}

// 上级菜单选项（树形结构，排除当前编辑的菜单及其子菜单）
const parentMenuOptions = computed(() => {
  const buildTree = (items: MenuItem[], parentId: number = 0): TreeOption[] => {
    return items
      .filter((item) => {
        // 编辑模式下，排除当前菜单及其所有子菜单
        if (props.isEdit && props.menuData) {
          if (item.id === props.menuData.id) return false
          if (isDescendant(item.id, props.menuData.id)) return false
        }
        return item.parent_id === parentId
      })
      .sort((a, b) => a.sort - b.sort)
      .map((item) => ({
        key: String(item.id),
        label: item.name,
        data: item,
        children: buildTree(items, item.id),
      }))
  }
  const result = buildTree(props.menuList)
  return result
})

// 根据节点ID查找菜单选项
const findMenu = (id: number, tree: TreeOption[]): TreeOption | null => {
  for (const option of tree) {
    if (option.data.id === id) {
      return option
    }
    if (option.children) {
      const result = findMenu(id, option.children)
      if (result) return result
    }
  }
  return null
}

// 判断是否为后代节点
const isDescendant = (nodeId: number, ancestorId: number): boolean => {
  const children = props.menuList.filter((item) => item.parent_id === ancestorId)
  if (children.some((child) => child.id === nodeId)) return true
  return children.some((child) => isDescendant(nodeId, child.id))
}


// 重置表单
const resetForm = () => {
  form.value = {
    name: '',
    type: null,
    icon: '',
    path: '',
    component: '',
    permission_code: '',
    sort: 0,
    parent_id: null,
  }
  errors.value = {}
}

// 验证表单
const validateForm = (): boolean => {
  errors.value = {}
  let isValid = true

  if (!form.value.name.trim()) {
    errors.value.name = '请输入菜单名称'
    isValid = false
  }

  if (!form.value.type) {
    errors.value.type = '请选择菜单类型'
    isValid = false
  }

  return isValid
}

// 提交表单
const handleSubmit = () => {
  if (!validateForm()) return
  if (!form.value.type) return

  const parent_id = selectedParentMenu.value ? Object.keys(selectedParentMenu.value)[0] : undefined

  emit('submit', {
    name: form.value.name.trim(),
    type: form.value.type,
    icon: form.value.icon.trim() || undefined,
    path: form.value.path.trim() || undefined,
    component: form.value.component.trim() || undefined,
    permission_code: form.value.permission_code.trim() || undefined,
    sort: form.value.sort,
    parent_id: Number(parent_id),
  })
}

// 取消
const handleCancel = () => {
  resetForm()
  emit('cancel')
}

// 监听菜单数据变化
watch(
  () => props.menuData,
  (newVal) => {
    if (newVal) {
      form.value = {
        name: newVal.name,
        type: newVal.type,
        icon: newVal.icon || '',
        path: newVal.path || '',
        component: newVal.component || '',
        permission_code: newVal.permission_code || '',
        sort: newVal.sort,
        parent_id: newVal.parent_id,
      }
      console.log(newVal)
      selectedParentMenu.value = null
      if (form.value.parent_id) {
        // 获取父级菜单
        const parentMenu = findMenu(newVal.parent_id, parentMenuOptions.value)
        selectedParentMenu.value = parentMenu ? { [parentMenu.data.id]: true } : null
      }

    } else {
      resetForm()
    }
  },
  { immediate: true },
)
</script>

<style scoped>
/* 对话框样式 */
.menu-form-dialog :deep(.p-dialog-content) {
  padding: 0;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
}

.menu-form-dialog :deep(.p-dialog-header) {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 1.25rem 1.5rem;
  border-bottom: none;
}

.menu-form-dialog :deep(.p-dialog-title) {
  font-weight: 600;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.menu-form-dialog :deep(.p-dialog-footer) {
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

/* 表单容器 */
.form-container {
  padding: 1.5rem;
}

/* 分区块 */
.form-section {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 1px 2px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f5f9;
}

.form-section:last-child {
  margin-bottom: 0;
}

/* 区块头部 */
.section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f1f5f9;
}

.section-icon {
  font-size: 1rem;
}

.section-title {
  font-weight: 600;
  font-size: 0.9375rem;
  color: #1e293b;
}

/* 表单网格 */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem 1.25rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

/* 标签样式 */
.form-field label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.field-icon {
  font-size: 0.75rem;
  color: #94a3b8;
}

.required {
  color: #ef4444;
  font-weight: 700;
}

/* 输入框样式 */
.form-field :deep(.p-inputtext),
.form-field :deep(.p-dropdown),
.form-field :deep(.p-treeselect),
.form-field :deep(.p-inputnumber) {
  width: 100%;
}

.form-field :deep(.p-inputtext) {
  padding: 0.625rem 0.875rem;
  border-radius: 8px;
  border: 1.5px solid #e2e8f0;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  background: #fafbfc;
}

.form-field :deep(.p-inputtext:hover) {
  border-color: #cbd5e1;
  background: white;
}

.form-field :deep(.p-inputtext:focus) {
  border-color: #6366f1;
  background: white;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-field :deep(.p-inputtext.p-invalid) {
  border-color: #ef4444;
  background: #fef2f2;
}

.form-field :deep(.p-inputtext.p-invalid:focus) {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* 图标输入框包装器 */
.icon-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.icon-input-wrapper :deep(.p-inputtext) {
  padding-right: 2.5rem;
}

.icon-preview {
  position: absolute;
  right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 6px;
  color: white;
  font-size: 0.875rem;
}

/* 提示文字 */
.field-hint {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 0.25rem;
}

.field-hint :deep(.pi) {
  font-size: 0.6875rem;
  color: #f59e0b;
}

/* 错误信息 */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
  font-weight: 500;
}

.error-message :deep(.pi) {
  font-size: 0.75rem;
}

/* 动画 */
.form-section {
  animation: fadeInUp 0.3s ease-out;
}

.form-section:nth-child(2) {
  animation-delay: 0.05s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
