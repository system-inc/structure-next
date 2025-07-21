// Dependencies - Plugins
import EsLintPluginReact from 'eslint-plugin-react';
import EsLintPluginReactHooks from 'eslint-plugin-react-hooks';
import EsLintPluginNext from '@next/eslint-plugin-next';

// Dependencies - Structure ESLint Rules
import LocalStorageServiceRule from './rules/LocalStorageServiceRule.mjs';
import NetworkServiceRule from './rules/NetworkServiceRule.mjs';
import NoStructureProjectImportsRule from './rules/NoStructureProjectImportsRule.mjs';
import ReactDestructuringPropertiesRule from './rules/ReactDestructuringPropertiesRule.mjs';
import ReactExportRule from './rules/ReactExportRule.mjs';
import ReactFileOrganizationRule from './rules/ReactFileOrganizationRule.mjs';
import ReactFunctionStyleRule from './rules/ReactFunctionStyleRule.mjs';
import ReactImportRule from './rules/ReactImportRule.mjs';
import ReactNamingConventionsRule from './rules/ReactNamingConventionsRule.mjs';
import ReactNoArrowFunctionsAsHookParametersRule from './rules/ReactNoArrowFunctionsAsHookParametersRule.mjs';
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
    structure: {
        rules: {
            'local-storage-service-rule': LocalStorageServiceRule,
            'network-service-rule': NetworkServiceRule,
            'no-structure-project-imports-rule': NoStructureProjectImportsRule,
            'react-destructuring-properties-rule': ReactDestructuringPropertiesRule,
            'react-export-rule': ReactExportRule,
            'react-file-organization-rule': ReactFileOrganizationRule,
            'react-function-style-rule': ReactFunctionStyleRule,
            'react-import-rule': ReactImportRule,
            'react-naming-conventions-rule': ReactNamingConventionsRule,
            'react-no-arrow-functions-as-hook-parameters-rule': ReactNoArrowFunctionsAsHookParametersRule,
            'react-no-destructuring-react-rule': ReactNoDestructuringReactRule,
        },
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

    // Structure
    'no-empty': ['error', { allowEmptyCatch: true }],
    'structure/local-storage-service-rule': 'error',
    'structure/network-service-rule': 'error',
    'structure/no-structure-project-imports-rule': 'error',
    'structure/react-destructuring-properties-rule': 'error',
    'structure/react-export-rule': 'error',
    'structure/react-file-organization-rule': 'error',
    'structure/react-function-style-rule': 'error',
    'structure/react-import-rule': 'error',
    'structure/react-naming-conventions-rule': 'error',
    'structure/react-no-arrow-functions-as-hook-parameters-rule': 'error',
    'structure/react-no-destructuring-react-rule': 'error',
};
