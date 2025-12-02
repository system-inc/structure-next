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

        // Track components that are defined inside other functions (like hooks)
        // These don't need exports since they're internal helper components
        const nestedComponents = new Set();

        // Determine if this is a page.tsx file that requires default export
        const filename = context.getFilename();
        const isPageFile = filename.endsWith('/page.tsx') || filename.endsWith('/page.jsx');

        // Other Next.js special files which have their own export patterns
        const specialNextJsFiles = [
            '/error.tsx',
            '/error.jsx',
            '/global-error.tsx',
            '/global-error.jsx',
            '/layout.tsx',
            '/layout.jsx',
            '/not-found.tsx',
            '/not-found.jsx',
        ];

        const isSpecialNextJsFile = specialNextJsFiles.some((pattern) => filename.endsWith(pattern));

        return {
            // Detect React components with React.forwardRef
            VariableDeclarator(node) {
                // Check for patterns like: const MyComponent = React.forwardRef(...
                if(
                    node.id?.type === 'Identifier' &&
                    node.init?.type === 'CallExpression' &&
                    node.init.callee?.type === 'MemberExpression' &&
                    node.init.callee.object?.name === 'React' &&
                    node.init.callee.property?.name === 'forwardRef'
                ) {
                    // If the variable name starts with an uppercase letter, it's likely a component
                    if(/^[A-Z]/.test(node.id.name)) {
                        implementedComponents.add(node.id.name);

                        // Set as the component name if we don't have one yet
                        if(!componentName) {
                            componentName = node.id.name;
                        }

                        // Check if this is already a named export via 'export const X = React.forwardRef(...)'
                        if(node.parent?.parent?.type === 'ExportNamedDeclaration') {
                            hasNamedExport = true;
                        }
                    }
                }
            },

            // Check for function components defined as function declarations
            FunctionDeclaration(node) {
                const functionName = node.id?.name;

                // Skip functions without names
                if(!functionName) {
                    return;
                }

                // Special check for Next.js page components
                const isPageFunction =
                    functionName === 'Page' && (filename.endsWith('/page.tsx') || filename.endsWith('/page.jsx'));

                // For regular components, require uppercase first letter
                if(!isPageFunction && !/^[A-Z]/.test(functionName)) {
                    return;
                }

                // Check if this function is nested inside another function
                // Walk up the parent chain to see if we're inside a function body
                let isNested = false;
                let parent = node.parent;
                while(parent) {
                    if(
                        parent.type === 'FunctionDeclaration' ||
                        parent.type === 'FunctionExpression' ||
                        parent.type === 'ArrowFunctionExpression'
                    ) {
                        isNested = true;
                        break;
                    }
                    parent = parent.parent;
                }

                // Check if this is a React component by looking at the return value or JSX usage
                let isReactComponent = false;

                // Look at the function body
                if(node.body?.type === 'BlockStatement') {
                    // Check function parameters for props/properties pattern
                    if(node.params?.length > 0) {
                        const firstParam = node.params[0];
                        if(
                            firstParam.type === 'Identifier' &&
                            (firstParam.name === 'properties' || firstParam.name === 'props')
                        ) {
                            isReactComponent = true;
                        }
                    }

                    // Check return statements for JSX elements (common in React components)
                    const returnStatements = node.body.body.filter((stmt) => stmt.type === 'ReturnStatement');

                    if(returnStatements.length > 0) {
                        const returnValue = returnStatements[0].argument;
                        if(
                            returnValue &&
                            (returnValue.type === 'JSXElement' ||
                                returnValue.type === 'JSXFragment' ||
                                (returnValue.type === 'ConditionalExpression' &&
                                    (returnValue.consequent.type === 'JSXElement' ||
                                        returnValue.alternate.type === 'JSXElement')))
                        ) {
                            isReactComponent = true;
                        }
                    }
                }

                // Check if this is a Next.js Page component by name
                const isNextJsPageFunction =
                    functionName === 'Page' && (filename.endsWith('/page.tsx') || filename.endsWith('/page.jsx'));

                // Mark it as a component if it's either a React component or a Page function
                if(isReactComponent || isNextJsPageFunction) {
                    implementedComponents.add(functionName);

                    // If it's nested inside another function, mark it as such
                    if(isNested) {
                        nestedComponents.add(functionName);
                    }

                    // Set as the main component if we don't have one yet (and it's not nested)
                    if(!componentName && !isNested) {
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
                    if(node.declaration.type === 'FunctionDeclaration' && node.declaration.id) {
                        const name = node.declaration.id.name;
                        if(implementedComponents.has(name) || name === componentName) {
                            hasNamedExport = true;
                        }
                    }
                    // If exporting a variable declaration (like const ComponentName = React.forwardRef(...))
                    else if(
                        node.declaration.type === 'VariableDeclaration' &&
                        node.declaration.declarations &&
                        node.declaration.declarations.length > 0
                    ) {
                        // Check each variable declared
                        node.declaration.declarations.forEach(function (declaration) {
                            if(declaration.id && declaration.id.type === 'Identifier') {
                                const name = declaration.id.name;
                                if(implementedComponents.has(name) || name === componentName) {
                                    hasNamedExport = true;
                                }
                            }
                        });
                    }
                }
                // Check for named exports with specifiers (export { Component }) - NOT ALLOWED
                else if(node.specifiers && node.specifiers.length > 0) {
                    for(const specifier of node.specifiers) {
                        if(
                            specifier.exported &&
                            (implementedComponents.has(specifier.exported.name) ||
                                specifier.exported.name === componentName)
                        ) {
                            // This is a named export at the bottom - report as error
                            context.report({
                                node,
                                message: `Named exports at the bottom are not allowed. Export components directly when defining them: 'export function ${specifier.exported.name}(properties) {...}' instead of 'export { ${specifier.exported.name} }'.`,
                                fix(fixer) {
                                    // Remove the export statement - direct export should be added separately
                                    return fixer.remove(node);
                                },
                            });

                            // Don't mark as having export since this is the wrong type
                            // hasNamedExport = true;
                            break;
                        }
                    }
                }
            },

            // Check for default exports and track/report depending on file type
            ExportDefaultDeclaration(node) {
                // Skip non-React files and node_modules
                if(!/\.(tsx|jsx)$/i.test(filename) || filename.includes('node_modules')) {
                    return;
                }

                // Track that we found a default export
                hasDefaultExport = true;

                // Get the name of what's being exported
                let exportedName = '';
                if(node.declaration?.type === 'Identifier') {
                    exportedName = node.declaration.name;
                }
                else if(node.declaration?.type === 'FunctionDeclaration' && node.declaration.id) {
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
                        },
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
                if(!/\.(tsx|jsx)$/i.test(filename)) {
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
                                    `\n\n// Export - Default (required for Next.js pages)\nexport default ${pageComponentName};\n`,
                                );
                            },
                        });
                    }
                    else {
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
                // UNLESS the component is nested inside another function (like a hook)
                if(
                    !hasNamedExport &&
                    componentName &&
                    !isPageFile &&
                    !isSpecialNextJsFile &&
                    !nestedComponents.has(componentName)
                ) {
                    // Named export is required for regular components
                    context.report({
                        node: node,
                        message: `Component "${componentName}" is missing a named export. Export the function directly with "export function ${componentName}(properties) {...}" instead of adding exports at the bottom.`,
                        fix(fixer) {
                            // Find the function declaration in the AST and add export keyword
                            const sourceCode = context.getSourceCode();
                            let functionNode = null;

                            // Look for the function or variable declaration with cycle prevention
                            const visited = new Set();
                            function findComponentDeclaration(node) {
                                if(!node || typeof node !== 'object' || visited.has(node)) {
                                    return;
                                }
                                visited.add(node);

                                // Look for function declarations
                                if(node.type === 'FunctionDeclaration' && node.id && node.id.name === componentName) {
                                    functionNode = node;
                                    return;
                                }

                                // Look for variable declarations (like const Button = React.forwardRef(...))
                                if(node.type === 'VariableDeclarator' && node.id?.name === componentName) {
                                    // Find the parent VariableDeclaration
                                    let parent = node.parent;
                                    while(parent && parent.type !== 'VariableDeclaration') {
                                        parent = parent.parent;
                                    }
                                    functionNode = parent;
                                    if(functionNode) {
                                        return;
                                    }
                                }

                                // Only search specific AST properties to avoid cycles
                                const searchableKeys = ['body', 'declarations', 'declaration'];
                                for(const key of searchableKeys) {
                                    if(node[key]) {
                                        if(Array.isArray(node[key])) {
                                            for(const child of node[key]) {
                                                findComponentDeclaration(child);
                                                if(functionNode) return;
                                            }
                                        }
                                        else {
                                            findComponentDeclaration(node[key]);
                                            if(functionNode) return;
                                        }
                                    }
                                }
                            }

                            findComponentDeclaration(node);

                            if(functionNode) {
                                // Add export keyword before function
                                return fixer.insertTextBefore(functionNode, 'export ');
                            }
                            else {
                                // Fallback: add export at the end (this shouldn't happen but provides safety)
                                return fixer.insertTextAfterRange(
                                    [0, sourceCode.getText().length],
                                    `\n\n\nexport { ${componentName} };\n`,
                                );
                            }
                        },
                    });
                }
            },
        };
    },
};

export default ReactExportRule;
