// ESLint rule to enforce proper React hook dependencies
// Prevents passing entire 'properties' object in useCallback/useMemo dependencies
// Instead, developers should extract specific properties they need
const ReactHookDependenciesRule = {
    meta: {
        type: 'problem',
        docs: {
            description:
                'Prevent passing entire properties object to React hook dependencies. Extract specific properties instead.',
            category: 'Best Practices',
            recommended: true,
        },
        fixable: null,
        schema: [],
        messages: {
            noPropertiesInDeps:
                "Don't pass the entire 'properties' object in {{hookName}} dependencies. Extract specific properties above the hook and use those instead.",
            extractPropertiesFirst:
                "Extract the specific properties you need from 'properties' before the {{hookName}} hook:\nconst propertiesOnRefresh = properties.onRefresh;\nconst propertiesAgentId = properties.agentId;\n\nThen use those variables in the dependency array: [propertiesOnRefresh, propertiesAgentId]",
        },
    },
    create(context) {
        return {
            CallExpression(node) {
                // Check if this is a React hook call (React.useCallback, React.useMemo, React.useEffect, etc.)
                if(
                    node.callee.type === 'MemberExpression' &&
                    node.callee.object.type === 'Identifier' &&
                    node.callee.object.name === 'React' &&
                    node.callee.property.type === 'Identifier'
                ) {
                    const hookName = node.callee.property.name;

                    // Only check hooks that have dependency arrays
                    const hooksWithDependencies = [
                        'useCallback',
                        'useMemo',
                        'useEffect',
                        'useLayoutEffect',
                        'useImperativeHandle',
                    ];
                    if(!hooksWithDependencies.includes(hookName)) {
                        return;
                    }

                    // Get the dependency array (second argument for most hooks)
                    let dependenciesArgument;
                    if(hookName === 'useImperativeHandle') {
                        // useImperativeHandle has deps as third argument
                        dependenciesArgument = node.arguments[2];
                    }
                    else {
                        // Other hooks have deps as second argument
                        dependenciesArgument = node.arguments[1];
                    }

                    // Check if there's a dependency array
                    if(!dependenciesArgument || dependenciesArgument.type !== 'ArrayExpression') {
                        return;
                    }

                    // Check each dependency
                    dependenciesArgument.elements.forEach((element) => {
                        if(element && element.type === 'Identifier' && element.name === 'properties') {
                            // Check if we're in a component (function starting with capital letter)
                            let isInComponent = false;
                            let componentNode = node;

                            while(componentNode) {
                                if(
                                    componentNode.type === 'FunctionDeclaration' ||
                                    componentNode.type === 'FunctionExpression' ||
                                    componentNode.type === 'ArrowFunctionExpression'
                                ) {
                                    // Check if this function is likely a component
                                    let functionName = null;

                                    if(componentNode.id && componentNode.id.name) {
                                        functionName = componentNode.id.name;
                                    }
                                    else if(
                                        componentNode.parent &&
                                        componentNode.parent.type === 'VariableDeclarator' &&
                                        componentNode.parent.id &&
                                        componentNode.parent.id.name
                                    ) {
                                        functionName = componentNode.parent.id.name;
                                    }

                                    if(functionName && /^[A-Z]/.test(functionName)) {
                                        isInComponent = true;
                                        break;
                                    }
                                }
                                componentNode = componentNode.parent;
                            }

                            if(isInComponent) {
                                context.report({
                                    node: element,
                                    messageId: 'extractPropertiesFirst',
                                    data: {
                                        hookName: `React.${hookName}`,
                                    },
                                });
                            }
                        }
                    });
                }
            },
        };
    },
};

// Export - Default
export default ReactHookDependenciesRule;
