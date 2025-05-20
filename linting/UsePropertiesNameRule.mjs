// ESLint rule to enforce using the name 'properties' for React component props
// This ensures that all component props are named 'properties' instead of 'props'
const UsePropertiesNameRule = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Enforce naming React component props as "properties" instead of "props"',
            category: 'Stylistic Issues',
            recommended: true,
        },
        fixable: 'code',
        schema: [],
    },
    create(context) {
        // Function to check if node is likely a React component
        function isReactComponent(node) {
            // If function name starts with uppercase letter, it's likely a component
            if(node.id && node.id.name && /^[A-Z]/.test(node.id.name)) {
                return true;
            }

            // For arrow functions or anonymous functions assigned to variables
            // Need to check parent node in case of variable declarations
            if(node.parent && node.parent.type === 'VariableDeclarator' &&
                node.parent.id && node.parent.id.name && /^[A-Z]/.test(node.parent.id.name)) {
                return true;
            }

            // For functions assigned to properties (e.g., in object literals)
            if(node.parent && node.parent.type === 'Property' &&
                node.parent.key && node.parent.key.name && /^[A-Z]/.test(node.parent.key.name)) {
                return true;
            }

            return false;
        }

        // Function to check if parameter is named "props" specifically 
        // This ensures we don't rename other parameters or non-component parameters
        function isPropsParameter(param) {
            return param.type === 'Identifier' && param.name === 'props';
        }

        // Function to check if a parameter should be renamed to 'properties'
        function checkPropsParameter(node) {
            // Skip functions with no params
            if(!node.params || node.params.length === 0) {
                return;
            }

            // Only check the first parameter for React components
            const firstParam = node.params[0];

            // Only report if:
            // 1. It's a React component
            // 2. The parameter is specifically named "props"
            if(isReactComponent(node) && isPropsParameter(firstParam)) {
                context.report({
                    node: firstParam,
                    message: `Use 'properties' instead of 'props' for component properties.`,
                    fix(fixer) {
                        return fixer.replaceText(firstParam, 'properties');
                    }
                });
            }
        }

        return {
            // Check all function-like nodes
            FunctionDeclaration(node) {
                checkPropsParameter(node);
            },
            ArrowFunctionExpression(node) {
                checkPropsParameter(node);
            },
            FunctionExpression(node) {
                checkPropsParameter(node);
            }
        };
    }
};

export default UsePropertiesNameRule;