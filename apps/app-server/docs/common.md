# Common 公共模块

> 路径：`apps/app-server/src/common/`

公共模块（`common`）承载了后端服务中跨业务复用的基础能力，包括**装饰器**、**数据传输对象（DTO）**、**异常过滤器**、**守卫（Guard）**、**拦截器（Interceptor）**和**工具函数**。以下按类别逐一说明。

---

## 目录结构

```
src/common/
├── decorators/
│   ├── api-result.decorator.ts   # Swagger 响应结构装饰器
│   ├── permission.decorator.ts   # 接口权限标识装饰器
│   └── public.decorator.ts       # 公开接口免认证装饰器
├── dto/
│   ├── common.dto.ts             # 统一响应结构 DTO
│   └── pagination.dto.ts         # 分页请求参数 DTO
├── filters/
│   └── http-execption.filter.ts  # 全局 HTTP 异常过滤器
├── guards/
│   ├── auth.guard.ts             # JWT 认证守卫
│   ├── global.guard.ts           # 全局组合守卫（认证 + 权限）
│   └── permission.guard.ts       # 接口权限守卫
├── interceptors/
│   └── response.interceptor.ts   # 统一响应包装拦截器
└── utils/
    ├── password.ts               # 密码加密与校验
    └── tools.ts                  # 通用工具函数
```

---

## 一、装饰器（Decorators）

### 1.1 `ApiResult` — Swagger 响应结构

- **文件**：[`decorators/api-result.decorator.ts`](src/common/decorators/api-result.decorator.ts:1)
- **用途**：为 Controller 接口自动生成符合项目统一响应格式的 Swagger 文档。
- **核心逻辑**：
  - 接收数据模型 `type`（可为数组、对象或 `null`）和 HTTP `status`（默认 `200`）。
  - 通过 `applyDecorators` 组合 `ApiExtraModels` 与 `ApiResponse`，生成包含 `code`、`message`、`data` 三字段的 Swagger Schema。

**用法示例**：

```typescript
import { ApiResult } from 'common/decorators/api-result.decorator';
import { UserDto } from './dto/user.dto';

@ApiResult({ type: UserDto })
@Get(':id')
findOne(@Param('id') id: string) {
  return this.userService.findOne(+id);
}
```

### 1.2 `Permission` — 接口权限标识

- **文件**：[`decorators/permission.decorator.ts`](src/common/decorators/permission.decorator.ts:1)
- **用途**：标记接口所需的权限字符，供 [`PermissionGuard`](src/common/guards/permission.guard.ts:1) 读取校验。

**用法示例**：

```typescript
import { Permission } from 'common/decorators/permission.decorator';

@Permission('user:create')
@Post()
create(@Body() dto: CreateUserDto) {
  return this.userService.create(dto);
}
```

### 1.3 `Public` — 公开接口免认证

- **文件**：[`decorators/public.decorator.ts`](src/common/decorators/public.decorator.ts:1)
- **用途**：标记无需 JWT 认证的公开接口（如登录、验证码）。

**用法示例**：

```typescript
import { Public } from 'common/decorators/public.decorator';

@Public()
@Post('login')
login(@Body() dto: LoginDto) {
  return this.authService.login(dto);
}
```

---

## 二、数据传输对象（DTO）

### 2.1 `CommonResponseDto<T>` — 统一响应结构

- **文件**：[`dto/common.dto.ts`](src/common/dto/common.dto.ts:1)
- **字段说明**：

| 字段      | 类型     | 说明         |
|-----------|----------|--------------|
| `code`    | `number` | HTTP 状态码   |
| `message` | `string` | 响应信息      |
| `data`    | `T`      | 业务数据（泛型）|

- **用途**：作为 [`ResponseInterceptor`](src/common/interceptors/response.interceptor.ts:1) 包装响应的载体，同时也是 `ApiResult` 装饰器的 Schema 基础。

### 2.2 `PaginationDto` — 分页请求参数

- **文件**：[`dto/pagination.dto.ts`](src/common/dto/pagination.dto.ts:1)
- **字段说明**：

| 字段       | 类型     | 默认值 | 校验规则               |
|------------|----------|--------|------------------------|
| `pageNum`  | `number` | `1`    | `@IsInt`、`@Min(1)`     |
| `pageSize` | `number` | `10`   | `@IsInt`、`@Min(1)`、`@Max(100)` |

- **说明**：使用 `class-transformer` 的 `@Type(() => Number)` 确保字符串入参被正确转为数字。

---

## 三、异常过滤器（Filters）

### 3.1 `HttpExecptionFilter` — 全局 HTTP 异常

- **文件**：[`filters/http-execption.filter.ts`](src/common/filters/http-execption.filter.ts:1)
- **用途**：捕获所有 `HttpException`，统一输出 `{ code, message, data }` 格式。
- **核心逻辑**：
  - 提取异常状态码与响应体。
  - 若 `message` 为数组，则拼接为逗号分隔字符串。
  - 支持从异常响应体中提取额外 `data` 字段（如 `auth.guard.ts` 中的自定义错误码）。

