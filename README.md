# XL-lite

XL-lite 是一款轻量级、模块化的全栈后台管理系统，基于 **Vue 3** + **NestJS** 构建，采用 pnpm workspace 管理的 monorepo 架构。系统内置完整的 **RBAC 权限管理** 体系，涵盖用户、角色、菜单、权限等核心管理模块，适合作为中后台项目的快速启动模板。

---

## 技术栈

### 前端 `apps/app-admin`

| 技术 | 说明 |
|------|------|
| [Vue 3](https://vuejs.org/) | 渐进式前端框架，采用 Composition API |
| [Vite](https://vitejs.dev/) | 下一代前端构建工具，极速冷启动 |
| [TypeScript](https://www.typescriptlang.org/) | 静态类型支持 |
| [Vue Router 5](https://router.vuejs.org/) | 前端路由管理 |
| [Pinia](https://pinia.vuejs.org/) | 状态管理方案 |
| [PrimeVue](https://primevue.org/) | UI 组件库 |
| [Tailwind CSS](https://tailwindcss.com/) | 原子化 CSS 框架 |
| [oxlint](https://oxc.rs/docs/guide/usage/linter.html) / ESLint | 代码质量与规范 |

### 后端 `apps/app-server`

| 技术 | 说明 |
|------|------|
| [NestJS](https://nestjs.com/) | 基于 Node.js 的企业级后端框架 |
| [TypeORM](https://typeorm.io/) | ORM 数据库访问层 |
| [PostgreSQL](https://www.postgresql.org/) | 关系型数据库 |
| [Redis](https://redis.io/) | 缓存与会话存储 |
| [BullMQ](https://docs.bullmq.io/) | 基于 Redis 的任务队列 |
| [JWT](https://jwt.io/) / [Passport](http://www.passportjs.org/) | 身份认证与鉴权 |
| [Swagger](https://swagger.io/) | API 文档自动生成 |
| [Playwright](https://playwright.dev/) | 端到端测试 |
| [Jest](https://jestjs.io/) | 单元测试框架 |

---

## 项目结构

```
XL-lite/
├── apps/
│   ├── app-admin/          # 前端管理后台
│   │   ├── src/
│   │   │   ├── api/        # API 接口封装
│   │   │   ├── assets/     # 静态资源
│   │   │   ├── hooks/      # 组合式函数
│   │   │   ├── layout/     # 布局组件
│   │   │   ├── router/     # 路由配置与权限守卫
│   │   │   ├── stores/     # Pinia 状态管理
│   │   │   ├── types/      # TypeScript 类型定义
│   │   │   ├── utils/      # 工具函数
│   │   │   └── views/      # 页面视图
│   │   ├── public/
│   │   ├── index.html
│   │   └── vite.config.ts
│   └── app-server/         # 后端服务
│       ├── src/
│       │   ├── common/     # 公共模块（装饰器、守卫、拦截器、过滤器、DTO）
│       │   ├── modules/    # 业务模块
│       │   │   ├── auth/       # 认证模块（JWT / Refresh Token）
│       │   │   ├── captcha/    # 验证码模块
│       │   │   ├── menu/       # 菜单管理
│       │   │   ├── permission/ # 权限管理
│       │   │   ├── redis/      # Redis 服务封装
│       │   │   ├── role/       # 角色管理
│       │   │   └── user/       # 用户管理
│       │   ├── seed/       # 数据库种子数据
│       │   └── types/      # 全局类型扩展
│       ├── test/           # 端到端测试
│       └── docs/           # 开发文档
├── package.json            # 根工作区配置
└── pnpm-workspace.yaml     # pnpm 工作区配置
```

---

## 核心功能

- **RBAC 权限管理**：基于角色的访问控制，支持用户、角色、权限、菜单的多层级关联配置。
- **JWT 双 Token 认证**：支持 Access Token + Refresh Token 的无感刷新机制，兼顾安全与体验。
- **验证码登录**：集成图形验证码，防止暴力破解。
- **动态菜单与路由**：后端返回菜单树，前端动态渲染侧边栏与路由，支持按钮级权限控制。
- **响应式拦截**：统一的数据返回格式与异常处理。
- **任务队列**：基于 BullMQ + Redis，支持异步任务处理与延迟队列。
- **数据库种子**：内置初始化数据脚本，快速搭建开发环境。
- **API 文档**：集成 Swagger，自动生成接口文档。

---

## 环境准备

- [Node.js](https://nodejs.org/) >= 20.x
- [pnpm](https://pnpm.io/) >= 9.x
- [PostgreSQL](https://www.postgresql.org/) >= 15.x
- [Redis](https://redis.io/) >= 7.x

---

## 快速开始

### 1. 克隆项目并安装依赖

```bash
# 克隆仓库
git clone https://github.com/LU-xiao-liang/XL-lite.git
cd XL-lite

# 安装所有依赖
pnpm install
```

### 2. 配置后端环境变量

```bash
cd apps/app-server
cp .env.example .env
# 编辑 .env 文件，填入数据库与 Redis 连接信息
```

### 3. 启动后端服务

```bash
# 方式一：从根目录启动
pnpm dev:server

# 方式二：进入后端目录启动（支持热重载）
cd apps/app-server
pnpm start:dev
```

后端服务默认运行在 http://localhost:3000，Swagger 文档地址为 http://localhost:3000/api-docs。

### 4. 启动前端项目

```bash
cd apps/app-admin
pnpm dev
```

前端开发服务器默认运行在 http://localhost:5173。

---

## 常用命令

```bash
# 根目录
pnpm dev:server            # 启动后端开发服务

# apps/app-admin
pnpm dev                   # 启动前端开发服务器
pnpm build                 # 构建生产环境
pnpm lint                  # 运行 ESLint + oxlint 代码检查
pnpm format                # 格式化代码

# apps/app-server
pnpm start:dev             # 启动后端开发服务（热重载）
pnpm start:prod            # 生产环境启动
pnpm build                 # 构建 NestJS 项目
pnpm lint                  # 运行 ESLint 代码检查
pnpm test                  # 运行单元测试
pnpm test:e2e              # 运行端到端测试
pnpm test:cov              # 生成测试覆盖率报告
```

---

## 开发指南

- **前端路由权限**：权限守卫逻辑位于 [`apps/app-admin/src/router/permission.ts`](apps/app-admin/src/router/permission.ts)。
- **后端全局守卫**：认证与权限校验位于 [`apps/app-server/src/common/guards/`](apps/app-server/src/common/guards/)。
- **统一响应格式**：由 [`apps/app-server/src/common/interceptors/response.interceptor.ts`](apps/app-server/src/common/interceptors/response.interceptor.ts) 处理。
- **数据库实体**：所有 TypeORM 实体定义在对应模块的 `entities/` 目录下。

---

## 贡献指南

欢迎提交 Issue 与 Pull Request。提交代码前请确保：

1. 代码通过 `pnpm lint` 检查。
2. 新增的代码逻辑包含对应的单元测试。
3. 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

---

## 许可证

[ISC](LICENSE)
