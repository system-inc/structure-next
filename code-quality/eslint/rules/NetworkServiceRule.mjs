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
        },
        schema: [],
    },
    create(context) {
        return {
            // Check for direct fetch calls
            CallExpression(node) {
                // Check if it's a fetch call
                if (node.callee.type === 'Identifier' && node.callee.name === 'fetch') {
                    // Allow fetch in NetworkService.ts itself
                    const filename = context.getFilename();
                    if (filename.includes('NetworkService.ts')) {
                        return;
                    }

                    context.report({
                        node,
                        messageId: 'noDirectFetch',
                    });
                }

                // Check for window.fetch
                if (
                    node.callee.type === 'MemberExpression' &&
                    node.callee.object.name === 'window' &&
                    node.callee.property.name === 'fetch'
                ) {
                    const filename = context.getFilename();
                    if (filename.includes('NetworkService.ts')) {
                        return;
                    }

                    context.report({
                        node,
                        messageId: 'noDirectFetch',
                    });
                }

                // Check for globalThis.fetch
                if (
                    node.callee.type === 'MemberExpression' &&
                    node.callee.object.name === 'globalThis' &&
                    node.callee.property.name === 'fetch'
                ) {
                    const filename = context.getFilename();
                    if (filename.includes('NetworkService.ts')) {
                        return;
                    }

                    context.report({
                        node,
                        messageId: 'noDirectFetch',
                    });
                }

            },

            // Check for prohibited imports
            ImportDeclaration(node) {
                const source = node.source.value;

                // Block direct TanStack Query imports
                if (source === '@tanstack/react-query') {
                    // Allow in NetworkService.ts and Providers.tsx
                    const filename = context.getFilename();
                    if (filename.includes('NetworkService.ts') || filename.includes('Providers.tsx')) {
                        return;
                    }

                    context.report({
                        node,
                        messageId: 'noDirectTanStackQuery',
                    });
                }

                // Block Apollo Client imports
                if (source === '@apollo/client' || source.startsWith('@apollo/')) {
                    context.report({
                        node,
                        messageId: 'noDirectApollo',
                    });
                }

            },
        };
    },
};