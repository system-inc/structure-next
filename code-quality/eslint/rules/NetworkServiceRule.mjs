// Network Service Rule
// This rule enforces that all network requests go through NetworkService

export default {
    meta: {
        type: 'problem',
        docs: {
            description: 'Enforce using NetworkService for all network operations',
            category: 'Best Practices',
            recommended: true,
        },
        messages: {
            noDirectFetch: 'Direct fetch() calls are not allowed. Use NetworkService instead for all network requests.',
            noDirectTanStackQuery: 'Direct imports from @tanstack/react-query are not allowed. Use NetworkService instead.',
            noDirectApollo: 'Direct imports from @apollo/client are not allowed. Use NetworkService instead.',
            noDirectGraphqlImport: 'Direct imports of graphql from generated paths are not allowed. Import gql from NetworkService instead.',
            noStringLiteralInvalidateCache: 'invalidateCache must use an imported cache key variable instead of a string literal. This prevents typos and makes cache keys easier to refactor. Export the cache key from where the cache is created.',
            noTemplateLiteralInvalidateCache: 'invalidateCache must use an imported cache key variable instead of a template literal. This prevents typos and makes cache keys easier to refactor. Export the cache key from where the cache is created.',
            noArrayWithStringLiteralInvalidateCache: 'invalidateCache array arguments must use imported cache key variables instead of string literals. This prevents typos and makes cache keys easier to refactor.',
        },
        schema: [],
    },
    create(context) {
        return {
            // Check for direct fetch calls
            CallExpression(node) {
                // Check if it's a fetch call
                if(node.callee.type === 'Identifier' && node.callee.name === 'fetch') {
                    // Allow fetch in NetworkService.ts itself
                    const filename = context.getFilename();
                    if(filename.includes('NetworkService.ts')) {
                        return;
                    }

                    context.report({
                        node,
                        messageId: 'noDirectFetch',
                    });
                }

                // Check for window.fetch
                if(
                    node.callee.type === 'MemberExpression' &&
                    node.callee.object.name === 'window' &&
                    node.callee.property.name === 'fetch'
                ) {
                    const filename = context.getFilename();
                    if(filename.includes('NetworkService.ts')) {
                        return;
                    }

                    context.report({
                        node,
                        messageId: 'noDirectFetch',
                    });
                }

                // Check for globalThis.fetch
                if(
                    node.callee.type === 'MemberExpression' &&
                    node.callee.object.name === 'globalThis' &&
                    node.callee.property.name === 'fetch'
                ) {
                    const filename = context.getFilename();
                    if(filename.includes('NetworkService.ts')) {
                        return;
                    }

                    context.report({
                        node,
                        messageId: 'noDirectFetch',
                    });
                }

                // Check for invalidateCache calls
                if(
                    node.callee.type === 'MemberExpression' &&
                    node.callee.property.type === 'Identifier' &&
                    node.callee.property.name === 'invalidateCache'
                ) {
                    // Check the first argument
                    const firstArg = node.arguments[0];

                    if(!firstArg) {
                        return;
                    }

                    // Check if it's a string literal
                    if(firstArg.type === 'Literal' && typeof firstArg.value === 'string') {
                        context.report({
                            node: firstArg,
                            messageId: 'noStringLiteralInvalidateCache',
                        });
                        return;
                    }

                    // Check if it's a template literal
                    if(firstArg.type === 'TemplateLiteral') {
                        context.report({
                            node: firstArg,
                            messageId: 'noTemplateLiteralInvalidateCache',
                        });
                        return;
                    }

                    // Check if it's an array with string literals
                    if(firstArg.type === 'ArrayExpression') {
                        firstArg.elements.forEach((element) => {
                            if(element && element.type === 'Literal' && typeof element.value === 'string') {
                                context.report({
                                    node: element,
                                    messageId: 'noArrayWithStringLiteralInvalidateCache',
                                });
                            }

                            // Also check for template literals in arrays
                            if(element && element.type === 'TemplateLiteral') {
                                context.report({
                                    node: element,
                                    messageId: 'noTemplateLiteralInvalidateCache',
                                });
                            }
                        });
                    }
                }

            },

            // Check for prohibited imports
            ImportDeclaration(node) {
                const source = node.source.value;

                // Block direct TanStack Query imports
                if(source === '@tanstack/react-query') {
                    // Allow in NetworkService.ts and Providers.tsx
                    const filename = context.getFilename();
                    if(filename.includes('NetworkService.ts') || filename.includes('Providers.tsx')) {
                        return;
                    }

                    context.report({
                        node,
                        messageId: 'noDirectTanStackQuery',
                    });
                }

                // Block Apollo Client imports
                if(source === '@apollo/client' || source.startsWith('@apollo/')) {
                    context.report({
                        node,
                        messageId: 'noDirectApollo',
                    });
                }

                // Block direct graphql imports from generated paths
                if(source.includes('/generated') && node.specifiers.some(spec =>
                    spec.type === 'ImportSpecifier' && spec.imported.name === 'graphql'
                )) {
                    context.report({
                        node,
                        messageId: 'noDirectGraphqlImport',
                    });
                }

            },
        };
    },
};