# Nest.js 模块化开发

## 一、模块（Module）—— 组织边界

模块是 Nest 的**组织单位**与**依赖边界**。每个应用至少有一个根模块 `AppModule`。

### 1. 基本结构

```typescript
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  // 导入此模块所需的其他模块（例如，如果UserService依赖其他模块的Provider）
  imports: [],
  // 该模块下的控制器，负责处理进入此模块的HTTP请求
  controllers: [UserController],
  // 该模块下的提供者（服务、仓库、工厂等），供Nest IoC容器实例化和管理
  providers: [UserService],
  // 导出此模块的Provider，使其对导入此模块的其他模块可见
  exports: [UserService],
})
export class UserModule {}
```

### 2. 模块本质

> **一个模块 = 一个业务领域（domain）+ 一组依赖容器**

例如：

- `UserModule` → 用户相关
- `OrderModule` → 订单相关
- `ProductModule` → 商品相关

### 3. 核心规则（必须遵守）

- `provider` 默认**只在当前模块可见**。
- 想让其他模块使用 → 必须在 `exports` 中导出。
- 想使用其他模块的功能 → 必须在 `imports` 中导入该模块。

---

## 二、创建完整模块（实战步骤）

在 Nest 项目中，创建一个完整的业务模块通常包含以下步骤：

### 1. 使用 CLI 生成模块骨架

```bash
nest generate module user
nest generate controller user
nest generate service user
```

> 也可以一步生成所有：`nest generate resource user`，它会自动生成模块、控制器、服务、DTO、实体等。

### 2. 定义实体（Entity）

```typescript
// user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity() // 声明这是一个TypeORM实体，对应数据库中的一张表
export class User {
  @PrimaryGeneratedColumn() // 自增主键列
  id: number;

  @Column() // 普通列，类型会根据TS类型推断
  name: string;

  @Column({ unique: true }) // 唯一约束，确保邮箱不重复
  email: string;

  @Column({ default: true }) // 默认值为true的布尔列
  isActive: boolean;
}
```

### 3. 创建 DTO（数据传输对象）并添加验证

```typescript
// create-user.dto.ts
import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';

// DTO用于定义客户端发送数据的结构，并结合验证装饰器确保数据有效性
export class CreateUserDto {
  @IsString() // 验证name必须是字符串
  name: string;

  @IsEmail() // 验证email是否符合邮箱格式
  email: string;

  @IsOptional() // 标记isActive字段是可选的，如果不提供则使用默认值
  @IsBoolean() // 验证isActive必须是布尔值（如果提供了）
  isActive?: boolean;
}
```

### 4. 编写服务（Service）

```typescript
// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable() // 声明此类可由Nest IoC容器管理，并可被注入到其他类中
export class UserService {
  // 构造函数注入User实体的TypeORM Repository，用于数据库操作
  constructor(
    @InjectRepository(User) // 使用此装饰器注入Repository
    private userRepository: Repository<User>, // private简写，自动创建并赋值属性
  ) {}

  findAll(): Promise<User[]> {
    // Repository的find()方法，查询所有记录
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    // 根据主键ID查找单条记录
    return this.userRepository.findOneBy({ id });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Repository的create()方法创建实体实例，不保存到数据库
    const user = this.userRepository.create(createUserDto);
    // Repository的save()方法将实体保存到数据库
    return this.userRepository.save(user);
  }

  async update(id: number, updateData: Partial<User>): Promise<void> {
    // Repository的update()方法，根据ID更新部分字段，返回UpdateResult
    await this.userRepository.update(id, updateData);
  }

  async remove(id: number): Promise<void> {
    // 根据ID删除记录
    await this.userRepository.delete(id);
  }
}
```

### 5. 编写控制器（Controller）

```typescript
// user.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users') // 定义基础路由前缀，所有此控制器的方法都挂载在 '/users' 下
export class UserController {
  // 依赖注入UserService，用于处理业务逻辑
  constructor(private readonly userService: UserService) {}

  @Get() // 处理 GET /users 请求
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id') // 处理 GET /users/:id 请求
  // @Param('id') 提取路径参数id，ParseIntPipe将其转换为整数，若转换失败则自动抛出异常
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Post() // 处理 POST /users 请求
  // @Body() 提取并解析请求体，自动验证CreateUserDto中定义的规则
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(':id') // 处理 PUT /users/:id 请求
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateUserDto>,
  ) {
    return this.userService.update(id, updateData);
  }

  @Delete(':id') // 处理 DELETE /users/:id 请求
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
```

