# app-server

XL Video Host 后端服务 - 基于 NestJS 开发的视频托管 API 服务

## 项目简介

app-server 是一个使用 NestJS 框架构建的 RESTful API 服务，主要用于视频链接管理、用户管理等核心功能。服务集成了 PostgreSQL 数据库、Redis 缓存和消息队列，支持 Swagger API 文档自动生成。

## 技术栈

- **框架**: NestJS 11.x
- **数据库**: PostgreSQL + TypeORM
- **缓存/队列**: Redis + BullMQ
- **API 文档**: Swagger (OpenAPI)
- **验证**: class-validator + class-transformer

## 快速开发

```shell
# 创建 CRUD
npx nest generate resource ./modules/模块名称

# 简写
nest g res ./modules/模块名称

# 创建模块
nest g module ./modules/模块名称
# 创建控制器
nest g controller ./modules/模块名称
# 创建服务
nest g service ./modules/模块名称

```

## 启动项目

```bash
# 安装依赖
pnpm install

# 开发环境启动 (热重载)
pnpm start:dev

# 生产环境构建
pnpm build

# 生产环境启动
pnpm start:prod

# 启动项目 (默认开发环境)
pnpm start
```

## 接口文档

项目集成了 Swagger UI，提供可视化的 API 文档界面：

- **Swagger UI**: <http://localhost:3000/api/doc>
- **OpenAPI JSON**: <http://localhost:3000/api/doc/json>

> 注意: 所有 API 接口都带有 `/api` 前缀

## 环境配置

项目支持多环境配置，通过环境变量文件管理：

| 文件 | 说明 |
|------|------|
| `.env` | 通用配置 |
| `.env.development` | 开发环境配置 |
| `.env.production` | 生产环境配置 |

### 核心配置项

```bash
# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=video_host

# Redis 配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=password

# 服务配置
PORT=3000
NODE_ENV=development
```

## 项目目录结构

```
src/
├── main.ts                    # 应用入口
├── app.module.ts              # 根模块
├── app.controller.ts          # 根控制器
├── app.service.ts             # 根服务
├── common/                    # 公共模块
│   ├── decorators/            # 自定义装饰器
│   │   └── api-result.decorator.ts    # API 响应装饰器
│   ├── dto/                   # 公共 DTO
│   │   └── common.dto.ts      # 通用响应 DTO
│   ├── filters/               # 异常过滤器
│   │   └── http-execption.filter.ts   # HTTP 异常过滤器
│   └── interceptors/          # 拦截器
│       └── response.interceptor.ts     # 响应拦截器
├── modules/                   # 业务模块
│   ├── user/                  # 用户模块
│   │   ├── user.controller.ts
│   │   ├── user.module.ts
│   │   ├── user.service.ts
│   │   ├── dto/               # 用户 DTO
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   └── entities/          # 用户实体
│   │       └── user.entity.ts
│   ├── video/                 # 视频模块
│   │   ├── video.controller.ts
│   │   ├── video.module.ts
│   │   ├── video.service.ts
│   │   ├── video.processor.ts # 视频队列处理器
│   │   ├── video.entity.ts    # 视频实体
│   │   └── dto/               # 视频 DTO
│   │       ├── query-videolinks.dto.ts
│   │       └── upload-videolinks.dto.ts
│   ├── redis/                 # Redis 模块
│   │   ├── redis.module.ts
│   │   └── redis.provider.ts
│   └── queue/                 # 消息队列模块
│       └── queue.module.ts
└── types/                     # 类型定义
    └── video.type.ts
```

## 核心功能

### 用户模块 (User)

提供用户 CRUD 操作接口：

| 方法 | 路由 | 说明 |
|------|------|------|
| POST | /api/user | 创建用户 |
| GET | /api/user | 获取用户列表 |
| GET | /api/user/:id | 获取单个用户 |
| PATCH | /api/user/:id | 更新用户 |
| DELETE | /api/user/:id | 删除用户 |

### 视频模块 (Video)

提供视频链接管理功能：

| 方法 | 路由 | 说明 |
|------|------|------|
| POST | /api/videoLink/uploadLinks | 上传视频链接 |
| GET | /api/videoLink/list | 获取视频链接列表 |

## 公共组件

### 装饰器 (Decorators)

#### @ApiResult

用于标准化 API 响应格式，自动生成 Swagger 文档注解。

```typescript
@ApiResult({
    type: UserDto,
})
@Get(':id')
findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
}
```

### 过滤器 (Filters)

#### HttpExceptionFilter

全局 HTTP 异常过滤器，统一处理 HTTP 异常响应格式：

```json
{
    "code": 404,
    "message": "资源未找到"
}
```

### 拦截器 (Interceptors)

#### ResponseInterceptor

全局响应拦截器，统一包装响应数据：

```json
{
    "code": 200,
    "message": "OK",
    "data": { ... }
}
```

## 响应格式

所有 API 响应采用统一格式：

```json
{
    "code": 200,
    "message": "OK",
    "data": { ... }
}
```

错误响应：

```json
{
    "code": 400,
    "message": "请求参数错误"
}
```

## 常用命令

```bash
# 代码格式化
pnpm format

# 代码检查
pnpm lint

# 运行测试
pnpm test

# 运行测试 (监听模式)
pnpm test:watch

# 测试覆盖率
pnpm test:cov

# E2E 测试
pnpm test:e2e
```

## 开发规范

1. **DTO 定义**: 使用 class-validator 和 class-transformer 进行数据验证和转换
2. **API 文档**: 使用 @nestjs/swagger 注解自动生成 Swagger 文档
3. **错误处理**: 使用自定义异常过滤器统一处理错误
4. **响应格式**: 通过拦截器统一包装响应数据

5. **权限字符**: 模块名称:操作名称, *:* 标识所有操作
