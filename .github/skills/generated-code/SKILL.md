---
name: generated-code
description: 一键生成 Nest 模块与前端界面，快速开发功能
---

# Generated Nest Module

一键生成后端 NestJS 模块与前端管理界面。

## 命令

在项目根目录执行：

| 命令 | 说明 |
|------|------|
| `pnpm module <name> [options]` | 生成 Nest 模块（后端） |
| `pnpm web <name> [options]` | 生成前端界面 |


## 参数

| 参数 | 必填 | 说明 |
|------|------|------|
| `name` | 是 | 模块/界面名称，如 `order` |
| `-f, --fields` | 否 | 字段列表，格式：`字段名:类型:必填:默认值:注释` |

**字段类型**：`string` | `number` | `boolean` | `Date`

> **注意**：字段列表中无需添加 `id`、`createdAt`（创建时间）和 `updatedAt`（修改时间），这些字段在生成时会自动默认添加。

字段间用逗号分隔，若某部分为空保留分号占位（如 `title:string:true::商品标题`）。

## 示例

```bash
# 基础模块
pnpm module article

# 带自定义字段的模块
pnpm module product -f "title:string:true::商品标题,price:number:true:0:价格"

# 生成前端界面
pnpm web test -f "username:string:true::用户名,email:string:true::邮箱,age:number:false:0:年龄"
```

## 生成文件

- **模块**：`apps/app-server/src/modules/{name}/` — controller、service、module、entity、dto
- **界面**：`apps/app-admin/src/` — api、composables、views
