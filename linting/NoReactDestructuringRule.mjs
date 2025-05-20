// ESLint rule to prevent destructuring React and enforce React.useState, React.useEffect, etc.
// This ensures that all React hook calls are prefixed with React.
const NoReactDestructuringRule = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Prevent destructuring React and enforce React.useX pattern',
            category: 'Best Practices',
            recommended: true,
        },
        fixable: null,
        schema: [],
    },
    create(context) {
        // Track imported hooks from React
        const importedReactHooks = new Set();

        return {
            // Check import declarations
            ImportDeclaration(node) {
                // Only check imports from 'react'
                if(node.source.value !== 'react') {
                    return;
                }

                // Check if React is imported as default (correct way)
                const hasDefaultImport = node.specifiers.some(spec =>
                    spec.type === 'ImportDefaultSpecifier' && spec.local.name === 'React'
                );

                // Check if any named imports from React (hooks)
                const namedImports = node.specifiers.filter(spec => spec.type === 'ImportSpecifier');

                // Track any React hooks that were imported with destructuring
                namedImports.forEach(specifier => {
                    const hookName = specifier.imported.name;
                    // Only track if the name starts with 'use' (likely a hook)
                    if(hookName.startsWith('use')) {
                        importedReactHooks.add(specifier.local.name);

                        // Report the destructured hook import
                        context.report({
                            node: specifier,
                            message: `Don't import React hooks directly. Use React.${hookName} instead.`,
                        });
                    }
                });

                // If there are named imports but no default, report a problem
                if(namedImports.length > 0 && !hasDefaultImport) {
                    context.report({
                        node,
                        message: "Don't destructure from React. Import React as default and use React.useX hooks.",
                    });
                }
            },

            // Check for direct hook calls without React prefix
            CallExpression(node) {
                // Only check function calls
                if(node.callee.type !== 'Identifier') {
                    return;
                }

                const calleeName = node.callee.name;

                // If this is one of the tracked destructured hooks, report it
                if(importedReactHooks.has(calleeName)) {
                    context.report({
                        node,
                        message: `Use React.${calleeName} instead of direct hook call.`,
                    });
                }

                // We only enforce rules for hooks imported directly from React
                // Hooks from other libraries like @react-spring/web are fine
            }
        };
    }
};

export default NoReactDestructuringRule;