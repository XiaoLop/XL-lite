---
name: generated-nest-module
description: 一键生成Nest模块，快速开发功能
---

# Generated Nest Module

## 概述

本技能用于通过 CLI 命令在 `apps/app-server` 中一键生成完整的 NestJS 资源模块（包含 Controller、Service、Module、Entity、DTO），并基于 EJS 模板自动覆盖生成符合项目规范的代码。

## 命令执行

在**项目根目录**执行以下命令：

```bash
pnpm module <name> [options]
```

其中 `name` 为模块名称（如 `order`、`product`），命令实际执行 `scripts/generated` 子包中的 CLI 工具：

```bash
pnpm --filter generated module <name> [options]
```

## 命令参数

| 参数 | 必填 | 说明 |
|------|------|------|
| `name` | **是** | 模块名称，建议使用小写单数形式（如 `order`），生成路径为 `apps/app-server/src/modules/{name}/` |
| `--no-id` | 否 | 不生成主键 `id` 字段（默认会自动生成 `@PrimaryGeneratedColumn`） |
| `--no-time` | 否 | 不生成 `createdAt` / `updatedAt` 时间戳字段（默认会自动生成） |
| `--fields` / `-f` | 否 | 自定义字段列表，格式为 `字段名:字段类型:是否必填:默认值:注释` |

### `--fields` 字段格式

字段之间用逗号 `,` 分隔，每个字段格式为：

```
字段名:字段类型:是否必填:默认值:注释
```

**字段类型**：`string` | `number` | `boolean` | `Date` | `Buffer`

**示例**：

```bash
# 生成订单模块，包含 orderNo 和 amount 字段
pnpm module order --fields "orderNo:string:true::订单编号,amount:number:true:0:订单金额"
```

## 生成文件结构

执行命令后，在 `apps/app-server/src/modules/{name}/` 下生成以下文件：

```
modules/{name}/
├── {name}.controller.ts    # 控制器，包含 CRUD 接口及 Swagger 注解
├── {name}.service.ts       # 服务层，包含 CRUD 业务逻辑及 TypeORM 查询
├── {name}.module.ts        # 模块声明，导入 TypeOrmModule.forFeature
├── dto/
│   ├── create.dto.ts       # 创建 DTO
│   ├── update.dto.ts       # 更新 DTO（继承自 Create DTO）
│   └── query.dto.ts        # 查询/分页 DTO 及响应 DTO
└── entities/
    └── {name}.entity.ts   # TypeORM 实体类（含主键、时间戳、自定义字段）
```

## 注意事项

1. **不要直接运行** `scripts/generated` 目录下的命令，统一使用根目录的 `pnpm module ...`。
2. 生成过程会先调用 `nest g resource` 初始化模块结构，再通过 EJS 模板覆盖生成符合项目规范的代码。
3. 如果不需要默认的 `id` 主键或 `createdAt`/`updatedAt` 时间戳，请使用 `--no-id` 和 `--no-time` 选项。
4. 自定义字段时，若某部分为空，请保留对应的分号占位（如 `comment` 为空则写作 `orderNo:string:true::订单编号`）。

## 使用示例

### 示例 1：生成一个基础模块（含默认字段）

```bash
pnpm module article
```

生成的 `article.entity.ts` 包含：
- `id: number`（`@PrimaryGeneratedColumn`）
- `createdAt: Date`（`@CreateDateColumn`）
- `updatedAt: Date`（`@UpdateDateColumn`）

### 示例 2：生成带自定义字段的模块

```bash
pnpm module product --fields "title:string:true::商品标题,price:number:true:0:价格,stock:number:true:0:库存"
```

生成的 `product.entity.ts` 包含：
- `id: number`
- `title!: string`
- `price!: number`
- `stock!: number`
- `createdAt: Date`
- `updatedAt: Date`

### 示例 3：生成无默认时间戳的模块

```bash
pnpm module log --no-time --fields "content:string:false::日志内容"
```

