# AGENTS.md

## 仓库概览

基于 pnpm workspace 管理的全栈管理后台 monorepo（Vue 3 + NestJS）。
- `apps/app-admin`: 基于 **vbenjs/vue-vben-admin** 的 Vue 3 前端。使用 TDesign、Tailwind CSS、Pinia、Vue Router 5。
- `apps/app-server`: 基于 NestJS 的后端，使用 TypeORM、PostgreSQL、Redis、BullMQ、JWT/Passport 认证。

## 环境与安装

- Node.js >= 20.x，**pnpm 10.13.1**（由 `packageManager` 字段强制指定）。
- 后端需要 PostgreSQL >= 15.x 和 Redis >= 7.x。
- 在根目录执行 `pnpm install`。
- 后端需要 `.env` 文件。将 `apps/app-server/.env.example` 复制为 `apps/app-server/.env` 并填写凭据。
- Docker 快捷方式：在根目录执行 `pnpm docker:up` 通过 `apps/app-server/docker-compose.yml` 启动 postgres + redis。

## 开发命令

除非另有说明，否则请在对应的工作区根目录运行：

- `pnpm dev:server`（根目录）— 启动后端（不监听，`nest start`）。
- `pnpm dev:admin`（根目录）— 启动前端 Vite 开发服务器（默认端口 5999，来自 `.env.development`）。
- `pnpm start:dev`（在 `apps/app-server` 中）— 后端带监听/热重载。
- `pnpm dev`（在 `apps/app-admin` 中）— 同上，前端开发服务器。
- `pnpm module`（根目录）— 运行脚手架 CLI（`scripts/generated`）。根据 CLI 参数生成实体、模块和 UI。
- `pnpm test`（在 `apps/app-server` 中）— 单元测试（Jest + ts-jest）。
- `pnpm test:e2e`（在 `apps/app-server` 中）— 端到端测试（Jest，配置位于 `test/jest-e2e.json`）。
- `pnpm typecheck`（在 `apps/app-admin` 中）— `vue-tsc --noEmit --skipLibCheck`。
- `pnpm build`（在 `apps/app-server` 中）— `nest build`（先通过 `nest-cli.json` 删除 `dist`）。
- `pnpm build`（在 `apps/app-admin` 中）— Vite 生产构建。

## 架构与连接

### 后端（`apps/app-server`）
- **全局路由前缀**：`/api`。Swagger UI 在 `/doc`，OpenAPI JSON 在 `/doc/json`。
- **TypeORM**：开发环境 `synchronize: true`（自动生成表结构）。**请勿在生产环境开启。**
- **种子数据**：`SeedService` 在应用启动时自动运行，创建超级管理员和初始菜单。无需手动执行种子命令。
- **认证流程**：JWT 双令牌（access + refresh）。`GlobalGuard` 串联 `AuthGuard` 和 `PermissionGuard`。
- **响应格式**：`ResponseInterceptor` 将所有成功响应包装为 `{ code: 0, message: 'OK', data: ... }`。
- **BullMQ**：Redis 前缀为 `XL-Lite`。
- **路径别名**：`src/*`、`modules/*`、`common/*` 在 `tsconfig.json` 中定义。
- **TSConfig 特殊配置**：`noImplicitAny: false`、`strictBindCallApply: false`、`typeRoots: ["src/types"]`。请勿假设启用了严格 TypeScript 设置。

### 前端（`apps/app-admin`）
- **导入别名**：`#/*` 映射到 `./src/*`（在 `tsconfig.json` 和 `package.json` 的 imports 中定义）。
- **API 代理**：`/api` 在开发环境中代理到 `http://localhost:3000/api`（`vite.config.ts`）。
- **动态路由**：后端返回菜单树；前端在 `src/router/guard.ts`（`setupAccessGuard`）中动态生成可访问路由。
- **启动顺序**：`main.ts` -> 初始化偏好设置 -> `bootstrap.ts` -> 初始化组件适配器 / 表单适配器 -> i18n -> Pinia stores -> 路由 -> 挂载。
- **UI 库**：TDesign（`tdesign-vue-next`）。组件适配器逻辑位于 `src/adapter/component.ts` 和 `src/adapter/form.ts`。

## Monorepo 边界

- `apps/*`：应用程序。
- `packages/*`：共享前端库（`@vben/*`）。
- `packages/@core/*`：核心前端包（基础设计令牌、可组合函数、偏好设置、ui-kit 子包如 form-ui、layout-ui、menu-ui、popup-ui、shadcn-ui、tabs-ui）。
- `packages/effects/*`：功能级包（access、common-ui、hooks、layouts、plugins、request）。
- `internal/*`：构建工具和共享配置（eslint-config、tsconfig、vite-config、tailwind-config、node-utils、lint-configs）。
- `scripts/*`：代码生成 / 脚手架工具（`scripts/generated` 是 CLI）。

## Kilo / MCP 配置

`.kilo/kilo.json` 注册了两个本地 MCP 服务器：

- `API 文档`: 从 `http://localhost:3000/doc/json` 读取
- `tdesign-mcp-server`: TDesign 组件文档 MCP