### 6. 在模块中注册实体

```typescript
// user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';

@Module({
  // TypeOrmModule.forFeature() 用于在当前模块范围内注册特定实体及其Repository
  // 这使得我们可以在Service中使用 @InjectRepository(User) 注入User的Repository
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // 如果其他模块需要用到UserService，则必须导出
})
export class UserModule {}
```

### 7. 在根模块（或功能模块）中导入

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // 配置TypeORM数据库连接
    TypeOrmModule.forRoot({
      type: 'postgres', // 数据库类型
      host: 'localhost', // 主机地址
      port: 5432, // 端口
      username: 'test', // 用户名
      password: 'test', // 密码
      database: 'test', // 数据库名
      autoLoadEntities: true, // 自动加载实体文件，无需手动在entities数组中列出
      synchronize: true, // 开发环境使用，自动同步实体与数据库表结构，生产环境务必关闭
    }),
    // 导入用户模块，使整个应用的User相关功能可用
    UserModule,
  ],
})
export class AppModule {}
```

完成以上步骤后，`/users` 路由即可正常访问。

---

## 三、控制器（Controller）—— 请求入口

控制器负责**接收请求 → 参数解析 → 调用服务 → 返回响应**。

### 1. 常用装饰器详解

| 装饰器                                                 | 作用                                                     | 示例                              |
| ------------------------------------------------------ | -------------------------------------------------------- | --------------------------------- |
| `@Controller('prefix')`                                | 定义控制器基础路由                                       | `@Controller('users')`            |
| `@Get()`, `@Post()`, `@Put()`, `@Delete()`, `@Patch()` | 定义 HTTP 方法                                           | `@Get(':id')`                     |
| `@Param(key?)`                                         | 获取路径参数                                             | `@Param('id') id: string`         |
| `@Query(key?)`                                         | 获取查询字符串参数                                       | `@Query('page') page: string`     |
| `@Body(key?)`                                          | 获取请求体                                               | `@Body() dto: CreateDto`          |
| `@Headers(name?)`                                      | 获取请求头                                               | `@Headers('authorization') token` |
| `@Req()`                                               | 获取原生 Request 对象                                    | `@Req() req: Request`             |
| `@Res()`                                               | 获取原生 Response 对象（慎用，会失去 Nest 响应处理能力） | `@Res() res: Response`            |
| `@Session()`                                           | 获取 Session 对象（需启用 session 中间件）               | `@Session() session`              |
| `@Ip()`                                                | 获取客户端 IP                                            | `@Ip() ip: string`                |
| `@HostParam()`                                         | 获取主机名参数（配合 `@Controller` 的 host 选项）        | `@HostParam('account') account`   |

### 2. 参数注入示例

```typescript
@Controller('users')
export class UserController {
  @Get(':id')
  getUser(
    @Param('id') id: string, // 路径参数：/users/123 -> id = "123"
    @Query('includePosts') include: string, // 查询参数：/users/123?includePosts=true -> include = "true"
    @Headers('user-agent') userAgent: string, // 请求头：User-Agent: Mozilla/5.0...
    @Req() req: Request, // 完整的Express请求对象，用于获取更多底层信息
  ) {
    return { id, include, userAgent, url: req.url };
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    // @Body() 自动解析JSON请求体，并将其转换为CreateUserDto实例
    return this.userService.create(createUserDto);
  }
}
```

### 3. 状态码与响应头

- 默认状态码：POST → 201，其他 → 200
- 可自定义：`@HttpCode(204)`
- 设置响应头：`@Header('Cache-Control', 'none')`
- 重定向：`@Redirect('https://example.com', 301)`

```typescript
@Post()
@HttpCode(201) // 覆盖默认的200状态码，返回201 Created
@Header('X-Custom', 'myHeader') // 添加自定义响应头
create(@Body() dto: CreateUserDto) {
return this.userService.create(dto);
}
```

---

## 四、服务（Service）—— 业务逻辑层

服务负责**业务逻辑 + 数据操作**，通过 `@Injectable()` 装饰器声明为可注入的提供者。

### 1. 基本写法

```typescript
@Injectable()
export class UserService {
  // 模拟内存数据库
  private users: User[] = [];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    return this.users.find((u) => u.id === id);
  }

  create(data: CreateUserDto): User {
    // 模拟创建用户并分配ID
    const user = { id: Date.now(), ...data };
    this.users.push(user);
    return user;
  }
}
```

### 2. 依赖注入

在控制器中通过构造函数注入：

```typescript
@Controller('users')
export class UserController {
  // 通过构造函数参数的类型，Nest会自动查找并注入UserService的实例
  constructor(private readonly userService: UserService) {}
}
```

Nest 会自动解析依赖关系，并管理服务实例的生命周期（默认单例）。

### 3. 服务的最佳实践

- **单一职责**：一个服务只处理一类业务。
- **避免直接操作请求对象**：服务应只接收 DTO 或原始数据。
- **可测试性**：依赖注入便于模拟测试。

---

## 五、数据库集成（TypeORM 示例）

### 1. 实体定义

```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users') // 指定表名为'users'，如果不传参数则使用类名小写作为表名
export class User {
  @PrimaryGeneratedColumn() // 自增主键，也可以使用 @PrimaryGeneratedColumn('uuid') 生成UUID
  id: number;

