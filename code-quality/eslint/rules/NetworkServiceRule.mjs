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
            hookShouldEndWithRequest:
                'Hook "{{hookName}}" uses NetworkService and should end with "Request". Suggested name: "{{suggestedName}}"',
            fileShouldEndWithRequest:
                'File contains hook "{{hookName}}" that uses NetworkService. File should be named "{{suggestedFileName}}"',
            missingOptionsParameter:
                'Hook "{{hookName}}" using {{methodName}} must accept an options parameter with type {{expectedType}} as the last parameter',
            optionsParameterNotPassedThrough:
                'Hook "{{hookName}}" has an options parameter but does not pass it to {{methodName}}. Options must be passed as the {{position}} argument',
            incorrectOptionsParameterType:
                'Hook "{{hookName}}" options parameter should use type {{expectedType}} instead of generic typing',
            noInvalidateCacheInOnSuccess:
                'Do not call invalidateCache inside onSuccess. Use the invalidateOnSuccess option instead to automatically invalidate cache keys when the mutation succeeds.',
        },
        schema: [],
    },
    create(context) {
        // Track if this file contains network service imports
        let hasNetworkServiceImport = false;
        // Track hooks that use network service
        const networkServiceHooks = new Map();

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

        // Helper function to check if a node is a NetworkService method call
        function isNetworkServiceCall(node) {
            if(node.type !== 'CallExpression') return false;

            const callee = node.callee;
            if(callee.type !== 'MemberExpression') return false;

            const object = callee.object;
            const property = callee.property;

            // Check if it's networkService.method()
            if(object.type === 'Identifier' && object.name === 'networkService') {
                const methodName = property.name;
                return ['useGraphQlQuery', 'useGraphQlMutation', 'graphQlRequest', 'useSuspenseGraphQlQuery'].includes(
                    methodName,
                );
            }

            return false;
        }

        // Helper function to suggest a better name for hooks
        function suggestHookName(currentName) {
            // If it already ends with Request, return as is
            if(currentName.endsWith('Request')) return currentName;

            // Remove common suffixes that should be replaced
            const suffixesToReplace = ['Query', 'Mutation', 'Hook'];
            let baseName = currentName;

            for(const suffix of suffixesToReplace) {
                if(baseName.endsWith(suffix)) {
                    baseName = baseName.slice(0, -suffix.length);
                    break;
                }
            }

            return baseName + 'Request';
        }

        // Helper function to check if a parameter has the correct options type
        function hasCorrectOptionsType(parameter) {
            if(!parameter.typeAnnotation || !parameter.typeAnnotation.typeAnnotation) return false;

            const typeAnnotation = parameter.typeAnnotation.typeAnnotation;

            // Check for InferUseGraphQlQueryOptions or InferUseGraphQlMutationOptions
            if(typeAnnotation.type === 'TSTypeReference' && typeAnnotation.typeName) {
                const typeName = typeAnnotation.typeName.name;
                return typeName === 'InferUseGraphQlQueryOptions' ||
                    typeName === 'InferUseGraphQlMutationOptions';
            }

            return false;
        }

        // Helper function to find NetworkService method calls and their details
        function findNetworkServiceCalls(node) {
            const calls = [];
            const visited = new Set();

            const traverse = (node) => {
                if(!node || typeof node !== 'object') return;

                const nodeKey = `${node.type}-${node.start}-${node.end}`;
                if(visited.has(nodeKey)) return;
                visited.add(nodeKey);

                if(node.type === 'CallExpression' && isNetworkServiceCall(node)) {
                    const methodName = node.callee.property.name;
                    const argumentsCount = node.arguments.length;
                    calls.push({
                        node,
                        methodName,
                        argumentsCount,
                        arguments: node.arguments
                    });
                }

                for(const key in node) {
                    if(key === 'parent' || key === 'range' || key === 'loc') continue;

                    if(node[key] && typeof node[key] === 'object') {
                        if(Array.isArray(node[key])) {
                            for(const item of node[key]) {
                                if(item && typeof item === 'object' && item.type) {
                                    traverse(item);
                                }
                            }
                        } else if(node[key].type) {
                            traverse(node[key]);
                        }
                    }
                }
            };

            traverse(node);
            return calls;
        }

        // Helper function to check hook for options parameter pattern
        function checkHookOptionsPattern(functionName, functionNode, parameters) {
            const networkCalls = findNetworkServiceCalls(functionNode.body || functionNode);

            if(networkCalls.length === 0) return;

            for(const currentNetworkCall of networkCalls) {
                const { methodName, arguments: networkCallArguments, node: networkCallNode } = currentNetworkCall;

                // Determine expected pattern based on method
                const isQuery = methodName === 'useGraphQlQuery' || methodName === 'useSuspenseGraphQlQuery';
                const isMutation = methodName === 'useGraphQlMutation';

                if(!isQuery && !isMutation) continue;

                const expectedType = isQuery ? 'InferUseGraphQlQueryOptions<typeof DocumentName>' : 'InferUseGraphQlMutationOptions<typeof DocumentName>';

                // For queries, check if variables are being passed
                let optionsArgumentIndex = 1; // Default for mutations
                let expectedPosition = 'second';

                if(isQuery) {
                    // Check if there's a second argument that looks like variables
                    if(networkCallArguments.length >= 2 && networkCallArguments[1]) {
                        // If second arg is not undefined/null literal and not named 'options', assume it's variables
                        const secondArg = networkCallArguments[1];
                        if(secondArg.type === 'Identifier' && secondArg.name && secondArg.name.toLowerCase().includes('option')) {
                            // Second arg looks like options, so no variables
                            optionsArgumentIndex = 1;
                            expectedPosition = 'second';
                        } else if(secondArg.type === 'Identifier' && secondArg.name === 'undefined') {
                            // Explicit undefined for variables
                            optionsArgumentIndex = 2;
                            expectedPosition = 'third';
                        } else if(secondArg.type === 'Literal' && secondArg.value === null) {
                            // Explicit null for variables
                            optionsArgumentIndex = 2;
                            expectedPosition = 'third';
                        } else {
                            // Assume it's variables
                            optionsArgumentIndex = 2;
                            expectedPosition = 'third';
                        }
                    }

                    // If there are 3 arguments, options should definitely be the third
                    if(networkCallArguments.length >= 3) {
                        optionsArgumentIndex = 2;
                        expectedPosition = 'third';
                    }
                }

                // Check if function has options parameter (should be last)
                const lastParameter = parameters && parameters.length > 0 ? parameters[parameters.length - 1] : null;
                let hasOptionsParameter = false;
                let optionsParameterName = null;

                if(lastParameter) {
                    // Check if last parameter name includes 'option'
                    if(lastParameter.type === 'Identifier') {
                        optionsParameterName = lastParameter.name;
                        hasOptionsParameter = optionsParameterName && optionsParameterName.toLowerCase().includes('option');
                    } else if(lastParameter.type === 'AssignmentPattern' && lastParameter.left && lastParameter.left.type === 'Identifier') {
                        optionsParameterName = lastParameter.left.name;
                        hasOptionsParameter = optionsParameterName && optionsParameterName.toLowerCase().includes('option');
                    }

                    // Check if it has the correct type annotation
                    if(hasOptionsParameter && !hasCorrectOptionsType(lastParameter)) {
                        context.report({
                            node: lastParameter,
                            messageId: 'incorrectOptionsParameterType',
                            data: {
                                hookName: functionName,
                                expectedType: expectedType
                            }
                        });
                    }
                }

                // Check if options parameter is missing entirely
                if(!hasOptionsParameter) {
                    const nodeToReport = functionNode.id || functionNode;
                    context.report({
                        node: nodeToReport,
                        messageId: 'missingOptionsParameter',
                        data: {
                            hookName: functionName,
                            methodName: methodName,
                            expectedType: expectedType
                        }
                    });
                } else {
                    // Check if options are passed through to the networkService call
                    let hasOptionsArgument = false;

                    if(networkCallArguments[optionsArgumentIndex]) {
                        const optionArg = networkCallArguments[optionsArgumentIndex];
                        // Check if it's a direct identifier
                        if(optionArg.type === 'Identifier' && optionArg.name === optionsParameterName) {
                            hasOptionsArgument = true;
                        }
                        // Check if it's an object expression that spreads the options
                        else if(optionArg.type === 'ObjectExpression' && optionArg.properties) {
                            hasOptionsArgument = optionArg.properties.some(prop =>
                                prop.type === 'SpreadElement' &&
                                prop.argument &&
                                prop.argument.type === 'Identifier' &&
                                prop.argument.name === optionsParameterName
                            );
                        }
                    }

                    if(!hasOptionsArgument) {
                        context.report({
                            node: networkCallNode,
                            messageId: 'optionsParameterNotPassedThrough',
                            data: {
                                hookName: functionName,
                                methodName: methodName,
                                position: expectedPosition
                            }
                        });
                    }
                }
            }
        }

        // Helper function to check if a function uses NetworkService
        function checkForNetworkService(node) {
            let usesNetworkService = false;
            const visited = new Set();

            const traverse = (node) => {
                if(!node || typeof node !== 'object') return;

                // Create a unique key for this node
                const nodeKey = `${node.type}-${node.start}-${node.end}`;
                if(visited.has(nodeKey)) return;
                visited.add(nodeKey);

                if(isNetworkServiceCall(node)) {
                    usesNetworkService = true;
                    return;
                }

                // Recursively check child nodes
                for(const key in node) {
                    if(key === 'parent' || key === 'range' || key === 'loc') continue; // Skip references that could cause cycles

                    if(node[key] && typeof node[key] === 'object') {
                        if(Array.isArray(node[key])) {
                            for(const item of node[key]) {
                                if(item && typeof item === 'object' && item.type) {
                                    traverse(item);
                                }
                            }
                        }
                        else if(node[key].type) {
                            traverse(node[key]);
                        }
                    }
                }
            };

            traverse(node);
            return usesNetworkService;
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

                // Track NetworkService imports
                if(source.includes('NetworkService')) {
                    hasNetworkServiceImport = true;
                }

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

            // Check function declarations that might be hooks
            FunctionDeclaration(node) {
                if(!hasNetworkServiceImport) return;
                if(!node.id || !node.id.name.startsWith('use')) return;

                const functionName = node.id.name;

                // Check if this function uses NetworkService
                if(node.body && checkForNetworkService(node.body)) {
                    networkServiceHooks.set(functionName, node);

                    // Check if the hook name ends with Request
                    if(!functionName.endsWith('Request')) {
                        const suggestedName = suggestHookName(functionName);
                        context.report({
                            node: node.id,
                            messageId: 'hookShouldEndWithRequest',
                            data: {
                                hookName: functionName,
                                suggestedName: suggestedName,
                            },
                        });
                    }

                    // Check for options parameter pattern
                    checkHookOptionsPattern(functionName, node, node.params);
                }
            },

            // Check arrow functions and function expressions that might be hooks
            VariableDeclarator(node) {
                if(!hasNetworkServiceImport) return;
                if(!node.id || !node.id.name || !node.id.name.startsWith('use')) return;

                const functionName = node.id.name;

                // Check if the function uses NetworkService
                if(
                    node.init &&
                    (node.init.type === 'ArrowFunctionExpression' || node.init.type === 'FunctionExpression')
                ) {
                    if(node.init.body && checkForNetworkService(node.init.body)) {
                        networkServiceHooks.set(functionName, node);

                        if(!functionName.endsWith('Request')) {
                            const suggestedName = suggestHookName(functionName);
                            context.report({
                                node: node.id,
                                messageId: 'hookShouldEndWithRequest',
                                data: {
                                    hookName: functionName,
                                    suggestedName: suggestedName,
                                },
                            });
                        }

                        // Check for options parameter pattern
                        checkHookOptionsPattern(functionName, node.init, node.init.params);
                    }
                }
            },

            // Check exported variable declarations that might be hooks
            ExportNamedDeclaration(node) {
                if(!hasNetworkServiceImport) return;
                if(!node.declaration || node.declaration.type !== 'VariableDeclaration') return;

                for(const declarator of node.declaration.declarations) {
                    if(!declarator.id || !declarator.id.name || !declarator.id.name.startsWith('use')) continue;

                    const functionName = declarator.id.name;

                    if(
                        declarator.init &&
                        (declarator.init.type === 'ArrowFunctionExpression' || declarator.init.type === 'FunctionExpression')
                    ) {
                        if(declarator.init.body && checkForNetworkService(declarator.init.body)) {
                            networkServiceHooks.set(functionName, declarator);

                            if(!functionName.endsWith('Request')) {
                                const suggestedName = suggestHookName(functionName);
                                context.report({
                                    node: declarator.id,
                                    messageId: 'hookShouldEndWithRequest',
                                    data: {
                                        hookName: functionName,
                                        suggestedName: suggestedName,
                                    },
                                });
                            }

                            // Check for options parameter pattern
                            checkHookOptionsPattern(functionName, declarator.init, declarator.init.params);
                        }
                    }
                }
            },

            // Check for invalidateCache calls inside onSuccess
            'Property[key.name="onSuccess"] CallExpression[callee.property.name="invalidateCache"]'(node) {
                // Check if it's networkService.invalidateCache or similar
                const objectName = node.callee.object?.name;
                if(objectName === 'networkService' || objectName?.includes('service') || objectName?.includes('Service')) {
                    context.report({
                        node,
                        messageId: 'noInvalidateCacheInOnSuccess',
                    });
                }
            },

            // Check at the end of the file for filename convention
            'Program:exit'() {
                if(networkServiceHooks.size === 0) return;

                const filename = getFilename();
                const basename = filename.split('/').pop().split('\\').pop();

                // Skip if not a TypeScript file
                if(!basename.endsWith('.ts') && !basename.endsWith('.tsx')) return;

                // Extract filename without extension
                const nameWithoutExt = basename.replace(/\.(ts|tsx)$/, '');

                // Check if filename ends with Request
                if(!nameWithoutExt.endsWith('Request')) {
                    // Find the main exported hook
                    let mainHookName = null;
                    for(const [hookName] of networkServiceHooks) {
                        mainHookName = hookName;
                        break; // Just take the first one for now
                    }

                    if(mainHookName) {
                        const suggestedFileName = suggestHookName(mainHookName) + basename.slice(nameWithoutExt.length);
                        context.report({
                            node: networkServiceHooks.get(mainHookName),
                            messageId: 'fileShouldEndWithRequest',
                            data: {
                                hookName: mainHookName,
                                suggestedFileName: suggestedFileName,
                            },
                        });
                    }
                }
            },
        };
    },
};
