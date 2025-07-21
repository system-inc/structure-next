// ESLint rule to disallow direct localStorage usage and require LocalStorageService instead
const NoDirectLocalStorageRule = {
    meta: {
        type: 'problem',
        docs: {
            description:
                'Disallow direct localStorage usage and require LocalStorageService instead for better abstraction and error handling.',
            category: 'Best Practices',
            recommended: true,
        },
        messages: {
            directLocalStorage:
                "Direct localStorage usage is not allowed. Use localStorageService from '@structure/source/services/local-storage/LocalStorageService' instead.",
            windowLocalStorage:
                "Direct window.localStorage usage is not allowed. Use localStorageService from '@structure/source/services/local-storage/LocalStorageService' instead.",
        },
        fixable: null, // No auto-fix since it requires importing and using a different API
    },
    create(context) {
        const filename = context.getFilename();

        // Normalize file path to always use forward slashes
        const normalizedPath = filename.replace(/\\/g, '/');

        // Allow direct localStorage usage only in the LocalStorageService implementation itself
        const isLocalStorageService =
            normalizedPath.includes('/services/local-storage/LocalStorageService.ts') ||
            normalizedPath.includes('/services/local-storage/internal/LocalStorageServiceUtilities.ts');

        if(isLocalStorageService) {
            return {};
        }

        return {
            // Check for localStorage.method() calls
            MemberExpression(node) {
                // Check for localStorage.setItem, localStorage.getItem, etc.
                if(node.object.type === 'Identifier' && node.object.name === 'localStorage') {
                    context.report({
                        node: node.object,
                        messageId: 'directLocalStorage',
                    });
                }
                // Check for window.localStorage.method() calls
                else if(
                    node.object.type === 'MemberExpression' &&
                    node.object.object.type === 'Identifier' &&
                    node.object.object.name === 'window' &&
                    node.object.property.type === 'Identifier' &&
                    node.object.property.name === 'localStorage'
                ) {
                    context.report({
                        node: node.object,
                        messageId: 'windowLocalStorage',
                    });
                }
            },

            // Check for localStorage as a standalone identifier (e.g., const storage = localStorage)
            Identifier(node) {
                // Only check if it's being used as a value (not a property name)
                if(node.name === 'localStorage' && node.parent.type !== 'MemberExpression') {
                    // Skip if it's the property of a member expression (we handle that above)
                    if(
                        node.parent.type === 'MemberExpression' &&
                        node.parent.property === node &&
                        !node.parent.computed
                    ) {
                        return;
                    }

                    // Skip if it's a property in an object literal
                    if(node.parent.type === 'Property' && node.parent.key === node && !node.parent.computed) {
                        return;
                    }

                    context.report({
                        node,
                        messageId: 'directLocalStorage',
                    });
                }
            },
        };
    },
};

// Export - Default
export default NoDirectLocalStorageRule;