  @Column({ length: 100 }) // 普通列，并设置最大长度为100
  name: string;

  @Column({ unique: true }) // 唯一约束列
  email: string;

  @Column({ default: true }) // 默认值为true的列
  isActive: boolean;

  @CreateDateColumn() // 自动在插入时设置为当前时间戳
  createdAt: Date;

  @UpdateDateColumn() // 自动在每次更新时设置为当前时间戳
  updatedAt: Date;
}
```

### 2. 在模块中注册实体

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([User])], // 注册实体，让此模块能使用UserRepository
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService], // 若其他模块需要使用UserService，其内部依赖的UserRepository也会被一并导出
})
export class UserModule {}
```

### 3. 在服务中使用 Repository

```typescript
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) // 注入User的Repository实例
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    // Repository提供丰富的查询API
    return this.userRepository.find(); // 查询所有记录
  }

  async findOne(id: number): Promise<User> {
    // 按主键查找
    return this.userRepository.findOneBy({ id });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // create方法创建实体实例，但不保存
    const user = this.userRepository.create(createUserDto);
    // save方法将实体插入数据库
    return this.userRepository.save(user);
  }

  async update(id: number, updateData: Partial<User>): Promise<void> {
    // update方法根据ID更新，返回UpdateResult
    await this.userRepository.update(id, updateData);
  }

  async remove(id: number): Promise<void> {
    // 物理删除记录
    await this.userRepository.delete(id);
  }
}
```

### 4. 事务处理

```typescript
async createUserWithProfile(createUserDto: CreateUserDto, profileData: CreateProfileDto) {
// 创建查询运行器，它是数据库连接的一个独立上下文，用于管理事务
const queryRunner = this.connection.createQueryRunner();
// 建立数据库连接
await queryRunner.connect();
// 开启事务
await queryRunner.startTransaction();
try {
// 在事务的entity manager下创建和保存用户
const user = queryRunner.manager.create(User, createUserDto);
await queryRunner.manager.save(user);
// 在事务的entity manager下创建和保存用户资料，关联userId
const profile = queryRunner.manager.create(Profile, { ...profileData, userId: user.id });
await queryRunner.manager.save(profile);
// 提交事务，所有操作永久生效
await queryRunner.commitTransaction();
return user;
} catch (err) {
// 发生异常，回滚事务，所有已执行的数据库操作被撤销
await queryRunner.rollbackTransaction();
throw err; // 将异常向上抛出，让上层处理
} finally {
// 释放查询运行器，释放数据库连接
await queryRunner.release();
}
}
```

---

## 六、增强层详解（Middleware、Guard、Pipe、Interceptor）

### 1. 中间件（Middleware）

**作用**：在请求到达控制器之前执行，通常用于日志记录、请求预处理、CORS、解析 token 等。

#### 定义中间件

```typescript
// logger.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable() // 中间件也需要是可注入的，这样它可以使用其他Provider
export class LoggerMiddleware implements NestMiddleware {
  // 必须实现use方法，它接收request, response, next三个参数
  use(req: Request, res: Response, next: NextFunction) {
    console.log(
      `${req.method} ${req.originalUrl} - ${new Date().toISOString()}`,
    );
    next(); // 调用next()将控制权传递给下一个中间件或路由处理程序
  }
}
```

#### 注册中间件（在模块中）

