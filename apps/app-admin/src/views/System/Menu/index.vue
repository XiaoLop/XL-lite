<template>
    <Page>
        <Grid table-title="菜单管理">
            <template #toolbar-tools>
                <Button theme="primary" @click="handleAdd">
                    <template #icon>
                        <Icon name="add"></Icon>
                    </template>
                    新增菜单
                </Button>
            </template>

            <template #name="{ row }">
                <div class="flex items-center ml-2">
                    <BaseIcon v-if="row.icon" :icon="row.icon" class="size-4"></BaseIcon>
                    <span class="ml-1 text-sm">{{ row.name }}</span>
                </div>
            </template>

            <template #status="{ row }">
                <Tag :theme="row.status ? 'success' : 'danger'" variant="light">
                    {{ row.status ? '启用' : '禁用' }}
                </Tag>
            </template>
            <template #type="{ row }">
                <Tag :theme="getTypeTheme(row.type)" variant="light">
                    {{ getTypeLabel(row.type) }}
                </Tag>
            </template>
            <template #action="{ row }">
                <Space>
                    <Button theme="primary" variant="text" size="small" @click="handleAddChild(row)">
                        新增子菜单
                    </Button>
                    <Button theme="primary" variant="text" size="small" @click="handleEdit(row)">
                        编辑
                    </Button>
                    <Button theme="danger" variant="text" size="small" @click="handleDelete(row)">
                        删除
                    </Button>
                </Space>
            </template>
        </Grid>
        <MenuForm ref="menuFormRef" @success="loadData" />
    </Page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Page } from '@vben/common-ui';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { Button, Tag, Space, Icon, DialogPlugin } from 'tdesign-vue-next';
import { message } from '#/adapter/tdesign';
import { getMenuListApi, deleteMenuApi, type MenuListResponse } from '#/api';
import BaseIcon from '#/components/baseIcon.vue';
import MenuForm from './MenuForm.vue';


const typeMap: Record<string, { label: string; theme: 'primary' | 'success' | 'warning' | 'default' }> = {
    MENU: { label: '菜单', theme: 'primary' },
    BUTTON: { label: '按钮', theme: 'warning' },
    DIRECT: { label: '目录', theme: 'success' },
};

function getTypeLabel(type: string) {
    return typeMap[type]?.label || type;
}

function getTypeTheme(type: string): 'primary' | 'success' | 'warning' | 'default' {
    return typeMap[type]?.theme || 'default';
}

interface RowType extends MenuListResponse { }

const gridOptions: VxeGridProps<RowType> = {
    columns: [
        { field: 'name', title: '菜单名称', treeNode: true, minWidth: 100, slots: { default: 'name' } },
        { field: 'path', title: '路由路径', minWidth: 140 },
        { field: 'component', title: '组件路径', minWidth: 160 },
        { field: 'permission_code', title: '权限码', minWidth: 120 },
        {
            field: 'type',
            title: '类型',
            width: 80,
            slots: { default: 'type' },
        },
        { field: 'sort', title: '排序', width: 70 },
        {
            field: 'status',
            title: '状态',
            width: 80,
            slots: { default: 'status' },
        },
        {
            title: '操作',
            width: 200,
            fixed: 'right',
            slots: { default: 'action' },
        },
    ],
    treeConfig: {
        transform: true,
        rowField: 'id',
        parentField: 'parent_id',
        // 默认展开
        expandAll: true,
    },
    rowConfig: {
        keyField: 'id',
    },
    // 禁用分页，树形表格通常不需要分页
    pagerConfig: {
        enabled: false,
    },
    // 禁用代理，手动加载数据
    proxyConfig: {
        enabled: false,
        autoLoad: false,
    },
    loading: false,
    stripe: true,
    toolbarConfig: {
        custom: true,
        refresh: true,
        zoom: true,
        refreshOptions: {
            queryMethod: loadData
        },
    },  
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

const menuFormRef = ref<InstanceType<typeof MenuForm> | null>(null);

async function loadData() {
    gridApi.setLoading(true);
    try {
        const data = await getMenuListApi();
        const sortedData = [...(data || [])].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
        gridApi.setGridOptions({
            data: sortedData || [],
        });
    } finally {
        gridApi.setLoading(false);
    }
}

function handleAdd() {
    menuFormRef.value?.open();
}

function handleEdit(row: RowType) {
    menuFormRef.value?.open(row);
}

function handleAddChild(row: RowType) {
    menuFormRef.value?.open(undefined, row.id);
}

function handleDelete(row: RowType) {
    const confirmDialog = DialogPlugin.confirm({
        header: '确认删除',
        body: `确定要删除菜单「${row.name}」吗？`,
        confirmBtn: '删除',
        cancelBtn: '取消',
        onConfirm: async () => {
            try {
                gridApi.setLoading(true);
                await deleteMenuApi(row.id);
                message.success('删除成功');
                loadData();
            } finally {
                gridApi.setLoading(false);
                confirmDialog.destroy();
            }
        },
        onClose: () => {
            confirmDialog.destroy();
        },
    });
}

onMounted(() => {
    loadData();
});
</script>

<style scoped></style>
