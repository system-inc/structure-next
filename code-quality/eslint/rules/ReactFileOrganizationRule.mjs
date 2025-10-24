// ESLint rule to enforce file organization: if any component is longer than 60 lines,
// the file should only contain one primary component (small helpers under 10 lines are allowed)
const ReactFileOrganizationRule = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Enforce that files with large components (>60 lines) should only contain one primary component',
            category: 'Best Practices',
            recommended: true,
        },
        fixable: null,
        schema: [
            {
                type: 'object',
                properties: {
                    maxComponentLines: {
                        type: 'integer',
                        minimum: 1,
                        default: 60,
                    },
                    maxHelperLines: {
                        type: 'integer',
                        minimum: 1,
                        default: 10,
                    },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        const options = context.options[0] || {};
        const maxComponentLines = options.maxComponentLines || 60;
        const maxHelperLines = options.maxHelperLines || 10;

        // Track all React components found in the file
        const components = [];

        function isReactComponent(node) {
            // Check if it's a function that looks like a React component
            const name = node.id && node.id.name;
            if(!name) return false;

            // Must start with uppercase (PascalCase)
            if(!/^[A-Z]/.test(name)) return false;

            // Must return JSX or call React hooks
            return hasJSXOrReactFeatures(node);
        }

        function hasJSXOrReactFeatures(node) {
            let hasJSX = false;
            let hasReactHooks = false;
            const visited = new WeakSet();

            // Simple traversal to check for JSX or React hooks with cycle detection
            function traverse(currentNode, depth = 0) {
                // Prevent infinite recursion
                if(!currentNode || typeof currentNode !== 'object' || depth > 20) return;
                if(visited.has(currentNode)) return;
                visited.add(currentNode);

                // Early exit if we found what we're looking for
                if(hasJSX && hasReactHooks) return;

                // Check for JSX
                if(currentNode.type === 'JSXElement' || currentNode.type === 'JSXFragment') {
                    hasJSX = true;
                    return;
                }

                // Check for React hooks (useState, useEffect, etc.)
                if(
                    currentNode.type === 'CallExpression' &&
                    currentNode.callee?.type === 'MemberExpression' &&
                    currentNode.callee.object?.name === 'React' &&
                    currentNode.callee.property?.name?.startsWith('use')
                ) {
                    hasReactHooks = true;
                    return;
                }

                // Check for direct hook calls (if not prefixed with React.)
                if(
                    currentNode.type === 'CallExpression' &&
                    currentNode.callee?.type === 'Identifier' &&
                    currentNode.callee.name?.startsWith('use') &&
                    /^use[A-Z]/.test(currentNode.callee.name)
                ) {
                    hasReactHooks = true;
                    return;
                }

                // Only traverse specific properties to avoid cycles
                const propertiesToTraverse = [
                    'body',
                    'consequent',
                    'alternate',
                    'declarations',
                    'expression',
                    'init',
                    'callee',
                    'arguments',
                    'elements',
                    'properties',
                ];

                for(const key of propertiesToTraverse) {
                    if(currentNode[key]) {
                        const value = currentNode[key];
                        if(Array.isArray(value)) {
                            for(const item of value) {
                                traverse(item, depth + 1);
                                if(hasJSX && hasReactHooks) return;
                            }
                        }
                        else if(value && typeof value === 'object') {
                            traverse(value, depth + 1);
                            if(hasJSX && hasReactHooks) return;
                        }
                    }
                }
            }

            traverse(node);
            return hasJSX || hasReactHooks;
        }

        function countCodeLines(node) {
            const sourceCode = context.getSourceCode();
            const startLine = node.loc.start.line;
            const endLine = node.loc.end.line;

            let codeLines = 0;

            for(let lineNumber = startLine; lineNumber <= endLine; lineNumber++) {
                const line = sourceCode.lines[lineNumber - 1];
                if(line && line.trim() !== '' && !line.trim().startsWith('//') && !line.trim().startsWith('*')) {
                    codeLines++;
                }
            }

            return codeLines;
        }

        function checkFileOrganization() {
            if(components.length <= 1) return;

            // Categorize components by size
            const actualLargeComponents = []; // Components > maxComponentLines (60)
            const mediumComponents = []; // Components between maxHelperLines and maxComponentLines
            const smallComponents = []; // Components <= maxHelperLines (10)

            components.forEach(function (component) {
                const lineCount = countCodeLines(component.node);
                component.lineCount = lineCount;

                if(lineCount > maxComponentLines) {
                    actualLargeComponents.push(component);
                }
                else if(lineCount <= maxHelperLines) {
                    smallComponents.push(component);
                }
                else {
                    // Medium-sized components (between helper size and large size)
                    mediumComponents.push(component);
                }
            });

            // If we have any components that exceed maxComponentLines OR medium components, enforce the rule
            const hasLargeComponents = actualLargeComponents.length > 0;
            const allNonSmallComponents = [...actualLargeComponents, ...mediumComponents];

            if(hasLargeComponents || mediumComponents.length > 0) {
                // If there are multiple non-small components, that's a violation
                if(allNonSmallComponents.length > 1) {
                    const primaryComponent = allNonSmallComponents[0];
                    const violatingComponents = allNonSmallComponents.slice(1);

                    // Report violations for additional components
                    violatingComponents.forEach(function (component) {
                        context.report({
                            node: component.node,
                            message: `File contains a component with ${primaryComponent.lineCount} lines. When any component exceeds ${maxComponentLines} lines, the file should contain only one primary component. Consider moving this ${component.lineCount}-line component to its own file.`,
                        });
                    });
                }

                // Also check if we have too many small components when there's a large component
                if(hasLargeComponents && smallComponents.length > 3) {
                    smallComponents.slice(3).forEach(function (component) {
                        context.report({
                            node: component.node,
                            message: `Too many helper components in a file with a large primary component. Consider moving some helpers to separate files or combining them.`,
                        });
                    });
                }
            }
        }

        return {
            // Track function declarations
            FunctionDeclaration(node) {
                if(isReactComponent(node)) {
                    components.push({
                        node: node,
                        name: node.id.name,
                        type: 'FunctionDeclaration',
                    });
                }
            },

            // Track exported function expressions and arrow functions
            ExportNamedDeclaration(node) {
                if(node.declaration && node.declaration.type === 'VariableDeclaration') {
                    const declarations = node.declaration.declarations || [];

                    declarations.forEach(function (declaration) {
                        const identifierName = declaration.id && declaration.id.name;
                        if(identifierName && /^[A-Z]/.test(identifierName)) {
                            if(
                                declaration.init &&
                                (declaration.init.type === 'FunctionExpression' ||
                                    declaration.init.type === 'ArrowFunctionExpression')
                            ) {
                                if(hasJSXOrReactFeatures(declaration.init)) {
                                    components.push({
                                        node: declaration.init,
                                        name: identifierName,
                                        type: declaration.init.type,
                                    });
                                }
                            }
                        }
                    });
                }
            },

            // Track default export functions
            ExportDefaultDeclaration(node) {
                if(node.declaration) {
                    if(node.declaration.type === 'FunctionDeclaration' && isReactComponent(node.declaration)) {
                        components.push({
                            node: node.declaration,
                            name: node.declaration.id ? node.declaration.id.name : 'DefaultExport',
                            type: 'FunctionDeclaration',
                        });
                    }
                    else if(
                        (node.declaration.type === 'FunctionExpression' ||
                            node.declaration.type === 'ArrowFunctionExpression') &&
                        hasJSXOrReactFeatures(node.declaration)
                    ) {
                        components.push({
                            node: node.declaration,
                            name: 'DefaultExport',
                            type: node.declaration.type,
                        });
                    }
                }
            },

            // Check organization when we finish parsing the file
            'Program:exit'() {
                checkFileOrganization();
            },
        };
    },
};

// Export - Default
export default ReactFileOrganizationRule;
