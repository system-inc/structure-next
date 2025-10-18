// ESLint rule to prevent arrow functions in React.forwardRef, React hooks, and event listeners
// This ensures that regular functions are used instead of arrow functions in these specific contexts
const ReactNoArrowFunctionsAsHookParametersRule = {
    meta: {
        type: 'problem',
        docs: {
            description:
                'Enforce using regular functions instead of arrow functions with React.forwardRef and React hooks',
            category: 'Best Practices',
            recommended: true,
        },
        fixable: null,
        schema: [],
    },
    create(context) {
        return {
            // Check for React.forwardRef with arrow function
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
                        });
                    }
                }

                // We've removed the array methods check as it was too aggressive
                // Arrow functions are allowed in array methods like .map(), .filter(), etc.
            },
        };
    },
};

// Export - Default
export default ReactNoArrowFunctionsAsHookParametersRule;
