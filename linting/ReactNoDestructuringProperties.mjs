// ESLint rule to prevent destructuring in function parameters for React components
// This enforces using direct property access (properties.propName) instead of destructuring
const ReactNoDestructuringProperties = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Prevent destructuring in function parameters for React components',
            category: 'Best Practices',
            recommended: true,
        },
        fixable: null,
        schema: [],
    },
    create(context) {
        return {
            // Check function declarations
            FunctionDeclaration(node) {
                checkDestructuringInParams(node, context);
            },
            // Check arrow function expressions
            ArrowFunctionExpression(node) {
                checkDestructuringInParams(node, context);
            },
            // Check function expressions
            FunctionExpression(node) {
                checkDestructuringInParams(node, context);
            },
        };
    },
};

// Helper function to check if any parameter uses destructuring
function checkDestructuringInParams(node, context) {
    // Skip functions with no params
    if (!node.params || node.params.length === 0) {
        return;
    }
    
    // Check each parameter
    node.params.forEach(param => {
        // Check for object pattern (destructuring)
        if (param.type === 'ObjectPattern') {
            // This is a special case - allow React.useState destructuring
            const isHookAssignment = isReactHookDestructuring(param);
            
            // If it's not a hook assignment, report the error
            if (!isHookAssignment) {
                context.report({
                    node: param,
                    message: 'Destructuring in function parameters is not allowed. Use direct property access instead.',
                });
            }
        }
    });
}

// Helper function to check if destructuring is for a React hook
function isReactHookDestructuring(node) {
    // Skip if not in a variable declaration
    if (!node.parent || node.parent.type !== 'VariableDeclarator') {
        return false;
    }
    
    // Check if right side is a call expression
    const rightSide = node.parent.init;
    if (!rightSide || rightSide.type !== 'CallExpression') {
        return false;
    }
    
    // Check if the call is to a React hook
    const callee = rightSide.callee;
    if (callee.type === 'MemberExpression') {
        return (
            callee.object && callee.object.name === 'React' && 
            callee.property && callee.property.name && 
            callee.property.name.startsWith('use')
        );
    }
    
    return false;
}

export default ReactNoDestructuringProperties;