**响应示例**：

```json
{
  "code": 401,
  "message": "accessToken expired",
  "data": {
    "code": 10001
  }
}
```

---

## 四、守卫（Guards）

### 4.1 `AuthGuard` — JWT 认证守卫

- **文件**：[`guards/auth.guard.ts`](src/common/guards/auth.guard.ts:1)
- **职责**：
  1. 检查接口是否标记了 [`@Public()`](src/common/decorators/public.decorator.ts:1)，是则直接放行。
  2. 从请求头 `Authorization` 中提取 `Bearer Token`。
  3. 使用 `JwtService.verify` 校验 Token，并将解析后的 payload 挂载到 `request.user`。
  4. 对过期（`jwt expired`）或非法 Token（`invalid token`）抛出带自定义错误码的 `401` 异常。

### 4.2 `PermissionGuard` — 接口权限守卫

- **文件**：[`guards/permission.guard.ts`](src/common/guards/permission.guard.ts:1)
- **职责**：
  1. 读取接口标记的 [`@Permission()`](src/common/decorators/permission.decorator.ts:1) 权限列表。
  2. 未标记权限则直接放行。
  3. 检查 `request.user.permissions`：
     - 包含超级管理员权限（`process.env.SUPER_ADMIN_CODE`）直接放行。
     - 否则校验用户是否拥有任一所需权限，无则抛出 `403 ForbiddenException`。

### 4.3 `GlobalGuard` — 全局组合守卫

- **文件**：[`guards/global.guard.ts`](src/common/guards/global.guard.ts:1)
- **职责**：串行执行 `AuthGuard` → `PermissionGuard`，确保先认证、后鉴权。通常在 [`main.ts`](src/main.ts:1) 中通过 `APP_GUARD` 注册为全局守卫。

---

## 五、拦截器（Interceptors）

### 5.1 `ResponseInterceptor<T>` — 统一响应包装

- **文件**：[`interceptors/response.interceptor.ts`](src/common/interceptors/response.interceptor.ts:1)
- **用途**：拦截所有正常响应，将其包装为 [`CommonResponseDto<T>`](src/common/dto/common.dto.ts:1) 格式。
- **核心逻辑**：使用 RxJS `map` 操作符，将原始数据封装为 `new CommonResponseDto(code, 'OK', data)`，其中 `code` 取自响应的 `statusCode`。

**输出示例**：

```json
{
  "code": 200,
  "message": "OK",
  "data": { "id": 1, "name": "admin" }
}
```

---

## 六、工具函数（Utils）

### 6.1 `hashPassword` / `comparePassword` — 密码处理

- **文件**：[`utils/password.ts`](src/common/utils/password.ts:1)
- **依赖**：`bcrypt`
- **说明**：
  - 加密前将原始密码与 `process.env.HASH_KEY`（默认 `xl-management`）拼接，增加彩虹表攻击难度。
  - `saltRounds` 固定为 `10`。

```typescript
import { hashPassword, comparePassword } from 'common/utils/password';

const hashed = await hashPassword('123456');
const isMatch = await comparePassword('123456', hashed);
```

### 6.2 `safeEval` — 安全表达式求值

- **文件**：[`utils/tools.ts`](src/common/utils/tools.ts:1)
- **说明**：仅允许包含数字、空白字符及基础运算符（`+ - * / . ( )`）的表达式通过白名单正则，再调用 `eval` 计算结果。若包含非法字符则抛出 `Error`。

```typescript
import { safeEval } from 'common/utils/tools';

const result = safeEval('(1 + 2) * 3'); // 9
```

---

## 七、使用关系总览

```
Controller / Method
    ├── @Public()          → AuthGuard 放行
    ├── @Permission()      → PermissionGuard 鉴权
    ├── @ApiResult()       → Swagger 文档生成
    │
    ├── AuthGuard          → 校验 JWT Token → request.user
    ├── PermissionGuard    → 读取 request.user.permissions
    ├── GlobalGuard        → AuthGuard + PermissionGuard 组合
    │
    ├── ResponseInterceptor → 包装为 CommonResponseDto
    ├── HttpExecptionFilter → 统一异常响应格式
```

---

## 八、扩展建议

1. **新增装饰器**：如需接口限流、日志记录等横切关注点，可在 `decorators/` 目录下新增，并配合对应的 Guard 或 Interceptor 使用。
2. **新增 DTO**：通用的查询、排序参数可沉淀到 `dto/` 中，供各业务模块继承。
3. **新增 Guard/Interceptor**：遵循 NestJS 标准，实现 `CanActivate` 或 `NestInterceptor` 接口，并在 `app.module.ts` 或 `main.ts` 中注册。
4. **工具函数**：与业务无关的纯函数建议优先放入 `utils/`，并保持单元测试覆盖。
