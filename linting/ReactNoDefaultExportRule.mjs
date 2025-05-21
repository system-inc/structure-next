// ESLint rule to prevent default exports in React component files
// This enforces using named exports only
const ReactNoDefaultExportRule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Prevent default exports in React component files, enforcing named exports only',
            category: 'Best Practices',
            recommended: true,
        },
        fixable: 'code',
        schema: [],
    },
    create(context) {
        // Track if we have identified a React component in the file
        let componentName = null;
        let hasNamedExport = false;

        // Track actual component implementations we find
        const implementedComponents = new Set();

        return {
            // Detect React components with React.forwardRef
            VariableDeclarator(node) {
                // Check for patterns like: const MyComponent = React.forwardRef(...
                if(node.id && node.id.type === 'Identifier' &&
                    node.init && node.init.type === 'CallExpression' &&
                    node.init.callee &&
                    node.init.callee.type === 'MemberExpression' &&
                    node.init.callee.object &&
                    node.init.callee.object.name === 'React' &&
                    node.init.callee.property &&
                    node.init.callee.property.name === 'forwardRef') {

                    // If the variable name starts with an uppercase letter, it's likely a component
                    if(/^[A-Z]/.test(node.id.name)) {
                        implementedComponents.add(node.id.name);

                        // Set as the component name if we don't have one yet
                        if(!componentName) {
                            componentName = node.id.name;
                        }
                        
                        // Check if this is already a named export via 'export const X = React.forwardRef(...)'
                        if(node.parent && 
                           node.parent.parent && 
                           node.parent.parent.type === 'ExportNamedDeclaration') {
                            hasNamedExport = true;
                        }
                    }
                }
            },

            // Check for function components defined as function declarations
            FunctionDeclaration(node) {
                const functionName = node.id && node.id.name;

                // Skip functions without names or with non-component naming
                if(!functionName || !/^[A-Z]/.test(functionName)) {
                    return;
                }

                // Check if this is a React component by looking at the return value or JSX usage
                let isReactComponent = false;

                // Look at the function body
                if(node.body && node.body.type === 'BlockStatement') {
                    // Check function parameters for props/properties pattern
                    if(node.params && node.params.length > 0) {
                        const firstParam = node.params[0];
                        if(firstParam.type === 'Identifier' &&
                            (firstParam.name === 'properties' || firstParam.name === 'props')) {
                            isReactComponent = true;
                        }
                    }

                    // Check return statements for JSX elements (common in React components)
                    const returnStatements = node.body.body.filter(stmt =>
                        stmt.type === 'ReturnStatement');

                    if(returnStatements.length > 0) {
                        const returnValue = returnStatements[0].argument;
                        if(returnValue && (
                            returnValue.type === 'JSXElement' ||
                            returnValue.type === 'JSXFragment' ||
                            (returnValue.type === 'ConditionalExpression' &&
                                (returnValue.consequent.type === 'JSXElement' ||
                                    returnValue.alternate.type === 'JSXElement'))
                        )) {
                            isReactComponent = true;
                        }
                    }
                }

                // If this is a component, record it
                if(isReactComponent) {
                    implementedComponents.add(functionName);

                    // Set as the main component if we don't have one yet
                    if(!componentName) {
                        componentName = functionName;
                    }

                    // If it's a named export, track that
                    if(node.parent && node.parent.type === 'ExportNamedDeclaration') {
                        hasNamedExport = true;
                    }
                }
            },

            // Check for named exports of any component
            ExportNamedDeclaration(node) {
                // First, check if we're exporting a variable or function directly 
                if(node.declaration) {
                    // If exporting a function declaration directly
                    if(node.declaration.type === 'FunctionDeclaration' &&
                        node.declaration.id) {
                        const name = node.declaration.id.name;
                        if(implementedComponents.has(name) || name === componentName) {
                            hasNamedExport = true;
                        }
                    }
                    // If exporting a variable declaration (like const ComponentName = React.forwardRef(...))
                    else if(node.declaration.type === 'VariableDeclaration' &&
                        node.declaration.declarations &&
                        node.declaration.declarations.length > 0) {

                        // Check each variable declared
                        node.declaration.declarations.forEach(declaration => {
                            if(declaration.id && declaration.id.type === 'Identifier') {
                                const name = declaration.id.name;
                                if(implementedComponents.has(name) || name === componentName) {
                                    hasNamedExport = true;
                                }
                            }
                        });
                    }
                }
                // Check for named exports with specifiers (export { Component })
                else if(node.specifiers && node.specifiers.length > 0) {
                    for(const specifier of node.specifiers) {
                        if(specifier.exported &&
                            (implementedComponents.has(specifier.exported.name) ||
                                specifier.exported.name === componentName)) {
                            hasNamedExport = true;
                            break;
                        }
                    }
                }
            },

            // Check for default exports and report errors
            ExportDefaultDeclaration(node) {
                // Only apply to potential component files
                const filename = context.getFilename();

                // Skip non-React files, node_modules, and special Next.js files
                if(!(/\.(tsx|jsx)$/i.test(filename)) ||
                    filename.includes('node_modules')) {
                    return;
                }

                // Skip Next.js special files which have their own export patterns
                const specialNextJsFiles = [
                    '/page.tsx',
                    '/page.jsx',
                    '/error.tsx',
                    '/error.jsx',
                    '/layout.tsx',
                    '/layout.jsx',
                    '/not-found.tsx',
                    '/not-found.jsx'
                ];

                if(specialNextJsFiles.some(pattern => filename.endsWith(pattern))) {
                    return;
                }

                // Only report for real components we've identified
                if(implementedComponents.size === 0 && !componentName) {
                    return;
                }

                // Get the name of what's being exported
                let exportedName = '';
                if(node.declaration && node.declaration.type === 'Identifier') {
                    exportedName = node.declaration.name;
                } else if(node.declaration &&
                    node.declaration.type === 'FunctionDeclaration' &&
                    node.declaration.id) {
                    exportedName = node.declaration.id.name;
                }

                // Only report if it's a known component
                if(implementedComponents.has(exportedName) || exportedName === componentName) {
                    context.report({
                        node,
                        message: `Default exports are not allowed. Use named exports instead: 'export function ${exportedName}()' or 'export { ${exportedName} }'.`,
                        fix(fixer) {
                            if(!hasNamedExport) {
                                // Remove the default export statement entirely
                                return fixer.remove(node);
                            }
                        }
                    });
                }
            },

            // Ensure components have a named export
            'Program:exit'(node) {
                // Get all the components we found in the file
                const allComponents = new Set([...implementedComponents]);
                if(componentName) allComponents.add(componentName);

                // Skip if we didn't find any components 
                if(allComponents.size === 0) {
                    return;
                }

                const filename = context.getFilename();

                // Skip non-React files
                if(!(/\.(tsx|jsx)$/i.test(filename))) {
                    return;
                }

                // Skip if the file is in node_modules
                if(filename.includes('node_modules')) {
                    return;
                }

                // Skip Next.js special files
                const specialNextJsFiles = [
                    '/page.tsx',
                    '/page.jsx',
                    '/error.tsx',
                    '/error.jsx',
                    '/layout.tsx',
                    '/layout.jsx',
                    '/not-found.tsx',
                    '/not-found.jsx'
                ];

                if(specialNextJsFiles.some(pattern => filename.endsWith(pattern))) {
                    return;
                }

                // For each component we've identified, ensure it has a named export
                if(!hasNamedExport && componentName) {
                    // Named export is required
                    context.report({
                        node: node,
                        message: `Component "${componentName}" is missing a named export. Add "export { ${componentName} };" or export the function directly with "export function ${componentName}".`,
                        fix(fixer) {
                            return fixer.insertTextAfterRange(
                                [0, context.getSourceCode().getText().length],
                                `\n\n// Export - Named\nexport { ${componentName} };\n`
                            );
                        }
                    });
                }
            }
        };
    },
};

export default ReactNoDefaultExportRule;