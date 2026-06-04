# 开发流程

## 2.1 开发前准备

1. **需求分析**
   - 明确页面功能需求
   - 梳理数据流向
   - 确定页面交互逻辑

2. **API 查阅**
   - 查阅 API 文档
   - 确认后端接口是否满足需求
   - 如缺少接口，需先与用户沟通

3. **组件选型**
   - 查阅 PrimeVue 官方组件库
   - 选择合适的组件进行页面搭建
   - 参考 PrimeVue 组件开发规范

## 2.2 组件化开发原则

**核心原则：分组件实现功能，避免所有代码耦合到一个组件中。**

### ✅ 推荐做法

```
views/
├── User/
│   ├── index.vue           # 页面入口，负责整体布局
│   ├── components/
│   │   ├── UserTable.vue   # 用户列表表格组件
│   │   ├── UserForm.vue    # 用户表单组件（新增/编辑）
│   │   ├── UserFilter.vue  # 筛选条件组件
│   │   └── UserDetail.vue  # 用户详情组件
│   └── composables/
│       └── useUser.ts      # 用户相关逻辑组合式函数
```

### ❌ 避免做法

- 单个组件超过 500 行代码
- 将表格、表单、筛选、详情等逻辑全部写在一个文件中
- 组件职责不清晰，一个组件处理过多功能

### 组件拆分建议

| 功能模块   | 建议拆分组件     | 职责说明                 |
| ---------- | ---------------- | ------------------------ |
| 数据列表   | `XxxTable.vue`   | 负责表格展示、分页、排序 |
| 数据筛选   | `XxxFilter.vue`  | 负责搜索条件、筛选表单   |
| 数据表单   | `XxxForm.vue`    | 负责新增/编辑表单        |
| 详情展示   | `XxxDetail.vue`  | 负责详情信息展示         |
| 操作按钮组 | `XxxActions.vue` | 负责行内操作按钮         |

---

## PrimeVue 组件开发规范

### 3.1 组件使用规范

1. **组件自动导入**
   - PrimeVue 组件已通过 `unplugin-vue-components` 自动导入
   - 无需手动 `import` 组件，直接使用即可

2. **组件属性命名**
   - 使用 `camelCase` 命名属性
   - 事件监听使用 `kebab-case`

3. **组件使用请查阅primevue-skilld技能文档**

## CSS 样式编写规范

### 4.1 样式编写原则

**全部使用 Tailwind CSS 工具类，包括 PrimeVue 主题颜色，禁止在 `<style>` 中写 CSS。**

### 4.2 PrimeVue 主题颜色在 Tailwind CSS 中的使用

PrimeVue 的主题颜色已集成到 Tailwind CSS 中，可以直接使用以下类名：

#### 主色系列（Primary）

| 类名 | 说明 |
|-----|------|
| `bg-primary-[50-950]` | 主色背景（50-950 色阶） |
| `text-primary-[50-950]` | 主色文字 |
| `bg-primary` | 主色背景 |
| `text-primary` | 主色文字 |
| `text-primary-contrast` | 主色对比文字（用于主色背景上的文字） |
| `text-primary-emphasis` | 主色强调文字 |
| `border-primary-[50-950]` | 主色边框 |
| `ring-primary-[50-950]` | 主色焦点环 |

#### 表面色系列（Surface）

| 类名 | 说明 |
|-----|------|
| `bg-surface-[0-950]` | 表面背景色 |
| `text-surface-[0-950]` | 表面文字色 |
| `border-surface-[0-950]` | 表面边框色 |

#### 功能色

| 类名 | 说明 |
|-----|------|
| `bg-highlight` | 高亮背景色 |
| `bg-emphasis` | 强调背景色（hover/激活状态） |
| `text-color` | 主文本颜色 |
| `text-muted-color` | 次级/静音文本颜色 |

#### 常用颜色映射速查

| 场景 | 背景类 | 文字类 |
|-----|-------|-------|
| 主按钮 | `bg-primary-500 hover:bg-primary-600` | `text-primary-contrast` |
| 次按钮 | `bg-surface-100 hover:bg-surface-200` | `text-surface-700` |
| 危险按钮 | `bg-red-500 hover:bg-red-600` | `text-white` |
| 成功提示 | `bg-green-50` | `text-green-700` |
| 错误提示 | `bg-red-50` | `text-red-700` |
| 警告提示 | `bg-orange-50` | `text-orange-700` |
| 卡片背景 | `bg-surface-0` | `text-color` |
| 页面背景 | `bg-surface-50` | `text-color` |
| 次级文字 | - | `text-muted-color` |
| 高亮背景 | `bg-highlight` | - |
| 悬停背景 | `hover:bg-emphasis` | - |

### 4.5 样式优先级

1. **第一优先**：Tailwind CSS 工具类（布局、间距、尺寸等）
2. **第二优先**：PrimeVue 组件内置样式

**禁止在组件中编写 `<style>` 标签**，所有样式必须通过 Tailwind CSS 类实现。

## 五、TypeScript 类型规范

### 5.1 类型定义位置

- 共享类型定义在 `src/types/` 目录下
- 文件命名：`xxx.type.ts`

### 5.2 API 类型使用

```typescript
// src/api/user.ts
import { request } from "@/utils/request";
import type { User } from "@/types/user.type";

export const createUserApi = (data: Omit<User, "id" | "createdAt">) => {
  return request.post<Omit<User, "id" | "createdAt">, User>(
    "/users",
    data,
  );
};
```

---

## 六、状态管理规范

### 6.1 Pinia Store 规范

- Store 文件使用 `.store.ts` 后缀
- 使用 Composition API 风格
- 异步操作需处理 loading 状态
