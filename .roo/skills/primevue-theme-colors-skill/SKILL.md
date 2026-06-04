---
name: primevue-theme-colors-skill
description: "PrimeVue v4+ 采用三层 Design Tokens 架构管理主题颜色，支持在 Tailwind CSS 和普通 CSS 中无缝使用."
metadata:
  version: 4.5.5
  generated_at: 2026-04-09
  references_synced_at: 2026-04-09
---

# PrimeVue Theme Colors Skill

## 一、颜色体系架构

```
Primitive（原始色板） → Semantic（语义令牌） → Component（组件令牌）
     blue.500               primary.color          button.background
     surface.0              surface.card           inputtext.border
```

### 1.1 内置预设

PrimeVue 提供 4 种预设主题：**Aura**、**Material**、**Lara**、**Nora**

### 1.2 核心颜色类别

| 类别 | 色阶范围 | 语义令牌示例 |
|------|----------|--------------|
| **Primary** | `primary.50` ~ `primary.950` | `primary.color`, `primary.contrast` |
| **Surface** | `surface.0` ~ `surface.950` | `surface.ground`, `surface.card`, `surface.border` |
| **Text** | - | `text.color`, `text.color.emphasis`, `text.muted.color` |
| **Highlight** | - | `highlight.background`, `highlight.emphasis` |
| **Border** | - | `border.surface` |

---

## 二、配置主题颜色

### 2.1 基础配置（使用内置预设）

```javascript
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',                    // CSS 变量前缀
            darkModeSelector: 'system',     // 暗黑模式
            cssLayer: false
        }
    }
});
```

### 2.2 自定义预设（definePreset）

```javascript
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const MyPreset = definePreset(Aura, {
    primitive: {
        // 扩展原始色板
        ocean: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            500: '#0ea5e9',
            900: '#0c4a6e'
        }
    },
    semantic: {
        primary: {
            50: '{ocean.50}',
            100: '{ocean.100}',
            500: '{ocean.500}',
            900: '{ocean.900}'
        },
        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',
                    50: '#f8fafc',
                    100: '#f1f5f9'
                }
            },
            dark: {
                surface: {
                    0: '#0f172a',
                    50: '#1e293b',
                    100: '#334155'
                }
            }
        }
    }
});

app.use(PrimeVue, {
    theme: {
        preset: MyPreset
    }
});
```

> ⚠️ **注意**：如果原预设使用 `colorScheme` 定义令牌，自定义也必须保持相同结构，否则覆盖会失效。

### 2.3 动态更新主题颜色

```javascript
import { updatePrimaryPalette } from '@primeuix/themes';

// 运行时动态更新主色
updatePrimaryPalette({
    50: '#f0fdf4',
    500: '#22c55e',
    950: '#052e16'
});
```

---

## 三、在 Tailwind CSS 中使用

### 3.1 可用的 Tailwind 工具类

| 工具类 | 对应 CSS 变量 | 说明 |
|--------|---------------|------|
| `bg-primary` / `bg-primary-500` | `var(--p-primary-500)` | 主色背景 |
| `text-primary` / `text-primary-500` | `var(--p-primary-500)` | 主色文字 |
| `bg-surface-0` ~ `bg-surface-950` | `var(--p-surface-{n})` | 表面色阶 |
| `text-color` | `var(--p-text-color)` | 主文字色 |
| `text-color-emphasis` | `var(--p-text-color-emphasis)` | 强调文字色 |
| `text-muted-color` | `var(--p-text-muted-color)` | 次要文字色 |
| `border-surface` | `var(--p-border-surface)` | 边框表面色 |
| `bg-emphasis` | `var(--p-bg-emphasis)` | 强调背景（悬停态） |
| `bg-highlight` / `bg-highlight-emphasis` | `var(--p-highlight-background)` | 高亮背景 |
| `rounded-border` | `var(--p-border-radius)` | 主题圆角 |

### 3.4 使用示例

```html
<div class="flex gap-6">
    <!-- 主色按钮风格 -->
    <div class="bg-primary text-primary-contrast p-4 rounded-border">
        Primary Button Style
    </div>

    <!-- 表面卡片 -->
    <div class="bg-surface-100 text-color border border-surface p-4">
        Surface Card
    </div>

    <!-- 次要文字（悬停变强调） -->
    <div class="text-muted-color hover:text-color-emphasis">
        Muted Text
    </div>
</div>
```

### 3.5 暗黑模式同步

```javascript
// PrimeVue 配置
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.my-app-dark'
        }
    }
});
```

---

## 四、在普通 CSS 中使用

### 4.1 直接使用 CSS 变量

默认前缀为 `p`，格式为 `--p-{token-path}`：

```css
.my-custom-card {
    background-color: var(--p-surface-0);
    border: 1px solid var(--p-surface-200);
    color: var(--p-text-color);
    border-radius: var(--p-border-radius);
}

.my-custom-button {
    background-color: var(--p-primary-color);
    color: var(--p-primary-contrast-color);
}

/* 使用具体色阶 */
.my-badge {
    background-color: var(--p-primary-100);
    color: var(--p-primary-700);
}
```

### 4.2 生成调色板

```javascript
import { palette } from '@primeuix/themes';

// 从自定义色生成 50-950 色阶
const myColorScale = palette('#10b981');
// 返回 { 50: '#...', 100: '#...', ..., 950: '#...' }

// 复制现有令牌色板
const blueScale = palette('{blue}');
```

---

## 五、快速参考速查表

### 5.1 CSS 变量命名规则

| 令牌路径 | CSS 变量 |
|----------|----------|
| `primary.color` | `--p-primary-color` |
| `primary.500` | `--p-primary-500` |
| `surface.0` | `--p-surface-0` |
| `text.color` | `--p-text-color` |
| `text.muted.color` | `--p-text-muted-color` |
| `highlight.background` | `--p-highlight-background` |
| `border.radius` | `--p-border-radius` |

### 5.2 场景速查

| 场景 | 推荐方式 |
|------|----------|
| 全局主题定制 | `definePreset` 创建自定义预设 |
| Tailwind 项目 | 安装 `tailwindcss-primeui`，使用工具类 |
| 普通 CSS/SCSS | 直接使用 `var(--p-primary-color)` |
| 动态换肤 | `updatePrimaryPalette` + CSS 变量 |
| 添加扩展色（如 secondary） | `primitive` 定义 + `semantic` 映射 + Tailwind config 扩展 |

---

## 六、完整示例：自定义主题 + Tailwind

```javascript
// main.js
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const CustomPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            500: '#3b82f6',
            600: '#2563eb',
            900: '#1e3a8a'
        }
    }
});

app.use(PrimeVue, {
    theme: {
        preset: CustomPreset,
        options: {
            darkModeSelector: '.dark'
        }
    }
});
```

```css
/* style.css - Tailwind v4 */
@import "tailwindcss";
@import "tailwindcss-primeui";
@custom-variant dark (&:where(.dark, .dark *));
```

```html
<!-- 组件中使用 -->
<template>
    <div class="bg-surface-0 dark:bg-surface-900">
        <button class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-border">
            提交
        </button>
        <p class="text-muted-color mt-2">
            提示信息
        </p>
    </div>
</template>
```

---

> 通过 Design Tokens 架构，PrimeVue 实现了样式与组件的完全解耦，无论在 Tailwind 还是纯 CSS 环境中都能保持颜色一致性。
