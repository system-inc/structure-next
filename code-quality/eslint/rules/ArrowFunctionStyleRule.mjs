// ESLint rule to enforce regular function usage over arrow functions in specific contexts
// This includes React hooks, event listeners, and general multi-line arrow functions
const ArrowFunctionStyleRule = {
    meta: {
        type: 'problem',
        docs: {
            description:
                'Enforce using regular functions instead of arrow functions (except single-line implicit returns or when using this)',
            category: 'Best Practices',
            recommended: true,
        },
        fixable: 'code',
        schema: [],
    },
    create(context) {
        // Helper function to check if a function uses 'this' anywhere in its body
        function usesThis(node) {
            let found = false;

            function traverse(currentNode) {
                if(!currentNode || found) {
                    return;
                }

                // If we find a ThisExpression, mark as found
                if(currentNode.type === 'ThisExpression') {
                    found = true;
                    return;
                }

                // Don't traverse into nested function declarations or expressions
                // (they have their own 'this' binding)
                if(
                    currentNode.type === 'FunctionDeclaration' ||
                    currentNode.type === 'FunctionExpression' ||
                    (currentNode.type === 'ArrowFunctionExpression' && currentNode !== node)
                ) {
                    return;
                }

                // Traverse all properties of the node
                for(const key in currentNode) {
                    if(key === 'parent' || key === 'leadingComments' || key === 'trailingComments') {
                        continue;
                    }

                    const value = currentNode[key];

                    if(Array.isArray(value)) {
                        value.forEach(traverse);
                    }
                    else if(value && typeof value === 'object') {
                        traverse(value);
                    }
                }
            }

            traverse(node.body);
            return found;
        }

        // Helper function to generate autofix for arrow function to regular function
        function getArrowFunctionFix(fixer, node) {
            const sourceCode = context.getSourceCode();
            const functionText = sourceCode.getText(node);

            // Check if function is async
            const asyncKeyword = node.async ? 'async ' : '';

            // Get the full text from start to the arrow (=>)
            // This includes parameters and potential TypeScript return type
            const arrowIndex = functionText.indexOf('=>');
            if(arrowIndex === -1) {
                // Fallback if we can't find the arrow
                return null;
            }

            // Get everything before the arrow (params and return type)
            let beforeArrow = functionText.substring(0, arrowIndex).trim();

            // If it starts with 'async', remove it since we'll add it back later
            if(beforeArrow.startsWith('async ')) {
                beforeArrow = beforeArrow.substring(6).trim();
            }

            // Ensure parameters are wrapped in parentheses
            if(!beforeArrow.startsWith('(')) {
                // Single parameter without parens - wrap it
                beforeArrow = `(${beforeArrow})`;
            }

            // Get body text (everything after the arrow)
            const bodyText = sourceCode.getText(node.body);

            // Build the replacement
            let replacementBody = bodyText;
            if(node.body.type !== 'BlockStatement') {
                // Implicit return - wrap in block with return statement
                replacementBody = `{ return ${bodyText}; }`;
            }

            const replacementText = `${asyncKeyword}function${beforeArrow} ${replacementBody}`;

            return fixer.replaceText(node, replacementText);
        }

        return {
            // Check for React.forwardRef and React hooks with arrow functions
            CallExpression(node) {
                // Check if it's a MemberExpression (e.g., React.forwardRef)
                if(node.callee.type === 'MemberExpression') {
                    const object = node.callee.object;
                    const property = node.callee.property;

                    // Check if it's React.forwardRef or any React hook
                    if(
                        object.name === 'React' &&
                        (property.name === 'forwardRef' ||
                            // Catch any React hook (methods starting with 'use')
                            property.name?.startsWith('use'))
                    ) {
                        // Check if the first argument is an arrow function
                        if(node.arguments.length > 0 && node.arguments[0].type === 'ArrowFunctionExpression') {
                            context.report({
                                node: node.arguments[0],
                                message: `Use a regular function instead of an arrow function with React.${property.name}.`,
                                fix(fixer) {
                                    return getArrowFunctionFix(fixer, node.arguments[0]);
                                },
                            });
                        }
                    }
                }

                // Check for addEventListener with arrow function
                if(node.callee.type === 'MemberExpression' && node.callee.property?.name === 'addEventListener') {
                    // Check if the second argument is an arrow function
                    if(node.arguments.length > 1 && node.arguments[1].type === 'ArrowFunctionExpression') {
                        context.report({
                            node: node.arguments[1],
                            message: 'Use a regular function instead of an arrow function with addEventListener.',
                            fix(fixer) {
                                return getArrowFunctionFix(fixer, node.arguments[1]);
                            },
                        });
                    }
                }
            },

            // General check for multi-line arrow functions
            ArrowFunctionExpression(node) {
                // Skip if this arrow function uses 'this' (allowed)
                if(usesThis(node)) {
                    return;
                }

                // Check if it's a single-line implicit return (allowed)
                // Implicit return = body is NOT a BlockStatement
                if(node.body.type !== 'BlockStatement') {
                    return;
                }

                // Check if already reported by CallExpression handler
                // (React hooks, addEventListener, etc.)
                const parent = node.parent;
                if(parent && parent.type === 'CallExpression') {
                    if(parent.callee.type === 'MemberExpression') {
                        const object = parent.callee.object;
                        const property = parent.callee.property;

                        // Skip if it's React.forwardRef, React hooks, or addEventListener
                        if(
                            (object.name === 'React' &&
                                (property.name === 'forwardRef' || property.name?.startsWith('use'))) ||
                            property.name === 'addEventListener'
                        ) {
                            return;
                        }
                    }
                }

                // Report multi-line arrow function that doesn't use 'this'
                context.report({
                    node,
                    message:
                        'Use a regular function instead of a multi-line arrow function. Arrow functions are only allowed for single-line implicit returns or when using "this".',
                    fix(fixer) {
                        return getArrowFunctionFix(fixer, node);
                    },
                });
            },
        };
    },
};

// Export - Default
export default ArrowFunctionStyleRule;
