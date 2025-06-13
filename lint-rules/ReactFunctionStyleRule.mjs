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
        return {
            // Look for export declarations
            ExportNamedDeclaration(node) {
                // Only care about variable declarations (export const X = ...)
                if(node.declaration && node.declaration.type === 'VariableDeclaration') {
                    const declarations = node.declaration.declarations || [];

                    // Check each declaration in the export statement
                    declarations.forEach((declaration) => {
                        // Only proceed if this is a likely component (PascalCase identifier)
                        const identifierName = declaration.id && declaration.id.name;
                        if(!identifierName || !/^[A-Z][A-Za-z0-9]*$/.test(identifierName)) {
                            return;
                        }

                        // Check if the right side is a function expression
                        // This matches both:
                        // 1. export const Component = function() {...}
                        // 2. export const Component = () => {...}
                        if(
                            declaration.init &&
                            (declaration.init.type === 'FunctionExpression' ||
                                declaration.init.type === 'ArrowFunctionExpression')
                        ) {
                            // Get source code to create a fix
                            const sourceCode = context.getSourceCode();
                            const functionCode = sourceCode.getText(declaration.init);

                            // For arrow functions, we need to modify to get proper format
                            let newFunctionCode;
                            if(declaration.init.type === 'ArrowFunctionExpression') {
                                // Convert arrow function to regular function
                                const params = sourceCode.getText(declaration.init.params[0]) || '';
                                const body = sourceCode.getText(declaration.init.body);

                                // If body is a block (has curly braces), use it directly
                                // Otherwise wrap it in return statement
                                const functionBody =
                                    declaration.init.body.type === 'BlockStatement' ? body : `{ return ${body}; }`;

                                newFunctionCode = `function ${identifierName}(${params}) ${functionBody}`;
                            }
                            else {
                                // For regular function expressions, just add the name
                                newFunctionCode = functionCode.replace(/^function\s*/, `function ${identifierName}`);
                            }

                            context.report({
                                node: declaration,
                                message: `Use 'export function ${identifierName}()' instead of 'export const ${identifierName} = function()'`,
                                fix(fixer) {
                                    // Replace the entire export declaration with the function declaration
                                    return fixer.replaceText(node, `export ${newFunctionCode}`);
                                },
                            });
                        }
                    });
                }
            },
        };
    },
};

// Export - Default
export default ReactFunctionStyleRule;