```typescript
// app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';

@Module({})
export class AppModule implements NestModule {
  // 实现configure方法，这是应用中间件的标准方式
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware) // 应用LoggerMiddleware
      .forRoutes('*'); // 对所有路由生效，也可以指定具体路径如 'users'
  }
}
```

**高级用法**：可以为中间件传递参数、排除特定路由等。

---

### 2. 守卫（Guard）

**作用**：决定请求是否允许继续（鉴权、权限控制）。守卫在所有中间件之后、管道之前执行。

#### 定义守卫

```typescript
// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  // canActivate方法返回布尔值或Promise<boolean>，决定请求是否被允许
  canActivate(
    context: ExecutionContext, // ExecutionContext提供了获取当前请求的上下文信息
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 从HTTP请求对象中获取Authorization头
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    // 模拟token验证逻辑，实际应用中会调用认证服务
    return validateToken(token); // 返回 true 表示允许，false 则拒绝并抛出ForbiddenException
  }
}
```

#### 使用守卫

- **控制器方法级别**：`@UseGuards(AuthGuard)`
- **控制器级别**：放在控制器类上，对该控制器所有方法生效
- **全局**：在 `main.ts` 中 `app.useGlobalGuards(new AuthGuard())`

```typescript
@Controller('users')
@UseGuards(AuthGuard) // 整个UserController的所有路由都需要通过此守卫
export class UserController {
  @Get()
  findAll() {
    // 只有通过守卫才能进入此方法
  }
}
```

#### 自定义元数据（基于角色）

```typescript
// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
// 自定义装饰器，用于设置角色元数据
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
// 注入Reflector，用于读取元数据
constructor(private reflector: Reflector) {}
canActivate(context: ExecutionContext): boolean {
// 从当前处理程序（控制器方法）上获取'roles'元数据
const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
if (!requiredRoles) return true; // 如果方法没有@Roles装饰器，则放行

// 从请求对象中获取用户信息（通常由之前的AuthGuard设置）
const { user } = context.switchToHttp().getRequest();
// 检查用户的角色是否包含所需的任何角色
return requiredRoles.some(role => user.roles?.includes(role));
}
}

// 使用示例
@Roles('admin') // 只有admin角色才能访问此路由
@Delete(':id')
remove(@Param('id') id: string) { ... }
```

---

### 3. 管道（Pipe）

**作用**：对传入的参数进行验证、转换。在守卫之后、控制器处理之前执行。

#### 内置管道

- `ValidationPipe`：配合 class-validator 自动验证 DTO
- `ParseIntPipe`：将字符串转为整数
- `ParseFloatPipe`
- `ParseBoolPipe`
- `ParseArrayPipe`
- `ParseUUIDPipe`
- `DefaultValuePipe`：设置默认值

#### 使用示例

```typescript
@Get(':id')
findOne(
// ParseIntPipe尝试将字符串id转换为数字，若失败则抛出BadRequestException
@Param('id', ParseIntPipe) id: number,
) {
return this.userService.findOne(id);
}

@Post()
create(
// 使用ValidationPipe验证请求体，whitelist选项会剔除DTO中不存在的属性
@Body(new ValidationPipe({ whitelist: true })) createUserDto: CreateUserDto,
) {
return this.userService.create(createUserDto);
}
```

#### 自定义管道

```typescript
// trim.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  // transform方法是管道核心，它接收输入值，处理后返回输出值
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'string') {
      // 如果值是字符串，去除首尾空格
      return value.trim();
    }
    if (typeof value === 'object' && value !== null) {
      // 如果值是对象，遍历所有属性，对字符串类型的属性进行trim操作
      for (const key in value) {
        if (typeof value[key] === 'string') {
          value[key] = value[key].trim();
        }
      }
    }
    return value;
  }
}
```

#### DTO 验证（配合 class-validator）

```typescript
// create-user.dto.ts
import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString() // 验证是否为字符串
  @MinLength(2) // 验证最小长度为2
  name: string;

  @IsEmail() // 验证是否为有效的邮箱格式
  email: string;
}
```

在控制器中使用：

```typescript
@Post()
create(@Body() dto: CreateUserDto) {
// 如果DTO验证失败，Nest会自动返回400 Bad Request
return this.userService.create(dto);
}
```

