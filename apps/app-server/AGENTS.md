# AGENTS.md - AI Coding Agent Guide

## Project Overview

This is **app-server**, a backend API service for XL Video Host (XL视频托管), built with [NestJS](https://nestjs.com/) framework. It provides RESTful APIs for video link management, user management, role-based access control (RBAC), and menu management.

**Project Type**: NestJS RESTful API Service  
**Language**: TypeScript  
**Primary Language in Comments**: Chinese (中文)

## Technology Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.7+
- **Database**: PostgreSQL + TypeORM 0.3.x
- **Cache/Queue**: Redis + BullMQ
- **Authentication**: JWT (Access Token + Refresh Token with HttpOnly Cookie)
- **API Documentation**: Swagger (OpenAPI) via `@nestjs/swagger`
- **Validation**: class-validator + class-transformer
- **Browser Automation**: Playwright (for video thumbnail extraction)
- **Testing**: Jest + Supertest

## Project Structure

```
src/
├── main.ts                    # Application entry point
├── app.module.ts              # Root module with global configurations
├── app.controller.ts          # Root controller
├── app.service.ts             # Root service
├── seed/                      # Database seeding
│   ├── seed.module.ts
│   └── seed.service.ts        # Initializes super admin and menus on bootstrap
├── common/                    # Shared utilities
│   ├── decorators/            # Custom decorators
│   │   ├── api-result.decorator.ts    # Swagger response decorator
│   │   ├── permission.decorator.ts    # Permission metadata decorator
│   │   └── public.decorator.ts        # Public route decorator
│   ├── dto/                   # Common DTOs
│   │   ├── common.dto.ts      # Standard API response wrapper
│   │   └── pagination.dto.ts  # Pagination DTO
│   ├── filters/               # Exception filters
│   │   └── http-execption.filter.ts   # Global HTTP exception handler
│   ├── guards/                # Authentication & authorization guards
│   │   ├── auth.guard.ts      # JWT authentication guard
│   │   ├── global.guard.ts    # Combined auth + permission guard
│   │   └── permission.guard.ts # RBAC permission guard
│   ├── interceptors/          # Interceptors
│   │   └── response.interceptor.ts    # Standard response wrapper
│   └── utils/                 # Utility functions
│       └── password.ts        # Password hashing utilities
├── modules/                   # Business modules
│   ├── auth/                  # Authentication module
│   ├── captcha/               # CAPTCHA verification module
│   ├── menu/                  # Menu management module
│   ├── permission/            # Permission management module
│   ├── queue/                 # BullMQ queue module
│   ├── redis/                 # Redis client module
│   ├── role/                  # Role management module
│   ├── user/                  # User management module
│   └── video/                 # Video link management module
└── types/                     # Global type definitions
    └── express.d.ts           # Express type extensions
```

## Build and Development Commands

```bash
# Install dependencies
pnpm install

# Development (hot reload)
pnpm start:dev
# or
npm run start:dev

# Production build
pnpm build

# Production start
pnpm start:prod

# Code formatting
pnpm format

# Linting
pnpm lint

# Testing
pnpm test              # Unit tests
pnpm test:watch        # Watch mode
pnpm test:cov          # Coverage report
pnpm test:e2e          # End-to-end tests
```

## NestJS CLI Commands

```bash
# Create a complete CRUD resource
npx nest generate resource ./modules/module-name
# or shorthand
nest g res ./modules/module-name

# Create individual components
nest g module ./modules/module-name    # Module
nest g controller ./modules/module-name # Controller
nest g service ./modules/module-name    # Service
```

## Environment Configuration

Configuration files (loaded in order):
1. `.env` - Base configuration
2. `.env.development` - Development overrides
3. `.env.production` - Production overrides

Required environment variables:

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=xl-management

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Secrets
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret

# Server
PORT=3000
NODE_ENV=development

# Password Hashing
HASH_KEY=your-hash-key

# Super Admin (auto-created on first run)
SUPER_ADMIN_CODE='*:*'
SUPER_ADMIN_NAME=admin
SUPER_ADMIN_PASSWORD=123456
```

## API Documentation

Swagger UI is available at:
- **Swagger UI**: http://localhost:3000/api/doc
- **OpenAPI JSON**: http://localhost:3000/api/doc/json

**Note**: All API endpoints have the `/api` prefix.

## Code Style Guidelines

### Prettier Configuration
- Single quotes
- Trailing commas
- Tab width: 4 spaces (enforced by ESLint)

### ESLint Rules
- `@typescript-eslint/no-explicit-any`: off
- `@typescript-eslint/no-floating-promises`: warn
- Prettier integration with tabWidth: 4

### TypeScript Configuration
- Module: NodeNext
- Target: ES2023
- Path mapping configured in `tsconfig.json`:
  - `*` → `./src/*`
  - `src/*` → `./src/*`
  - `modules/*` → `./src/modules/*`
  - `common/*` → `./src/common/*`

## Testing Instructions

### Unit Tests
```bash
pnpm test
```
- Test files: `*.spec.ts`
- Root directory: `src/`
- Uses ts-jest for TypeScript transformation

### E2E Tests
```bash
pnpm test:e2e
```
- Test files: `*.e2e-spec.ts`
- Configuration: `test/jest-e2e.json`
- Test environment: Node.js

### Coverage
```bash
pnpm test:cov
```
- Output directory: `coverage/`

## Architecture Patterns

### 1. RBAC Permission System
- User → Role → Permission relationship
- Permission codes format: `module:action` (e.g., `user:create`, `user:delete`)
- Super admin identified by `*:*` permission code
- Permission check order: AuthGuard → PermissionGuard

### 2. API Response Format
All responses are wrapped in a standard format:
```json
{
    "code": 200,
    "message": "OK",
    "data": { ... }
}
```

Error responses:
```json
{
    "code": 400,
    "message": "Error message",
    "data": null
}
```

### 3. Authentication Flow
- Login: Returns `accessToken` (JSON) + `refreshToken` (HttpOnly Cookie)
- Access Token: 15 minutes validity
- Refresh Token: 7 days validity, stored in HttpOnly Cookie
- Token refresh endpoint: `GET /api/auth/refresh`

### 4. Decorators
- `@Public()` - Skip authentication for the route
- `@Permission('code')` - Require specific permission
- `@ApiResult({ type: Dto })` - Auto-generate Swagger response documentation

### 5. Queue System (BullMQ)
- Queue name: `video`
- Concurrency: 3
- Used for: Video thumbnail extraction via Playwright
- Prefix: `XL-BULL`

## Security Considerations

1. **JWT Tokens**: 
   - Access tokens are short-lived (15 min)
   - Refresh tokens are stored in HttpOnly cookies
   - Different secrets for access and refresh tokens

2. **Password Security**:
   - Passwords are hashed using bcrypt
   - Hash key from environment variables

3. **CORS**: Not explicitly configured (add if needed for production)

4. **Database**:
   - TypeORM `synchronize: true` is enabled (disable in production)
   - Auto-load entities enabled

5. **Super Admin**:
   - Auto-created if no users exist in database
   - Configurable via environment variables

## Development Notes

1. **Database Seeding**: `SeedService` automatically creates super admin and initial menus on application bootstrap.

2. **Video Processing**: The `VideoProcessor` uses Playwright to scrape video thumbnails from supported platforms (BigShare, MixDrop, BoodStream).

3. **Permission Format**: Use `module:action` format for permission codes. `*:*` grants all permissions (super admin).

4. **Response Wrapper**: `ResponseInterceptor` automatically wraps all successful responses. `HttpExecptionFilter` handles errors.

5. **TypeScript Paths**: When importing, prefer using path aliases:
   - `common/*` for common modules
   - `modules/*` for business modules
   - `src/*` for src root

## Common Issues

1. **Playwright Browser**: Ensure system dependencies for Chromium are installed when deploying.

2. **Redis Connection**: Check Redis is running before starting the application.

3. **Database Migrations**: Currently using `synchronize: true`. For production, implement proper migration files.

4. **Environment Variables**: The application will fail to start if required environment variables are missing.
