// ESLint rule to enforce using function declarations (export function Component)
// rather than const assignments (export const Component = function)
const ReactFunctionStyleRule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Enforce using function declarations for React components instead of const assignments',
            category: 'Best Practices',
            recommended: true,
        },
        fixable: 'code',
        schema: [],
    },
    create(context) {
        // Helper function to check if a declaration is a React component
        function checkComponentDeclaration(declaration, isExported = false) {
            // Only proceed if this is a likely component (PascalCase identifier)
            const identifierName = declaration.id && declaration.id.name;
            if(!identifierName || !/^[A-Z][A-Za-z0-9]*$/.test(identifierName)) {
                return;
            }

            // Skip if it's a React.forwardRef assignment
            if(
                declaration.init &&
                declaration.init.type === 'CallExpression' &&
                declaration.init.callee &&
                declaration.init.callee.type === 'MemberExpression' &&
                declaration.init.callee.object &&
                declaration.init.callee.object.name === 'React' &&
                declaration.init.callee.property &&
                declaration.init.callee.property.name === 'forwardRef'
            ) {
                return;
            }

            // Check if the right side is a function expression
            // This matches both:
            // 1. const Component = function() {...}
            // 2. const Component = () => {...}
            if(
                declaration.init &&
                (declaration.init.type === 'FunctionExpression' || declaration.init.type === 'ArrowFunctionExpression')
            ) {
                // Get source code to create a fix
                const sourceCode = context.getSourceCode();
                const functionCode = sourceCode.getText(declaration.init);

                // For arrow functions, we need to modify to get proper format
                let newFunctionCode;
                if(declaration.init.type === 'ArrowFunctionExpression') {
                    // Convert arrow function to regular function
                    const paramsText =
                        declaration.init.params.length > 0
                            ? declaration.init.params.map((param) => sourceCode.getText(param)).join(', ')
                            : '';
                    const body = sourceCode.getText(declaration.init.body);

                    // If body is a block (has curly braces), use it directly
                    // Otherwise wrap it in return statement
                    const functionBody = declaration.init.body.type === 'BlockStatement' ? body : `{ return ${body}; }`;

                    newFunctionCode = `function ${identifierName}(${paramsText}) ${functionBody}`;
                }
                else {
                    // For regular function expressions, just add the name
                    newFunctionCode = functionCode.replace(/^function\s*/, `function ${identifierName}`);
                }

                const messagePrefix = isExported ? 'export ' : '';
                context.report({
                    node: declaration,
                    message: `Use '${messagePrefix}function ${identifierName}()' instead of '${messagePrefix}const ${identifierName} = ${
                        declaration.init.type === 'ArrowFunctionExpression' ? '() => {}' : 'function()'
                    }''`,
                    fix(fixer) {
                        if(isExported) {
                            // For exported declarations, replace the entire export statement
                            const exportNode = declaration.parent.parent;
                            return fixer.replaceText(exportNode, `export ${newFunctionCode}`);
                        }
                        else {
                            // For non-exported, replace the entire variable declaration
                            return fixer.replaceText(declaration.parent, newFunctionCode);
                        }
                    },
                });
            }
        }

        return {
            // Look for export declarations
            ExportNamedDeclaration(node) {
                // Only care about variable declarations (export const X = ...)
                if(node.declaration && node.declaration.type === 'VariableDeclaration') {
                    const declarations = node.declaration.declarations || [];

                    // Check each declaration in the export statement
                    declarations.forEach((declaration) => {
                        checkComponentDeclaration(declaration, true);
                    });
                }
            },
            // Also look for non-exported variable declarations
            VariableDeclaration(node) {
                // Skip if this is part of an export (already handled above)
                if(node.parent && node.parent.type === 'ExportNamedDeclaration') {
                    return;
                }

                const declarations = node.declarations || [];
                declarations.forEach((declaration) => {
                    checkComponentDeclaration(declaration, false);
                });
            },
        };
    },
};

// Export - Default
export default ReactFunctionStyleRule;
