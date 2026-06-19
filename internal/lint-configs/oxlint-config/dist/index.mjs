import { defineConfig as defineConfig$1 } from "oxlint";
import { fileURLToPath } from "node:url";
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import { getDefaultSelectors } from "eslint-plugin-better-tailwindcss/defaults";
import { SelectorKind } from "eslint-plugin-better-tailwindcss/types";
//#region src/configs/command.ts
const command = {
	jsPlugins: [{
		name: "command",
		specifier: "eslint-plugin-command"
	}],
	rules: { "command/command": "error" }
};
//#endregion
//#region src/configs/comments.ts
const comments = {
	jsPlugins: [{
		name: "eslint-comments",
		specifier: "@eslint-community/eslint-plugin-eslint-comments"
	}],
	rules: {
		"eslint/no-underscore-dangle": "off",
		"eslint-comments/no-aggregating-enable": "error",
		"eslint-comments/no-duplicate-disable": "error",
		"eslint-comments/no-unlimited-disable": "error",
		"eslint-comments/no-unused-enable": "error"
	}
};
//#endregion
//#region src/configs/ignores.ts
const ignores = { ignorePatterns: [
	"**/dist/**",
	"**/node_modules/**",
	"docs/**",
	"playground/public/**",
	"**/*.json",
	"**/*.md",
	"**/*.svg",
	"**/*.yaml",
	"**/*.yml"
] };
//#endregion
//#region src/configs/import.ts
const importPluginConfig = { rules: {
	"import/consistent-type-specifier-style": ["error", "prefer-top-level"],
	"import/first": "error",
	"import/no-duplicates": "error",
	"import/no-mutable-exports": "error",
	"import/no-named-as-default": "off",
	"import/no-named-as-default-member": "off",
	"import/no-named-default": "error",
	"import/no-self-import": "error",
	"import/no-unassigned-import": "off",
	"import/no-webpack-loader-syntax": "error"
} };
//#endregion
//#region src/configs/javascript.ts
const javascript = {
	categories: {
		correctness: "error",
		suspicious: "warn"
	},
	env: {
		browser: true,
		es2021: true,
		node: true
	},
	globals: {
		document: "readonly",
		navigator: "readonly",
		window: "readonly"
	},
	rules: {
		"accessor-pairs": ["error", {
			enforceForClassMembers: true,
			setWithoutGet: true
		}],
		"array-callback-return": "error",
		"block-scoped-var": "error",
		"default-case-last": "error",
		eqeqeq: ["error", "always"],
		"eslint/no-unreachable": "error",
		"new-cap": ["error", {
			capIsNew: false,
			newIsCap: true,
			properties: true
		}],
		"no-alert": "error",
		"no-array-constructor": "error",
		"no-caller": "error",
		"no-case-declarations": "error",
		"no-console": ["error", { allow: ["warn", "error"] }],
		"no-control-regex": "off",
		"no-debugger": "error",
		"no-empty": ["error", { allowEmptyCatch: true }],
		"no-fallthrough": "error",
		"no-new-func": "error",
		"no-object-constructor": "error",
		"no-new-native-nonconstructor": "error",
		"no-labels": ["error", {
			allowLoop: false,
			allowSwitch: false
		}],
		"no-lone-blocks": "error",
		"no-multi-str": "error",
		"no-nonoctal-decimal-escape": "error",
		"no-proto": "error",
		"no-prototype-builtins": "error",
		"no-redeclare": ["error", { builtinGlobals: false }],
		"no-regex-spaces": "error",
		"no-self-compare": "error",
		"no-sequences": "error",
		"no-shadow": "off",
		"no-shadow-restricted-names": "error",
		"eslint/no-empty-function": ["error", { allow: [
			"arrowFunctions",
			"functions",
			"methods"
		] }],
		"no-template-curly-in-string": "error",
		"no-throw-literal": "error",
		"no-unused-expressions": ["error", {
			allowShortCircuit: true,
			allowTaggedTemplates: true,
			allowTernary: true
		}],
		"eslint/no-unused-vars": ["error", {
			argsIgnorePattern: "^_",
			varsIgnorePattern: "^_"
		}],
		"no-var": "error",
		"no-eval": "error",
		"no-iterator": "error",
		"no-new-wrappers": "error",
		"no-restricted-globals": [
			"error",
			{
				message: "Use `globalThis` instead.",
				name: "global"
			},
			{
				message: "Use `globalThis` instead.",
				name: "self"
			}
		],
		"no-useless-call": "error",
		"no-useless-computed-key": "error",
		"no-useless-constructor": "error",
		"no-useless-return": "error",
		"prefer-const": ["error", {
			destructuring: "all",
			ignoreReadBeforeAssign: true
		}],
		"prefer-exponentiation-operator": "error",
		"prefer-promise-reject-errors": "error",
		"prefer-rest-params": "error",
		"prefer-spread": "error",
		"prefer-template": "error",
		"symbol-description": "error",
		"unicode-bom": ["error", "never"],
		"use-isnan": ["error", {
			enforceForIndexOf: true,
			enforceForSwitchCase: true
		}],
		"valid-typeof": ["error", { requireStringLiterals: true }],
		"vars-on-top": "error",
		yoda: ["error", "never"]
	}
};
//#endregion
//#region src/configs/node.ts
const node = { rules: {
	"node/no-exports-assign": "error",
	"node/no-new-require": "error",
	"node/no-path-concat": "error"
} };
//#endregion
//#region src/configs/overrides.ts
const overrides = { overrides: [
	{
		files: ["*.d.ts", "**/*.d.ts"],
		rules: {
			"import/no-unassigned-import": "off",
			"typescript/triple-slash-reference": "off"
		}
	},
	{
		files: ["*.vue", "**/*.vue"],
		rules: {
			"typescript/no-empty-object-type": "off",
			"typescript/no-unsafe-function-type": "off"
		}
	},
	{
		files: [
			"**/__tests__/**/*.js",
			"**/__tests__/**/*.cjs",
			"**/__tests__/**/*.mjs",
			"**/__tests__/**/*.jsx",
			"**/__tests__/**/*.ts",
			"**/__tests__/**/*.cts",
			"**/__tests__/**/*.mts",
			"**/__tests__/**/*.tsx",
			"**/*.spec.js",
			"**/*.spec.cjs",
			"**/*.spec.mjs",
			"**/*.spec.jsx",
			"**/*.spec.ts",
			"**/*.spec.cts",
			"**/*.spec.mts",
			"**/*.spec.tsx",
			"**/*.test.js",
			"**/*.test.cjs",
			"**/*.test.mjs",
			"**/*.test.jsx",
			"**/*.test.ts",
			"**/*.test.cts",
			"**/*.test.mts",
			"**/*.test.tsx",
			"**/*.bench.js",
			"**/*.bench.cjs",
			"**/*.bench.mjs",
			"**/*.bench.jsx",
			"**/*.bench.ts",
			"**/*.bench.cts",
			"**/*.bench.mts",
			"**/*.bench.tsx",
			"**/*.benchmark.js",
			"**/*.benchmark.cjs",
			"**/*.benchmark.mjs",
			"**/*.benchmark.jsx",
			"**/*.benchmark.ts",
			"**/*.benchmark.cts",
			"**/*.benchmark.mts",
			"**/*.benchmark.tsx"
		],
		rules: { "no-console": "off" }
	},
	{
		files: ["packages/@core/base/shared/src/utils/inference.ts"],
		rules: { "vue/prefer-import-from-vue": "off" }
	},
	{
		files: ["packages/@core/ui-kit/menu-ui/src/sub-menu.vue"],
		rules: { "import/no-self-import": "off" }
	},
	{
		files: [
			"scripts/**/*.js",
			"scripts/**/*.cjs",
			"scripts/**/*.mjs",
			"scripts/**/*.jsx",
			"scripts/**/*.ts",
			"scripts/**/*.cts",
			"scripts/**/*.mts",
			"scripts/**/*.tsx",
			"internal/**/*.js",
			"internal/**/*.cjs",
			"internal/**/*.mjs",
			"internal/**/*.jsx",
			"internal/**/*.ts",
			"internal/**/*.cts",
			"internal/**/*.mts",
			"internal/**/*.tsx"
		],
		rules: {
			"no-console": "off",
			"unicorn/no-process-exit": "off"
		}
	}
] };
//#endregion
//#region src/configs/plugins.ts
const plugins = { 
/**
* oxlint 支持的插件，将默认开启的也显示配置
* type: eslint | react | unicorn | typescript | oxc |
* import | jsdoc | jest | vitest | jsx-a11y | nextjs |
* react-perf | promise | node | vue
*
* Default: eslint,typescript,unicorn,oxc
*/
plugins: [
	"eslint",
	"import",
	"node",
	"oxc",
	"typescript",
	"unicorn",
	"vitest",
	"vue"
] };
//#endregion
//#region src/configs/tailwindcss.ts
const selectors = [...getDefaultSelectors(), {
	kind: SelectorKind.Attribute,
	match: [{ type: "objectValues" }],
	name: "^classNames$"
}];
const settings = {
	entryPoint: fileURLToPath(new URL("../../../../tailwind-config/src/theme.css", import.meta.url)),
	selectors
};
const tailwindcss = {
	ignorePatterns: ["packages/@core/ui-kit/shadcn-ui/**/*"],
	jsPlugins: [{
		name: "better-tailwindcss",
		specifier: "eslint-plugin-better-tailwindcss"
	}],
	rules: {
		...eslintPluginBetterTailwindcss.configs.recommended.rules,
		"better-tailwindcss/enforce-consistent-class-order": ["error", {
			detectComponentClasses: true,
			unknownClassOrder: "asc",
			unknownClassPosition: "start"
		}],
		"better-tailwindcss/enforce-consistent-line-wrapping": "off",
		"better-tailwindcss/no-unknown-classes": "off"
	},
	settings: {
		"better-tailwindcss": settings,
		"eslint-plugin-better-tailwindcss": settings
	}
};
//#endregion
//#region src/configs/test.ts
const test = { rules: {
	"jest/no-conditional-expect": "off",
	"jest/require-to-throw-message": "off",
	"vitest/consistent-test-it": ["error", {
		fn: "it",
		withinDescribe: "it"
	}],
	"vitest/hoisted-apis-on-top": "off",
	"vitest/no-focused-tests": "error",
	"vitest/no-identical-title": "error",
	"vitest/no-import-node-test": "error",
	"vitest/prefer-hooks-in-order": "error",
	"vitest/prefer-lowercase-title": "error",
	"vitest/require-mock-type-parameters": "off"
} };
//#endregion
//#region src/configs/typescript.ts
const typescript = { rules: {
	"typescript/ban-ts-comment": "error",
	"typescript/no-duplicate-enum-values": "error",
	"typescript/no-dynamic-delete": "error",
	"typescript/no-empty-object-type": "error",
	"typescript/no-extra-non-null-assertion": "error",
	"typescript/no-extraneous-class": "error",
	"typescript/no-invalid-void-type": "error",
	"typescript/no-misused-new": "error",
	"typescript/no-non-null-asserted-nullish-coalescing": "error",
	"typescript/no-non-null-asserted-optional-chain": "error",
	"typescript/no-non-null-assertion": "error",
	"typescript/no-require-imports": "error",
	"typescript/no-this-alias": "error",
	"typescript/no-unnecessary-type-constraint": "error",
	"typescript/no-unsafe-declaration-merging": "error",
	"typescript/no-unsafe-function-type": "error",
	"typescript/no-var-requires": "error",
	"typescript/no-wrapper-object-types": "error",
	"typescript/prefer-as-const": "error",
	"typescript/prefer-literal-enum-member": "error",
	"typescript/prefer-namespace-keyword": "error",
	"typescript/triple-slash-reference": "error",
	"typescript/unified-signatures": "error",
	"typescript/await-thenable": "off",
	"typescript/consistent-return": "off",
	"typescript/no-base-to-string": "off",
	"typescript/no-duplicate-type-constituents": "off",
	"typescript/no-floating-promises": "off",
	"typescript/no-misused-spread": "off",
	"typescript/no-redundant-type-constituents": "off",
	"typescript/no-unnecessary-boolean-literal-compare": "off",
	"typescript/no-unnecessary-template-expression": "off",
	"typescript/no-unnecessary-type-arguments": "off",
	"typescript/no-unnecessary-type-assertion": "off",
	"typescript/no-unnecessary-type-conversion": "off",
	"typescript/no-unnecessary-type-parameters": "off",
	"typescript/no-unsafe-enum-comparison": "off",
	"typescript/no-unsafe-type-assertion": "off",
	"typescript/no-useless-default-assignment": "off",
	"typescript/restrict-template-expressions": "off",
	"typescript/unbound-method": "off"
} };
//#endregion
//#region src/configs/unicorn.ts
const unicorn = { rules: {
	"unicorn/consistent-function-scoping": "off",
	"unicorn/no-process-exit": "error",
	"unicorn/no-single-promise-in-promise-methods": "off",
	"unicorn/no-useless-spread": "off",
	"unicorn/prefer-global-this": "off",
	"unicorn/prefer-module": "error",
	"unicorn/catch-error-name": "error",
	"unicorn/consistent-assert": "error",
	"unicorn/consistent-date-clone": "error",
	"unicorn/consistent-empty-array-spread": "error",
	"unicorn/consistent-existence-index-check": "error",
	"unicorn/consistent-template-literal-escape": "error",
	"unicorn/empty-brace-spaces": "error",
	"unicorn/error-message": "error",
	"unicorn/escape-case": "error",
	"unicorn/explicit-length-check": "error",
	"unicorn/new-for-builtins": "error",
	"unicorn/no-abusive-eslint-disable": "error",
	"unicorn/no-accessor-recursion": "error",
	"unicorn/no-anonymous-default-export": "error",
	"unicorn/no-array-callback-reference": "error",
	"unicorn/no-array-method-this-argument": "error",
	"unicorn/no-array-reduce": "error",
	"unicorn/no-array-reverse": "error",
	"unicorn/no-array-sort": "error",
	"unicorn/no-await-expression-member": "error",
	"unicorn/no-await-in-promise-methods": "error",
	"unicorn/no-console-spaces": "error",
	"unicorn/no-document-cookie": "error",
	"unicorn/no-empty-file": "error",
	"unicorn/no-hex-escape": "error",
	"unicorn/no-immediate-mutation": "off",
	"unicorn/no-instanceof-builtins": "error",
	"unicorn/no-invalid-fetch-options": "error",
	"unicorn/no-invalid-remove-event-listener": "error",
	"unicorn/no-lonely-if": "error",
	"unicorn/no-magic-array-flat-depth": "error",
	"unicorn/no-negated-condition": "error",
	"unicorn/no-negation-in-equality-check": "error",
	"unicorn/no-nested-ternary": "error",
	"unicorn/no-new-array": "error",
	"unicorn/no-new-buffer": "error",
	"unicorn/no-object-as-default-parameter": "error",
	"unicorn/no-static-only-class": "error",
	"unicorn/no-thenable": "error",
	"unicorn/no-this-assignment": "error",
	"unicorn/no-typeof-undefined": "error",
	"unicorn/no-unnecessary-array-flat-depth": "error",
	"unicorn/no-unnecessary-array-splice-count": "error",
	"unicorn/no-unnecessary-await": "error",
	"unicorn/no-unnecessary-slice-end": "error",
	"unicorn/no-unreadable-array-destructuring": "error",
	"unicorn/no-unreadable-iife": "error",
	"unicorn/no-useless-collection-argument": "error",
	"unicorn/no-useless-error-capture-stack-trace": "error",
	"unicorn/no-useless-fallback-in-spread": "error",
	"unicorn/no-useless-iterator-to-array": "error",
	"unicorn/no-useless-length-check": "error",
	"unicorn/no-useless-promise-resolve-reject": "error",
	"unicorn/no-useless-switch-case": "error",
	"unicorn/no-zero-fractions": "error",
	"unicorn/number-literal-case": "error",
	"unicorn/numeric-separators-style": "error",
	"unicorn/prefer-add-event-listener": "error",
	"unicorn/prefer-array-find": "error",
	"unicorn/prefer-array-flat": "error",
	"unicorn/prefer-array-flat-map": "error",
	"unicorn/prefer-array-index-of": "error",
	"unicorn/prefer-array-some": "error",
	"unicorn/prefer-bigint-literals": "error",
	"unicorn/prefer-blob-reading-methods": "error",
	"unicorn/prefer-class-fields": "error",
	"unicorn/prefer-classlist-toggle": "error",
	"unicorn/prefer-code-point": "error",
	"unicorn/prefer-date-now": "error",
	"unicorn/prefer-default-parameters": "error",
	"unicorn/prefer-dom-node-append": "error",
	"unicorn/prefer-dom-node-dataset": "error",
	"unicorn/prefer-dom-node-remove": "error",
	"unicorn/prefer-event-target": "error",
	"unicorn/prefer-export-from": ["error", { checkUsedVariables: false }],
	"unicorn/prefer-includes": "error",
	"unicorn/prefer-keyboard-event-key": "error",
	"unicorn/prefer-logical-operator-over-ternary": "error",
	"unicorn/prefer-math-min-max": "error",
	"unicorn/prefer-math-trunc": "error",
	"unicorn/prefer-modern-dom-apis": "error",
	"unicorn/prefer-modern-math-apis": "error",
	"unicorn/prefer-native-coercion-functions": "error",
	"unicorn/prefer-negative-index": "error",
	"unicorn/prefer-node-protocol": "error",
	"unicorn/prefer-number-properties": "error",
	"unicorn/prefer-object-from-entries": "error",
	"unicorn/prefer-optional-catch-binding": "error",
	"unicorn/prefer-prototype-methods": "error",
	"unicorn/prefer-query-selector": "error",
	"unicorn/prefer-reflect-apply": "error",
	"unicorn/prefer-regexp-test": "error",
	"unicorn/prefer-response-static-json": "error",
	"unicorn/prefer-set-has": "error",
	"unicorn/prefer-set-size": "error",
	"unicorn/prefer-single-call": "error",
	"unicorn/prefer-spread": "error",
	"unicorn/prefer-string-raw": "error",
	"unicorn/prefer-string-replace-all": "error",
	"unicorn/prefer-string-slice": "error",
	"unicorn/prefer-string-starts-ends-with": "error",
	"unicorn/prefer-string-trim-start-end": "error",
	"unicorn/prefer-structured-clone": "off",
	"unicorn/prefer-ternary": "error",
	"unicorn/prefer-type-error": "error",
	"unicorn/relative-url-style": "error",
	"unicorn/require-array-join-separator": "error",
	"unicorn/require-module-attributes": "error",
	"unicorn/require-module-specifiers": "error",
	"unicorn/require-number-to-fixed-digits-argument": "error",
	"unicorn/switch-case-braces": "error",
	"unicorn/switch-case-break-position": "error",
	"unicorn/text-encoding-identifier-case": "error",
	"unicorn/throw-new-error": "error"
} };
//#endregion
//#region src/configs/vue.ts
const vue = { rules: { "vue/prefer-import-from-vue": "error" } };
//#endregion
//#region src/configs/index.ts
function mergeOxlintConfigs(...configs) {
	const merged = {};
	for (const config of configs) {
		merged.categories = merged.categories && config.categories ? {
			...merged.categories,
			...config.categories
		} : config.categories ?? merged.categories;
		merged.env = merged.env && config.env ? {
			...merged.env,
			...config.env
		} : config.env ?? merged.env;
		merged.globals = merged.globals && config.globals ? {
			...merged.globals,
			...config.globals
		} : config.globals ?? merged.globals;
		merged.ignorePatterns = [...merged.ignorePatterns ?? [], ...config.ignorePatterns ?? []];
		merged.jsPlugins = [...new Set([...merged.jsPlugins ?? [], ...config.jsPlugins ?? []])];
		merged.overrides = [...merged.overrides ?? [], ...config.overrides ?? []];
		merged.plugins = [...new Set([...merged.plugins ?? [], ...config.plugins ?? []])];
		merged.rules = merged.rules && config.rules ? {
			...merged.rules,
			...config.rules
		} : config.rules ?? merged.rules;
		merged.settings = merged.settings && config.settings ? {
			...merged.settings,
			...config.settings
		} : config.settings ?? merged.settings;
	}
	return merged;
}
const oxlintConfig = defineConfig$1(mergeOxlintConfigs(javascript, command, comments, ignores, plugins, importPluginConfig, node, overrides, tailwindcss, test, typescript, unicorn, vue));
//#endregion
//#region src/index.ts
function defineConfig(config = {}) {
	const { extends: extendedConfigs = [], ...restConfig } = config;
	return defineConfig$1(mergeOxlintConfigs(oxlintConfig, ...extendedConfigs, restConfig));
}
//#endregion
export { command, comments, defineConfig, ignores, importPluginConfig, javascript, mergeOxlintConfigs, node, overrides, oxlintConfig, plugins, tailwindcss, test, typescript, unicorn, vue };
