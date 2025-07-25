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
        fixable: 'code',
        messages: {
            noDirectFetch: 'Direct fetch() calls are not allowed. Use NetworkService instead for all network requests.',
            noDirectTanStackQuery:
                'Direct imports from @tanstack/react-query are not allowed. Use NetworkService instead.',
            noDirectApollo: 'Direct imports from @apollo/client are not allowed. Use NetworkService instead.',
            noDirectGraphqlImport:
                'Direct imports of graphql from generated paths are not allowed. Import gql from NetworkService instead.',
            noStringLiteralInvalidateCache:
                'invalidateCache must use an imported cache key variable instead of a string literal. This prevents typos and makes cache keys easier to refactor. Export the cache key from where the cache is created.',
            noTemplateLiteralInvalidateCache:
                'invalidateCache must use an imported cache key variable instead of a template literal. This prevents typos and makes cache keys easier to refactor. Export the cache key from where the cache is created.',
            noArrayWithStringLiteralInvalidateCache:
                'invalidateCache array arguments must use imported cache key variables instead of string literals. This prevents typos and makes cache keys easier to refactor.',
            noStringLiteralGraphQlQuery:
                'GraphQL queries must use the gql function from NetworkService instead of string literals. Import gql from @structure/source/services/network/NetworkService and use gql(`query { ... }`)',
            incorrectProjectGraphQlImport:
                'Import GraphQL types from @project/app/_api/graphql/GraphQlGeneratedCode instead of @project/app/_api/graphql/generated/graphql',
            incorrectStructureGraphQlImport:
                'Import GraphQL types from @structure/source/api/graphql/GraphQlGeneratedCode instead of @structure/source/api/graphql/generated/graphql',
            incorrectProjectGqlImport:
                'Import GraphQL types from @project/app/_api/graphql/GraphQlGeneratedCode instead of @project/app/_api/graphql/generated/gql',
            incorrectStructureGqlImport:
                'Import GraphQL types from @structure/source/api/graphql/GraphQlGeneratedCode instead of @structure/source/api/graphql/generated/gql',
        },
        schema: [],
    },
    create(context) {
        // Helper function to get the filename safely
        function getFilename() {
            return context.filename || context.getFilename() || context.getPhysicalFilename() || '';
        }

        // Helper function to trace back to the source of a value
        function isStringLiteral(node, visited = new Set()) {
            if(!node) return false;

            // Prevent infinite recursion
            if(visited.has(node)) return false;
            visited.add(node);

            // Direct string literal or template literal
            if(node.type === 'Literal' && typeof node.value === 'string') return true;
            if(node.type === 'TemplateLiteral') return true;

            // TypeScript as expression - check the expression
            if(node.type === 'TSAsExpression' || node.type === 'TSTypeAssertion') {
                return isStringLiteral(node.expression, visited);
            }

            // Parenthesized expression
            if(node.type === 'ParenthesizedExpression') {
                return isStringLiteral(node.expression, visited);
            }

            // Identifier - need to trace back to its declaration
            if(node.type === 'Identifier') {
                const sourceCode = context.sourceCode || context.getSourceCode();
                const scope = sourceCode.getScope(node);
                let currentScope = scope;

                // Look up the scope chain for the variable
                while(currentScope) {
                    const variable = currentScope.variables.find((v) => v.name === node.name);

                    if(variable && variable.defs.length > 0) {
                        const def = variable.defs[0];
                        if(def.node && def.node.type === 'VariableDeclarator' && def.node.init) {
                            return isStringLiteral(def.node.init, visited);
                        }
                    }

                    currentScope = currentScope.upper;
                }
            }

            return false;
        }

        return {
            // Check for direct fetch calls
            CallExpression(node) {
                // Check if it's a fetch call
                if(node.callee.type === 'Identifier' && node.callee.name === 'fetch') {
                    // Allow fetch in NetworkService.ts itself
                    const filename = getFilename();
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
                    node.callee.object &&
                    node.callee.object.type === 'Identifier' &&
                    node.callee.object.name === 'window' &&
                    node.callee.property &&
                    node.callee.property.type === 'Identifier' &&
                    node.callee.property.name === 'fetch'
                ) {
                    const filename = getFilename();
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
                    node.callee.object &&
                    node.callee.object.type === 'Identifier' &&
                    node.callee.object.name === 'globalThis' &&
                    node.callee.property &&
                    node.callee.property.type === 'Identifier' &&
                    node.callee.property.name === 'fetch'
                ) {
                    const filename = getFilename();
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

                // Check for GraphQL method calls with string literals
                if(
                    node.callee.type === 'MemberExpression' &&
                    node.callee.property.type === 'Identifier' &&
                    (node.callee.property.name === 'useGraphQlQuery' ||
                        node.callee.property.name === 'useGraphQlMutation' ||
                        node.callee.property.name === 'useSuspenseGraphQlQuery' ||
                        node.callee.property.name === 'graphQlRequest')
                ) {
                    // Check the first argument
                    const firstArg = node.arguments[0];

                    if(!firstArg) {
                        return;
                    }

                    // Check if the argument traces back to a string literal
                    if(isStringLiteral(firstArg)) {
                        context.report({
                            node: firstArg,
                            messageId: 'noStringLiteralGraphQlQuery',
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
                    const filename = getFilename();
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
                if(
                    source.includes('/generated') &&
                    node.specifiers.some((spec) => spec.type === 'ImportSpecifier' && spec.imported.name === 'graphql')
                ) {
                    context.report({
                        node,
                        messageId: 'noDirectGraphqlImport',
                    });
                }

                // Check for incorrect project GraphQL imports
                if(source === '@project/app/_api/graphql/generated/graphql') {
                    context.report({
                        node,
                        messageId: 'incorrectProjectGraphQlImport',
                        fix(fixer) {
                            return fixer.replaceText(node.source, "'@project/app/_api/graphql/GraphQlGeneratedCode'");
                        },
                    });
                }

                // Check for incorrect project gql imports
                if(source === '@project/app/_api/graphql/generated/gql') {
                    context.report({
                        node,
                        messageId: 'incorrectProjectGqlImport',
                        fix(fixer) {
                            return fixer.replaceText(node.source, "'@project/app/_api/graphql/GraphQlGeneratedCode'");
                        },
                    });
                }

                // Check for incorrect structure GraphQL imports
                if(source === '@structure/source/api/graphql/generated/graphql') {
                    context.report({
                        node,
                        messageId: 'incorrectStructureGraphQlImport',
                        fix(fixer) {
                            return fixer.replaceText(
                                node.source,
                                "'@structure/source/api/graphql/GraphQlGeneratedCode'",
                            );
                        },
                    });
                }

                // Check for incorrect structure gql imports
                if(source === '@structure/source/api/graphql/generated/gql') {
                    context.report({
                        node,
                        messageId: 'incorrectStructureGqlImport',
                        fix(fixer) {
                            return fixer.replaceText(
                                node.source,
                                "'@structure/source/api/graphql/GraphQlGeneratedCode'",
                            );
                        },
                    });
                }
            },
        };
    },
};
