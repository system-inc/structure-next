// ESLint rule to enforce export patterns for React component files
// - Enforces named exports for most React components
// - Requires default exports for Next.js page files (page.tsx)
const ReactExportRule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Enforce named exports for most components and default exports for page.tsx files',
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
        let hasDefaultExport = false;

        // Track actual component implementations we find
        const implementedComponents = new Set();

        // Determine if this is a page.tsx file that requires default export
        const filename = context.getFilename();
        const isPageFile = filename.endsWith('/page.tsx') || filename.endsWith('/page.jsx');

        // Other Next.js special files which have their own export patterns
        const specialNextJsFiles = [
            '/error.tsx',
            '/error.jsx',
            '/layout.tsx',
            '/layout.jsx',
            '/not-found.tsx',
            '/not-found.jsx'
        ];

        const isSpecialNextJsFile = specialNextJsFiles.some(pattern => filename.endsWith(pattern));

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

                // Skip functions without names
                if(!functionName) {
                    return;
                }

                // Special check for Next.js page components
                const isPageFunction = functionName === 'Page' &&
                    (filename.endsWith('/page.tsx') || filename.endsWith('/page.jsx'));

                // For regular components, require uppercase first letter
                if(!isPageFunction && !/^[A-Z]/.test(functionName)) {
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

                // Check if this is a Next.js Page component by name
                const isNextJsPageFunction = functionName === 'Page' &&
                    (filename.endsWith('/page.tsx') || filename.endsWith('/page.jsx'));

                // Mark it as a component if it's either a React component or a Page function
                if(isReactComponent || isNextJsPageFunction) {
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

            // Check for default exports and track/report depending on file type
            ExportDefaultDeclaration(node) {
                // Skip non-React files and node_modules
                if(!(/\.(tsx|jsx)$/i.test(filename)) ||
                    filename.includes('node_modules')) {
                    return;
                }

                // Track that we found a default export
                hasDefaultExport = true;

                // Get the name of what's being exported
                let exportedName = '';
                if(node.declaration && node.declaration.type === 'Identifier') {
                    exportedName = node.declaration.name;
                } else if(node.declaration &&
                    node.declaration.type === 'FunctionDeclaration' &&
                    node.declaration.id) {
                    exportedName = node.declaration.id.name;

                    // If this is a page.tsx file and we're exporting "function Page()", record it
                    if(isPageFile && exportedName === 'Page') {
                        implementedComponents.add('Page');
                        if(!componentName) {
                            componentName = 'Page';
                        }
                    }
                }

                // For page.tsx files, default exports are required
                if(isPageFile || isSpecialNextJsFile) {
                    return; // Default exports are allowed for page.tsx
                }

                // For regular component files, default exports are not allowed
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

            // Final checks when we've seen the whole file
            'Program:exit'(node) {
                // Get all the components we found in the file
                const allComponents = new Set([...implementedComponents]);
                if(componentName) allComponents.add(componentName);

                // Skip if we didn't find any components 
                if(allComponents.size === 0) {
                    return;
                }

                // Skip non-React files
                if(!(/\.(tsx|jsx)$/i.test(filename))) {
                    return;
                }

                // Skip if the file is in node_modules
                if(filename.includes('node_modules')) {
                    return;
                }

                // For page.tsx files, check that a default export exists
                if(isPageFile && !hasDefaultExport) {
                    // Try to find the Page function specifically for page.tsx files
                    let pageComponentName = componentName;
                    if(!componentName || componentName !== 'Page') {
                        // If we haven't found a component yet, or it's not the Page component,
                        // check if 'Page' exists in the implemented components
                        if(implementedComponents.has('Page')) {
                            pageComponentName = 'Page';
                        }
                    }

                    if(pageComponentName) {
                        context.report({
                            node: node,
                            message: `Next.js page files must have a default export. Add "export default ${pageComponentName};" to the end of the file.`,
                            fix(fixer) {
                                return fixer.insertTextAfterRange(
                                    [0, context.getSourceCode().getText().length],
                                    `\n\n// Export - Default (required for Next.js pages)\nexport default ${pageComponentName};\n`
                                );
                            }
                        });
                    } else {
                        context.report({
                            node: node,
                            message: 'Next.js page files must have a default export.',
                        });
                    }
                    return;
                }

                // Skip other Next.js special files
                if(isSpecialNextJsFile) {
                    return;
                }

                // For regular component files (not Next.js special files), check that a named export exists
                if(!hasNamedExport && componentName && !isPageFile && !isSpecialNextJsFile) {
                    // Named export is required for regular components
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

export default ReactExportRule;