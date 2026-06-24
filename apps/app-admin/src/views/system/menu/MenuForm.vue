<template>
  <Drawer class="w-160" :title="title">
    <Form ref="formRef" :data="formData" :rules="rules" label-width="100px" reset-type="initial" @submit="handleSubmit">
      <FormItem label="菜单名称" name="name">
        <Input v-model="formData.name" placeholder="请输入菜单名称" />
      </FormItem>
      <FormItem label="菜单类型" name="type">
        <RadioGroup v-model="formData.type">
          <Radio value="DIRECT">目录</Radio>
          <Radio value="MENU">菜单</Radio>
          <Radio value="BUTTON">按钮</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="父级菜单" name="parent_id">
        <Select v-model="formData.parent_id" placeholder="请选择父级菜单" clearable>
          <Option :value="0" label="根目录" />
          <Option v-for="item in menuOptions" :key="item.value" :value="item.value" :label="item.label" />
        </Select>
      </FormItem>
      <FormItem label="路由路径" name="path">
        <Input v-model="formData.path" placeholder="请输入路由路径" />
      </FormItem>
      <FormItem label="组件路径" name="component">
        <Input v-model="formData.component" placeholder="请输入组件路径" />
      </FormItem>
      <FormItem label="权限码" name="permission_code">
        <Input v-model="formData.permission_code" placeholder="请输入权限码" />
      </FormItem>
      <FormItem label="菜单图标" name="icon">
        <Input v-model="formData.icon" placeholder="请输入菜单图标" />
      </FormItem>
      <FormItem label="排序" name="sort">
        <InputNumber v-model="formData.sort" placeholder="请输入排序" />
      </FormItem>
      <FormItem label="菜单状态" name="status">
        <Switch v-model="formData.status" :label="['启用', '禁用']" />
      </FormItem>
    </Form>
    <template #footer>
      <Space>
        <Button theme="primary" @click="handleSave">确 定</Button>
        <Button theme="default" variant="outline" @click="handleClose">取 消</Button>
      </Space>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import {
  Button,
  Form,
  FormItem,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  Select,
  Option,
  Space,
  Switch,
} from 'tdesign-vue-next';
import type { FormInstanceFunctions, SubmitContext, FormRule } from 'tdesign-vue-next';
import { getMenuListApi, createMenuApi, updateMenuApi, type MenuListResponse } from '#/api';

const emit = defineEmits<{
  success: [];
}>();

const [Drawer, drawerApi] = useVbenDrawer({
  onClosed: () => {
    resetForm();
  },
});

const formRef = ref<FormInstanceFunctions | null>(null);
const isEdit = ref(false);
const editId = ref<number | null>(null);
const menuList = ref<MenuListResponse[]>([]);

const title = computed(() => (isEdit.value ? '编辑菜单' : '新增菜单'));

const formData = ref({
  name: '',
  path: '',
  icon: '',
  component: '',
  sort: 0,
  permission_code: '',
  type: 'MENU' as 'MENU' | 'BUTTON' | 'DIRECT',
  parent_id: 0,
  status: true,
});

const rules: Record<string, FormRule[]> = {
  name: [{ required: true, message: '请输入菜单名称', type: 'error' }],
  type: [{ required: true, message: '请选择菜单类型', type: 'error' }],
  sort: [{ required: true, message: '请输入排序', type: 'error' }],
  permission_code: [{ required: true, message: '请输入权限码', type: 'error' }],
  parent_id: [{ required: true, message: '请选择父级菜单', type: 'error' }],
  status: [{ required: true, message: '请选择菜单状态', type: 'error' }],
};

// 构建树形下拉选项
const menuOptions = computed(() => {
  const result: { value: number; label: string }[] = [];
  const map = new Map<number, MenuListResponse[]>();

  // 按 parent_id 分组
  for (const item of menuList.value) {
    const children = map.get(item.parent_id) || [];
    children.push(item);
    map.set(item.parent_id, children);
  }

  // 递归构建选项
  function buildOptions(parentId: number, level: number) {
    const children = map.get(parentId) || [];
    const sorted = [...children].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
    for (const item of sorted) {
      const indent = '　'.repeat(level) + '├─ ';
      result.push({
        value: item.id,
        label: indent + item.name,
      });
      buildOptions(item.id, level + 1);
    }
  }

  buildOptions(0, 0);
  return result;
});

async function loadMenuList() {
  try {
    const data = await getMenuListApi();
    menuList.value = data || [];
  } catch (error) {
    console.error('加载菜单列表失败', error);
  }
}

function resetForm() {
  formData.value = {
    name: '',
    path: '',
    icon: '',
    component: '',
    sort: 0,
    permission_code: '',
    type: 'MENU',
    parent_id: 0,
    status: true,
  };
  isEdit.value = false;
  editId.value = null;
  formRef.value?.clearValidate?.();
}

function open(record?: MenuListResponse, parentId?: number) {
  loadMenuList();
  if (record) {
    isEdit.value = true;
    editId.value = record.id;
    formData.value = {
      name: record.name || '',
      path: record.path || '',
      icon: record.icon || '',
      component: record.component || '',
      sort: record.sort ?? 0,
      permission_code: record.permission_code || '',
      type: record.type || 'MENU',
      parent_id: record.parent_id ?? 0,
      status: record.status ?? true,
    };
  } else if (parentId !== undefined) {
    isEdit.value = false;
    editId.value = null;
    formData.value = {
      name: '',
      path: '',
      icon: '',
      component: '',
      sort: 0,
      permission_code: '',
      type: 'MENU',
      parent_id: parentId,
      status: true,
    };
  } else {
    isEdit.value = false;
    editId.value = null;
  }
  drawerApi.open();
}

async function handleSubmit({ validateResult }: SubmitContext) {
  if (validateResult !== true) return;

  try {
    drawerApi.setState({ loading: true });
    if (isEdit.value && editId.value) {
      await updateMenuApi({
        id: editId.value,
        ...formData.value,
      });
    } else {
      await createMenuApi({
        ...formData.value,
      });
    }
    drawerApi.close();
    emit('success');
  } finally {
    drawerApi.setState({ loading: false });
  }
}

function handleClose() {
  drawerApi.close();
}

function handleSave() {
  formRef.value?.submit?.();
}

watch(
  () => formData.value.type,
  (type) => {
    if (type === 'BUTTON') {
      formData.value.path = '';
      formData.value.component = '';
      formData.value.icon = '';
    }
  },
);

defineExpose({
  open,
});
</script>

<style scoped></style>
