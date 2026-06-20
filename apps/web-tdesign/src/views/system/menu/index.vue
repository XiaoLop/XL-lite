<template>
    <Page>
        <Grid>
            <template #toolbar-actions>
                <Button theme="primary" @click="handleAdd">
                    <template #icon>
                        <Icon name="add"></Icon>
                    </template>
                    新增菜单
                </Button>
            </template>

            <template #name="{ row }">
                <div class="flex items-center ml-2">
                    <baseIcon v-if="row.icon" :icon="row.icon" class="size-4"></baseIcon>
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
                    <Button theme="primary" variant="text" size="small" @click="handleEdit(row)">
                        编辑
                    </Button>
                    <Button theme="danger" variant="text" size="small" @click="handleDelete(row)">
                        删除
                    </Button>
                </Space>
            </template>
        </Grid>
    </Page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { Button, Tag, Space, Icon } from 'tdesign-vue-next';
import { getMenuListApi, type MenuListResponse } from '#/api';
import baseIcon from '#/components/baseIcon.vue';

// tdesign 组件需要注册为全局渲染器才能在 vxe-table 的 cell-render 中使用
// 这里直接在模板中使用 slot 方式

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
            width: 140,
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
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

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
    console.log('新增菜单');
}

function handleEdit(row: RowType) {
    console.log('编辑菜单', row);
}

function handleDelete(row: RowType) {
    console.log('删除菜单', row);
}

onMounted(() => {
    loadData();
});
</script>

<style scoped></style>
