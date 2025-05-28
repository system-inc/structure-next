// ESLint rule to enforce using the name 'properties' for React component props
// This ensures that all component props are named 'properties' instead of 'props'
// and no variables end with 'Props'
const ReactPropertiesParameterNameRule = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Enforce naming React component props as "properties" instead of "props" and ensure no variables end with "Props"',
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

        // Function to check if a variable name ends with 'Props'
        function checkVariableEndsWithProps(node) {
            if(node.id && node.id.type === 'Identifier' && node.id.name.endsWith('Props')) {
                context.report({
                    node: node.id,
                    message: `Variable name should not end with 'Props'. Use 'properties' naming convention instead.`,
                    fix(fixer) {
                        // Replace 'FooProps' with 'FooProperties'
                        const newName = node.id.name.replace(/Props$/, 'Properties');
                        return fixer.replaceText(node.id, newName);
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
            },
            // Check variable declarations for names ending with 'Props'
            VariableDeclarator(node) {
                checkVariableEndsWithProps(node);
            },
            // Check interface and type declarations for names ending with 'Props'
            TSInterfaceDeclaration(node) {
                if(node.id && node.id.name.endsWith('Props')) {
                    context.report({
                        node: node.id,
                        message: `Interface name should not end with 'Props'. Use 'Properties' or 'Interface' suffix instead.`,
                        fix(fixer) {
                            // Replace 'FooProps' with 'FooProperties'
                            const newName = node.id.name.replace(/Props$/, 'Properties');
                            return fixer.replaceText(node.id, newName);
                        }
                    });
                }
            },
            TSTypeAliasDeclaration(node) {
                if(node.id && node.id.name.endsWith('Props')) {
                    context.report({
                        node: node.id,
                        message: `Type name should not end with 'Props'. Use 'Properties' suffix instead.`,
                        fix(fixer) {
                            // Replace 'FooProps' with 'FooProperties'
                            const newName = node.id.name.replace(/Props$/, 'Properties');
                            return fixer.replaceText(node.id, newName);
                        }
                    });
                }
            }
        };
    }
};

// Export - Default
export default ReactPropertiesParameterNameRule;