需要在 `main.ts` 中启用全局验证管道：

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // 剔除DTO中没有定义的字段
    forbidNonWhitelisted: true, // 如果存在未定义字段则抛出错误
    transform: true, // 自动转换类型（如字符串'1'转数字1）
  }),
);
```

---

### 4. 拦截器（Interceptor）

**作用**：在请求前后添加额外逻辑，如日志、响应映射、异常处理、缓存等。拦截器可以修改请求或响应。

#### 定义拦截器

```typescript
// logging.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  // intercept方法接收ExecutionContext和CallHandler
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...'); // 请求处理前执行
    const now = Date.now();
    // 调用next.handle()继续处理请求，并使用pipe添加后置逻辑
    return next
      .handle() // handle()返回一个Observable，代表即将发送的响应
      .pipe(
        // tap操作符允许在Observable流中执行副作用，但不修改值
        tap(() => console.log(`After... ${Date.now() - now}ms`)),
      );
  }
}
```

#### 使用拦截器

- **方法级别**：`@UseInterceptors(LoggingInterceptor)`
- **控制器级别**：放在类上
- **全局**：`app.useGlobalInterceptors(new LoggingInterceptor())`

#### 响应映射拦截器（格式化输出）

```typescript
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 使用map操作符修改响应数据，将其包装成统一格式
    return next.handle().pipe(
      map((data) => ({
        code: 200, // 业务状态码
        data, // 原始响应数据
        message: 'success', // 成功消息
        timestamp: new Date().toISOString(), // 时间戳
      })),
    );
  }
}
```

#### 异常映射拦截器

```typescript
@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 使用catchError操作符捕获下游异常，并转换为新的异常
    return next
      .handle()
      .pipe(
        catchError((err) =>
          throwError(() => new HttpException('Something went wrong', 500)),
        ),
      );
  }
}
```

---

## 七、请求完整生命周期（流程图）

```mermaid
graph TD
A[客户端请求] --> B[中间件 Middleware]
B --> C["守卫 Guard"]
C --> D["拦截器 Interceptor (before)"]
D --> E[管道 Pipe]
E --> F[控制器 Controller]
F --> G[服务 Service]
G --> H[数据库 / 外部服务]
H --> I["拦截器 Interceptor (after)"]
I --> J[响应返回客户端]
```

### 各阶段说明

1. **中间件**：最先执行，可修改请求对象，决定是否传递（next()）。
2. **守卫**：判断是否有权限访问，返回 `false` 则抛出 `ForbiddenException`。
3. **拦截器（before）**：在进入控制器前可进行额外处理（如日志、修改请求）。
4. **管道**：验证和转换参数，失败则抛出 `BadRequestException`。
5. **控制器**：接收处理后的参数，调用服务。
6. **服务**：执行业务逻辑，可能操作数据库。
7. **拦截器（after）**：处理响应数据，可以包装或修改。
8. **响应**：最终返回给客户端。

---

## 八、常用装饰器/注解汇总

| 分类       | 装饰器                                                              | 说明                          |
| ---------- | ------------------------------------------------------------------- | ----------------------------- |
| **控制器** | `@Controller()`                                                     | 定义控制器及路由前缀          |
|            | `@Get()`, `@Post()`, `@Put()`, `@Delete()`, `@Patch()`              | 路由方法                      |
|            | `@Param()`, `@Query()`, `@Body()`, `@Headers()`, `@Req()`, `@Res()` | 参数注入                      |
|            | `@HttpCode()`                                                       | 自定义状态码                  |
|            | `@Header()`                                                         | 设置响应头                    |
|            | `@Redirect()`                                                       | 重定向                        |
| **提供者** | `@Injectable()`                                                     | 标记为可注入的服务            |
|            | `@Inject()`                                                         | 显式注入（用于自定义 token）  |
| **模块**   | `@Module()`                                                         | 定义模块                      |
|            | `@Global()`                                                         | 全局模块                      |
| **数据库** | `@Entity()`                                                         | TypeORM 实体                  |
|            | `@Column()`                                                         | 列定义                        |
|            | `@PrimaryGeneratedColumn()`                                         | 主键自增                      |
|            | `@InjectRepository()`                                               | 注入仓库                      |
| **增强层** | `@UseGuards()`                                                      | 应用守卫                      |
|            | `@UseInterceptors()`                                                | 应用拦截器                    |
|            | `@UsePipes()`                                                       | 应用管道                      |
|            | `@UseFilters()`                                                     | 应用异常过滤器                |
| **自定义** | `@SetMetadata()`                                                    | 设置元数据（配合守卫/拦截器） |
|            | `@Catch()`                                                          | 定义异常过滤器捕获的异常类型  |

---

## 九、全局配置与最佳实践

### 1. 环境变量（@nestjs/config）

```typescript
// .env
DATABASE_URL=postgres://user:pass@localhost:5432/mydb

