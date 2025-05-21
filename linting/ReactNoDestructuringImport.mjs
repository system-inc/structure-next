// ESLint rule to prevent destructuring React and enforce React.useState, React.useEffect, etc.
// This ensures that all React imports/exports are prefixed with React.
const ReactNoDestructuringImport = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Prevent destructuring React and enforce React.* pattern',
            category: 'Best Practices',
            recommended: true,
        },
        fixable: null,
        schema: [],
    },
    create(context) {
        // Track imported items from React
        const importedReactItems = new Set();

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

                // Check if any named imports from React
                const namedImports = node.specifiers.filter(spec => spec.type === 'ImportSpecifier');

                // Track and report any React items that were imported with destructuring
                namedImports.forEach(specifier => {
                    const importedName = specifier.imported.name;
                    const localName = specifier.local.name;

                    // Add to tracking set for later reference
                    importedReactItems.add(localName);

                    // Report the destructured import
                    context.report({
                        node: specifier,
                        message: `Don't import React items directly. Use React.${importedName} instead.`,
                    });
                });

                // If there are named imports but no default, report a problem
                if(namedImports.length > 0 && !hasDefaultImport) {
                    context.report({
                        node,
                        message: "Don't destructure from React. Import React as default and use React.* prefix.",
                    });
                }
            },

            // Check for direct hook calls without React prefix
            CallExpression(node) {
                // Only check function calls with simple identifiers
                if(node.callee.type !== 'Identifier') {
                    return;
                }

                const calleeName = node.callee.name;

                // If this is one of the tracked destructured items and it starts with 'use', report it
                if(importedReactItems.has(calleeName) && calleeName.startsWith('use')) {
                    context.report({
                        node,
                        message: `Use React.${calleeName} instead of direct hook call.`,
                    });
                }

                // We only enforce call rules for hooks (starting with 'use')
                // Other items like MouseEventHandler are types, not functions to be called
            },

            // Check for type references without React prefix
            TSTypeReference(node) {
                // Only check simple identifiers
                if(node.typeName.type !== 'Identifier') {
                    return;
                }

                const typeName = node.typeName.name;

                // If this is one of the tracked destructured items and it doesn't start with 'use', report it
                if(importedReactItems.has(typeName) && !typeName.startsWith('use')) {
                    context.report({
                        node,
                        message: `Use React.${typeName} instead of direct type reference.`,
                    });
                }
            }
        };
    }
};

export default ReactNoDestructuringImport;