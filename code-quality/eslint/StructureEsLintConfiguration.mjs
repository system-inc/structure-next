// Dependencies - Plugins
import EsLintPluginReact from 'eslint-plugin-react';
import EsLintPluginReactHooks from 'eslint-plugin-react-hooks';
import EsLintPluginNext from '@next/eslint-plugin-next';
import EsLintPluginBetterTailwindCss from 'eslint-plugin-better-tailwindcss';

// Dependencies - Structure ESLint Rules
import CodeConsistencyRule from './rules/CodeConsistencyRule.mjs';
import LocalStorageServiceRule from './rules/LocalStorageServiceRule.mjs';
import NetworkServiceRule from './rules/NetworkServiceRule.mjs';
import NoStructureProjectImportsRule from './rules/NoStructureProjectImportsRule.mjs';
import ReactDestructuringRule from './rules/ReactDestructuringRule.mjs';
import ReactExportRule from './rules/ReactExportRule.mjs';
import ReactFileOrganizationRule from './rules/ReactFileOrganizationRule.mjs';
import ReactFunctionStyleRule from './rules/ReactFunctionStyleRule.mjs';
import ReactHookDependenciesRule from './rules/ReactHookDependenciesRule.mjs';
import ReactImportRule from './rules/ReactImportRule.mjs';
import ReactNamingConventionsRule from './rules/ReactNamingConventionsRule.mjs';
import ArrowFunctionStyleRule from './rules/ArrowFunctionStyleRule.mjs';
import ReactNoDestructuringReactRule from './rules/ReactNoDestructuringReactRule.mjs';

// ESLint Ignore patterns
export const structureIgnorePatterns = [
    // Node modules
    'node_modules',
    'package*.json',
    // Lock files & manifest
    'pnpm-lock.yaml',
    'yarn.lock',
    // Public folder
    'public/**',
    // Build artifacts
    '**/.next/**',
    '**/.open-next/**',
    '**/.worker-next/**',
    '**/.wrangler/**',
    '**/build/**',
    '**/dist/**',
    // *.code.js files
    '**/*.code.js',
    '.vscode/**',
];

// ESLint JavaScript configuration
export const structureJavaScriptConfiguration = {
    files: ['**/*.{mjs,js,jsx}'],
    languageOptions: {
        // Use the standard ESLint parser for JavaScript
        parserOptions: {
            sourceType: 'module',
            ecmaVersion: 2022,
            jsx: true, // Enable JSX parsing
        },
    },
    globals: {
        // Node.js globals
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
        console: 'readonly',
        global: 'readonly',
        Buffer: 'readonly',
    },
    linterOptions: {
        reportUnusedDisableDirectives: true,
    },
    rules: {
        // More permissive rules for JavaScript files
        'no-console': 'off', // Allow console logs
        'no-process-exit': 'off', // Allow process.exit()
        'no-sync': 'off', // Allow synchronous methods (often used in scripts)
    },
};

// ESLint TypeScript configuration
export const structureTypeScriptConfiguration = {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
        parserOptions: {
            project: './tsconfig.json', // Use root tsconfig.json
            tsconfigRootDir: process.cwd(), // Set root directory to project root
            sourceType: 'module',
        },
    },
    rules: {
        // TypeScript tweaks
        '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true }],
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-namespace': 'off', // Allow TypeScript namespaces
    },
};

// ESLint JavaScript and TypeScript globals
export const structureJavaScriptAndTypeScriptGlobals = {
    // React global
    React: 'writable', // Keep "React" writable for rules that still expect the old pragma

    // Browser globals
    document: 'readonly',
    window: 'readonly',
    navigator: 'readonly',
    setTimeout: 'readonly',
    clearTimeout: 'readonly',
    setInterval: 'readonly',
    clearInterval: 'readonly',
};

// ESLint JavaScript and TypeScript plugins
export const structureJavaScriptAndTypeScriptPlugins = {
    react: EsLintPluginReact,
    'react-hooks': EsLintPluginReactHooks,
    '@next/next': EsLintPluginNext,
    'better-tailwindcss': EsLintPluginBetterTailwindCss,
    structure: {
        rules: {
            'arrow-function-style-rule': ArrowFunctionStyleRule,
            'code-consistency-rule': CodeConsistencyRule,
            'local-storage-service-rule': LocalStorageServiceRule,
            'network-service-rule': NetworkServiceRule,
            'no-structure-project-imports-rule': NoStructureProjectImportsRule,
            'react-destructuring-rule': ReactDestructuringRule,
            'react-export-rule': ReactExportRule,
            'react-file-organization-rule': ReactFileOrganizationRule,
            'react-function-style-rule': ReactFunctionStyleRule,
            'react-hook-dependencies-rule': ReactHookDependenciesRule,
            'react-import-rule': ReactImportRule,
            'react-naming-conventions-rule': ReactNamingConventionsRule,
            'react-no-destructuring-react-rule': ReactNoDestructuringReactRule,
        },
    },
};

// ESLint JavaScript and TypeScript settings
export const structureJavaScriptAndTypeScriptSettings = {
    'better-tailwindcss': {
        entryPoint: './app/_theme/styles/theme.css',
        attributes: ['class', 'className'],
        callees: ['mergeClassNames', 'createVariantClassNames'],
        variables: ['.*[Cc]lassName$', '.*[Cc]lassNames$'],
    },
};

// ESLint JavaScript and TypeScript rules
export const structureJavaScriptAndTypeScriptRules = {
    // React
    ...EsLintPluginReact.configs['jsx-runtime'].rules,
    ...EsLintPluginReactHooks.configs.recommended.rules,

    // Next.js
    ...EsLintPluginNext.configs.recommended.rules,
    ...EsLintPluginNext.configs['core-web-vitals'].rules,

    // Tailwind - Recommended rules except line wrapping
    ...EsLintPluginBetterTailwindCss.configs.recommended.rules,
    'better-tailwindcss/enforce-consistent-line-wrapping': 'off', // Disable line wrapping enforcement

    // Structure
    'no-empty': ['error', { allowEmptyCatch: true }],
    'structure/arrow-function-style-rule': 'error',
    'structure/code-consistency-rule': 'error',
    'structure/local-storage-service-rule': 'error',
    'structure/network-service-rule': 'error',
    'structure/no-structure-project-imports-rule': 'error',
    'structure/react-destructuring-rule': 'error',
    'structure/react-export-rule': 'error',
    'structure/react-file-organization-rule': 'error',
    'structure/react-function-style-rule': 'error',
    'structure/react-hook-dependencies-rule': 'error',
    'structure/react-import-rule': 'error',
    'structure/react-naming-conventions-rule': 'error',
    'structure/react-no-destructuring-react-rule': 'error',
};

// ESLint Next.js exception configuration
export const structureNextJsExceptionConfiguration = {
    files: ['next-env.d.ts'],
    rules: {
        '@typescript-eslint/triple-slash-reference': 'off',
    },
};