// app.module.ts
import { ConfigModule } from '@nestjs/config';

@Module({
imports: [
// 加载环境变量，isGlobal使其在所有模块中可用
ConfigModule.forRoot({
isGlobal: true,
envFilePath: '.env', // 指定环境文件路径
}),
// 异步配置TypeORM，可以从ConfigService获取配置
TypeOrmModule.forRootAsync({
imports: [ConfigModule],
useFactory: (configService: ConfigService) => ({
type: 'postgres',
url: configService.get('DATABASE_URL'), // 从环境变量获取数据库连接字符串
autoLoadEntities: true,
synchronize: false, // 生产环境必须为false
}),
inject: [ConfigService], // 注入ConfigService
}),
],
})
export class AppModule {}
```

### 2. 异常过滤器（Exception Filter）

自定义全局异常处理：

```typescript
// http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException) // 捕获所有HttpException及其子类
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // 获取HTTP上下文
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus(); // 获取HTTP状态码

    // 返回统一的错误响应格式
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message, // 异常消息
    });
  }
}
```

注册全局：

```typescript
app.useGlobalFilters(new HttpExceptionFilter());
```

### 3. 性能优化与生产建议

- 关闭 `synchronize: false` 在生产环境。
- 使用 `class-validator` 的 `whitelist` 防止多余字段。
- 启用压缩中间件：`app.use(compression())`。
- 使用 `@nestjs/throttler` 实现限流。
- 使用 `@nestjs/schedule` 处理定时任务。

---

## 十、企业级 NestJS 项目代码结构

一个典型的、可维护的企业级 NestJS 项目会按照功能、类型或领域进行分层组织。以下是推荐的项目结构，它体现了 **模块化** 和 **关注点分离** 的原则。

```text
src/
├── main.ts # 应用入口文件，负责启动应用（创建NestFactory，加载全局配置等）
├── app.module.ts # 根模块，负责导入所有功能模块和全局配置
│
├── common/ # 通用组件，被多个模块共享
│ ├── decorators/ # 自定义装饰器
│ │ ├── roles.decorator.ts # 示例：角色装饰器
│ │ └── public.decorator.ts # 示例：公开路由装饰器
│ ├── filters/ # 全局异常过滤器
│ │ └── http-exception.filter.ts
│ ├── guards/ # 全局守卫
│ │ ├── auth.guard.ts # 全局认证守卫
│ │ └── roles.guard.ts # 全局角色守卫
│ ├── interceptors/ # 全局拦截器
│ │ ├── transform.interceptor.ts # 全局响应格式拦截器
│ │ └── logging.interceptor.ts # 全局日志拦截器
│ ├── pipes/ # 全局管道
│ │ └── validation.pipe.ts # 全局验证管道配置
│ ├── middleware/ # 全局中间件
│ │ └── logger.middleware.ts
│ └── utils/ # 工具函数
│ └── bcrypt.util.ts # 示例：密码加密工具
│
├── config/ # 配置模块
│ ├── database.config.ts # 数据库配置（供TypeOrmModule.forRootAsync使用）
│ ├── redis.config.ts # Redis配置
│ └── app.config.ts # 应用配置
│
├── modules/ # 业务模块目录，按领域划分
│ ├── user/ # 用户模块
│ │ ├── user.module.ts # 用户模块定义
│ │ ├── user.controller.ts # 用户控制器
│ │ ├── user.service.ts # 用户服务（业务逻辑）
│ │ ├── user.entity.ts # 用户实体（TypeORM）
│ │ ├── dto/ # 数据传输对象
│ │ │ ├── create-user.dto.ts
│ │ │ ├── update-user.dto.ts
│ │ │ └── user-response.dto.ts
│ │ ├── repositories/ # 自定义仓库（可选，当TypeORM默认仓库不够用时）
│ │ │ └── user.repository.ts
│ │ └── user.controller.spec.ts # 单元测试
│ │
│ ├── auth/ # 认证模块（与用户模块解耦）
│ │ ├── auth.module.ts
│ │ ├── auth.controller.ts
│ │ ├── auth.service.ts
│ │ ├── strategies/ # 认证策略（如JwtStrategy, LocalStrategy）
│ │ │ ├── jwt.strategy.ts
│ │ │ └── local.strategy.ts
│ │ └── dto/
│ │ ├── login.dto.ts
│ │ └── register.dto.ts
│ │
│ ├── product/ # 产品模块
│ │ ├── product.module.ts
│ │ ├── product.controller.ts
│ │ ├── product.service.ts
│ │ ├── product.entity.ts
│ │ └── dto/
│ │ └── create-product.dto.ts
│ │
│ └── order/ # 订单模块
│ ├── order.module.ts
│ ├── order.controller.ts
│ ├── order.service.ts
│ ├── order.entity.ts
│ └── dto/
│ └── create-order.dto.ts
│
├── shared/ # 共享模块，用于导出通用Provider、常量等
│ ├── shared.module.ts # 共享模块定义，导出公共组件
│ ├── constants/ # 全局常量
│ │ └── error-messages.constant.ts
│ └── interfaces/ # 全局接口/类型定义
│ └── user.interface.ts
│
└── database/ # 数据库相关（迁移、种子数据）
├── migrations/ # TypeORM迁移文件
│ └── 1234567890-CreateUsersTable.ts
└── seeds/ # 种子数据
└── user.seed.ts
```

### 结构说明

1. **`main.ts`**：应用的启动文件，负责创建Nest应用实例，挂载全局中间件、过滤器、管道、拦截器，并监听端口。
2. **`app.module.ts`**：根模块，它的主要职责是导入所有功能模块和全局配置模块。
3. **`common/`**：存放与应用核心业务无关，但被多个模块共享的“横切关注点”（cross-cutting concerns），如全局装饰器、守卫、过滤器、拦截器等。这些组件通常是 `@Global()` 或在 `app.module.ts` 中全局注册的。
4. **`config/`**：集中管理应用的配置，通常与 `@nestjs/config` 模块集成，提供数据库、Redis、JWT密钥等配置的工厂函数。
5. **`modules/`**：**核心业务代码所在**。每个业务模块都是独立的、高内聚的单元。

- 一个模块对应一个业务领域（如 `user`、`auth`、`product`）。
- 模块内部严格遵循 **分层架构**：
- **Controller 层**：负责请求路由、参数校验、响应格式。
- **Service 层**：负责核心业务逻辑、事务管理、调用Repository。
- **Repository/Entity 层**：负责数据持久化（使用TypeORM）。
- **DTO 层**：定义数据输入和输出的结构，并使用 `class-validator` 进行验证。

1. **`shared/`**：用于导出那些需要被多个模块共享，但又不像 `common/` 那样是全局的“基础设施”组件。例如，一个 `UserService` 可能需要被 `AuthModule` 和 `OrderModule` 使用，那么可以通过 `SharedModule` 导出它，其他模块再导入 `SharedModule`。这有助于避免循环依赖。
2. **`database/`**：管理与数据库版本控制和初始化相关的脚本，如迁移文件（migrations）和种子数据（seeds）。这对于生产环境的数据库变更至关重要。

### 结构优势

- **清晰的分层**：每个模块内部都遵循 Nest 推荐的 MVC 模式，职责明确。
- **高可维护性**：代码按领域和功能组织，查找和修改特定功能非常容易。
- **可扩展性**：添加新功能只需在 `modules/` 下新增一个模块，不影响现有模块。
- **便于团队协作**：明确的目录结构和命名规范让团队成员可以并行开发不同的模块而互不干扰。
- **易于测试**：模块间的依赖通过接口（依赖注入）解耦，每个组件都可以被独立模拟和测试。

---

## 十一、总结（核心认知）

| 组件           | 作用                                    |
| -------------- | --------------------------------------- |
| **模块**       | 组织代码，划分边界，管理依赖            |
| **控制器**     | 接收请求，参数提取，调用服务，返回响应  |
| **服务**       | 业务逻辑，数据操作，可复用              |
| **中间件**     | 请求预处理（日志、解析 token）          |
| **守卫**       | 权限控制（是否允许访问）                |
| **管道**       | 参数验证与转换                          |
| **拦截器**     | 请求/响应前后处理（日志、格式化、缓存） |
| **异常过滤器** | 统一异常处理                            |
| **DTO**        | 定义数据结构与验证规则                  |

> **Nest 的核心思想**：依赖注入 + 模块化 + 装饰器驱动，使得应用结构清晰、易于测试和维护。
