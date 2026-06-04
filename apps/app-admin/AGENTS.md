# XL Management Admin (app-admin)

## Project Overview

This is a Vue 3 + TypeScript admin dashboard application for XL Management system. It provides a modern, responsive web interface for managing video resources, user roles, menus, and system configurations.

**Key Features:**

- JWT-based authentication with captcha verification
- Dynamic route generation based on backend menu configuration
- Role-based access control (RBAC) support
- Responsive layout with collapsible sidebar
- Theme customization using PrimeVue's Aura preset

## Technology Stack

- **Framework:** Vue 3.5+ (Composition API with `<script setup>`)
- **Language:** TypeScript 6.0
- **Build Tool:** Vite 8.0+
- **UI Library:** PrimeVue 4.5+ with Aura theme
- **CSS Framework:** Tailwind CSS 4.2+
- **State Management:** Pinia 3.0+
- **Routing:** Vue Router 5.0+
- **Icons:** PrimeIcons
- **HTTP Client:** Native Fetch API (custom wrapper)
- **Linting:** ESLint + Oxlint
- **Formatting:** Oxfmt

## Project Structure

```
src/
├── api/                    # API request functions
│   ├── auth.ts            # Authentication APIs (login, captcha, refresh token)
│   └── menu.ts            # Menu management APIs
├── assets/                # Static assets
│   ├── logo.png
│   └── main.css           # Global styles with Tailwind imports
├── hooks/                 # Composable functions
│   └── toast.ts           # Toast notification utilities
├── layout/                # Layout components
│   ├── components/
│   │   ├── Header.vue     # Top navigation with breadcrumbs
│   │   └── Sidebar.vue    # Collapsible side menu
│   └── index.vue          # Main layout wrapper
├── router/                # Vue Router configuration
│   ├── index.ts           # Route definitions
│   └── permission.ts      # Route guards (authentication)
├── stores/                # Pinia stores
│   ├── counter.ts         # Example counter store
│   └── theme.store.ts     # Theme, menu, and breadcrumb state
├── types/                 # TypeScript type definitions
│   ├── auth.type.ts       # Authentication types
│   ├── menu.type.ts       # Menu item types and enums
│   └── request.type.ts    # HTTP request/response types
├── utils/                 # Utility functions
│   ├── request.ts         # HTTP client wrapper
│   └── tools.ts           # Helper functions (path generation)
├── views/                 # Page components
│   ├── 404.vue            # Not found page
│   ├── Login.vue          # Login page with captcha
│   ├── Dashboard/         # Dashboard home
│   ├── Icons/             # Icon showcase page
│   ├── System/            # System management
│   │   ├── Menu/          # Menu management
│   │   ├── Role/          # Role management
│   │   └── User/          # User management
│   └── VideoList/         # Video list management
├── App.vue                # Root component
└── main.ts                # Application entry point
```

## Build and Development Commands

```bash
# Install dependencies
pnpm install

# Start development server with hot reload
pnpm dev

# Build for production (includes type-check)
pnpm build

# Build only (skip type-check)
pnpm build-only

# Type-check only
pnpm type-check

# Preview production build
pnpm preview

# Run all linters with auto-fix
pnpm lint

# Run Oxlint only
pnpm lint:oxlint

# Run ESLint only
pnpm lint:eslint

# Format code with Oxfmt
pnpm format
```

## Code Style Guidelines

### Linting and Formatting

- **Oxlint:** Fast JavaScript/TypeScript linter (replaces ESLint for most rules)
- **ESLint:** Vue-specific and TypeScript rules (`@vue/eslint-config-typescript`)
- **Oxfmt:** Code formatter (configured with `semi: false`, `singleQuote: true`)

### Key Style Rules

- No semicolons
- Single quotes for strings
- Vue component names can be single-word (`vue/multi-word-component-names: off`)
- Essential Vue rules enforced via `pluginVue.configs['flat/essential']`

### IDE Setup

Recommended VS Code extensions (see `.vscode/extensions.json`):

- Vue.volar (Vue language support)
- dbaeumer.vscode-eslint (ESLint integration)
- EditorConfig.EditorConfig (EditorConfig support)
- oxc.oxc-vscode (Oxlint/Oxfmt support)

VS Code settings enable:

- Auto-fix on save
- Format on save using Oxfmt
- File nesting for cleaner explorer view

## Development Conventions

### Component Structure

- Use `<script setup lang="ts">` for all components
- PrimeVue components are auto-imported via `unplugin-vue-components`
- Use Tailwind CSS classes for styling
- Scoped styles when component-specific CSS is needed

### API Pattern

```typescript
// src/api/example.ts
import { request } from "@/utils/request";
import type { HttpResponse } from "@/types/request.type";

export const getExampleApi = () => {
  return request.get<undefined, ResponseType>("/endpoint");
};
```

### Type Definitions

- Place shared types in `src/types/` with `.type.ts` suffix
- Use enums for fixed values (e.g., `MenuType`)
- Export interfaces for API request/response data

### State Management

- Use Pinia with Composition API style
- Store files use `.store.ts` suffix
- Async actions should handle loading states

### Routing

- Static routes defined in `src/router/index.ts`
- Dynamic routes loaded from `/menu/active` API
- Route meta fields: `requiresAuth`, `id`, `title`, `icon`, `permission_code`, `parentId`

## Testing

Currently, this project does not have automated tests configured. Testing strategy to be implemented.

## Environment Configuration

Create `.env.local` for local overrides:

```bash
# API base URL (default: '/api')
VITE_BASE_URL='/api'
```

Vite dev server proxies `/api` to `http://localhost:3000`.

## Authentication Flow

1. User submits login form with username, password, captcha
2. On success, `access_token` stored in `localStorage`
3. Dynamic routes loaded from `/menu/active` API
4. Token refresh handled automatically on 401 with code 10001
5. Token cleared and redirect to login on 401 with code 20001

## Security Considerations

- JWT tokens stored in localStorage (consider httpOnly cookies for production)
- Captcha verification on login
- Route-level authentication guards
- API requests include Bearer token authorization header
- Permission codes supported but not fully implemented in UI

## Node.js Requirements

- Node.js: `^20.19.0 || >=22.12.0`
- Package Manager: pnpm (recommended)
- JWT tokens stored in localStorage (consider httpOnly cookies for production)
- Captcha verification on login
- Route-level authentication guards
- API requests include Bearer token authorization header
- Permission codes supported but not fully implemented in UI

## Node.js Requirements

- Node.js: `^20.19.0 || >=22.12.0`
- Package Manager: pnpm (recommended)
