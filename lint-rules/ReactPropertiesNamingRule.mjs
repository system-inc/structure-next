// ESLint rule to enforce React naming conventions for properties
// 1. Component parameters should be named "properties" instead of "props"
// 2. Component property interfaces/types must end with "Properties"
// 3. No identifiers can end with "Prop" or "Props" 
const ReactPropertiesNamingRule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Enforce React property naming: use "properties" parameter, types end with "Properties", no "Prop"/"Props" suffixes',
            category: 'Stylistic Issues',
            recommended: true,
        },
        fixable: 'code',
        schema: [],
    },
    create(context) {
        // Only apply this rule to TSX files (React components)
        const filename = context.getFilename();
        if(!filename.endsWith('.tsx')) {
            return {};
        }

        // Track component property types that need to be renamed
        const componentPropTypes = new Set();

        // Check if a name likely belongs to a React component 
        function isLikelyComponentName(name) {
            // Component names should be PascalCase and not start with "use" (which would be a hook)
            return /^[A-Z][A-Za-z0-9]*$/.test(name) && !name.startsWith('use');
        }

        // Helper function to check if identifier ends with Prop/Props and suggest fix
        function checkPropertyNaming(node, name) {

            if(name.endsWith('Prop') && !name.endsWith('Properties')) {
                const suggestedName = name.replace(/Prop$/, 'Property');
                context.report({
                    node: node,
                    message: `Identifier "${name}" should not end with "Prop". Use "${suggestedName}".`,
                    fix(fixer) {
                        return fixer.replaceText(node, suggestedName);
                    }
                });
            } else if(name.endsWith('Props') && !name.endsWith('Properties')) {
                const suggestedName = name.replace(/Props$/, 'Properties');
                context.report({
                    node: node,
                    message: `Identifier "${name}" should not end with "Props". Use "${suggestedName}".`,
                    fix(fixer) {
                        return fixer.replaceText(node, suggestedName);
                    }
                });
            }
        }

        // Function to check if node is likely a React component
        function isReactComponent(node) {
            // If function name starts with uppercase letter, it's likely a component
            if(node.id && node.id.name && /^[A-Z]/.test(node.id.name)) {
                return true;
            }

            // For arrow functions or anonymous functions assigned to variables
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

        // Function to check React component parameters for "props" naming
        function checkPropertiesParameter(node) {
            // Skip functions with no params
            if(!node.params || node.params.length === 0) {
                return;
            }

            // Only check the first parameter for React components
            const firstParam = node.params[0];

            // Only report if it's a React component and parameter is specifically named "props"
            if(isReactComponent(node) && firstParam.type === 'Identifier' && firstParam.name === 'props') {
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

            // Check all identifiers for Prop/Props naming
            Identifier(node) {
                // Skip if this identifier is part of a React.* member expression
                if(node.parent &&
                    node.parent.type === 'MemberExpression' &&
                    node.parent.object &&
                    node.parent.object.name === 'React') {
                    return;
                }

                // Skip if this identifier is part of a React.* TypeScript type reference 
                if(node.parent &&
                    node.parent.type === 'TSQualifiedName' &&
                    node.parent.left &&
                    node.parent.left.name === 'React') {
                    return;
                }

                // Skip if this identifier is being imported (external library names we can't control)
                if(node.parent &&
                    (node.parent.type === 'ImportSpecifier' ||
                        node.parent.type === 'ImportDefaultSpecifier' ||
                        node.parent.type === 'ImportNamespaceSpecifier')) {
                    return;
                }

                checkPropertyNaming(node, node.name);
            },

            // First pass: Identify component property types

            // React components defined as function declarations
            FunctionDeclaration(node) {
                // Check for props parameter naming
                checkPropertiesParameter(node);

                // Skip if not a component (not PascalCase or starts with "use")
                if(!node.id || !isLikelyComponentName(node.id.name)) {
                    return;
                }

                // Check first parameter type annotation (where props would be)
                if(node.params.length > 0 &&
                    node.params[0].typeAnnotation &&
                    node.params[0].typeAnnotation.typeAnnotation &&
                    node.params[0].typeAnnotation.typeAnnotation.type === 'TSTypeReference' &&
                    node.params[0].typeAnnotation.typeAnnotation.typeName &&
                    node.params[0].typeAnnotation.typeAnnotation.typeName.type === 'Identifier') {

                    const typeName = node.params[0].typeAnnotation.typeAnnotation.typeName;
                    const typeNameStr = typeName.name;

                    // If it doesn't end with 'Properties', add to our Set for later checking
                    if(!typeNameStr.endsWith('Properties')) {
                        componentPropTypes.add(typeNameStr);

                        // Report and fix usage at component declaration
                        // Get the current suffix by matching the end of the string
                        const match = typeNameStr.match(/[A-Z][a-z]+$/);
                        const currentSuffix = match ? match[0] : '';

                        context.report({
                            node: typeName,
                            message: currentSuffix ?
                                `React component property type should end with "Properties" instead of "${currentSuffix}"` :
                                `React component property type should end with "Properties"`,
                            fix(fixer) {
                                let newName;
                                if(typeNameStr.endsWith('Interface')) {
                                    newName = typeNameStr.replace(/Interface$/, 'Properties');
                                } else if(typeNameStr.endsWith('Props')) {
                                    newName = typeNameStr.replace(/Props$/, 'Properties');
                                } else {
                                    newName = `${typeNameStr}Properties`;
                                }
                                return fixer.replaceText(typeName, newName);
                            }
                        });
                    }
                }
            },

            // React components defined as arrow functions or function expressions in variable declarations
            VariableDeclarator(node) {
                // Check for props parameter naming in function expressions/arrow functions
                if(node.init && (node.init.type === 'ArrowFunctionExpression' || node.init.type === 'FunctionExpression')) {
                    checkPropertiesParameter(node.init);
                }

                // Skip if not a component (not PascalCase or starts with "use")
                if(!node.id || !isLikelyComponentName(node.id.name)) {
                    return;
                }

                // Skip if not a function expression or arrow function
                if(!node.init || (node.init.type !== 'ArrowFunctionExpression' && node.init.type !== 'FunctionExpression')) {
                    return;
                }

                // Check first parameter type annotation (where props would be)
                if(node.init.params.length > 0 &&
                    node.init.params[0].typeAnnotation &&
                    node.init.params[0].typeAnnotation.typeAnnotation &&
                    node.init.params[0].typeAnnotation.typeAnnotation.type === 'TSTypeReference' &&
                    node.init.params[0].typeAnnotation.typeAnnotation.typeName &&
                    node.init.params[0].typeAnnotation.typeAnnotation.typeName.type === 'Identifier') {

                    const typeName = node.init.params[0].typeAnnotation.typeAnnotation.typeName;
                    const typeNameStr = typeName.name;

                    // If it doesn't end with 'Properties', add to our Set for later checking
                    if(!typeNameStr.endsWith('Properties')) {
                        componentPropTypes.add(typeNameStr);

                        // Report and fix usage at component declaration
                        // Get the current suffix by matching the end of the string
                        const match = typeNameStr.match(/[A-Z][a-z]+$/);
                        const currentSuffix = match ? match[0] : '';

                        context.report({
                            node: typeName,
                            message: currentSuffix ?
                                `React component property type should end with "Properties" instead of "${currentSuffix}"` :
                                `React component property type should end with "Properties"`,
                            fix(fixer) {
                                let newName;
                                if(typeNameStr.endsWith('Interface')) {
                                    newName = typeNameStr.replace(/Interface$/, 'Properties');
                                } else if(typeNameStr.endsWith('Props')) {
                                    newName = typeNameStr.replace(/Props$/, 'Properties');
                                } else {
                                    newName = `${typeNameStr}Properties`;
                                }
                                return fixer.replaceText(typeName, newName);
                            }
                        });
                    }
                }
            },

            // Second pass: Flag and fix the interface declarations themselves

            // Interface declarations
            TSInterfaceDeclaration(node) {
                const name = node.id.name;

                // Only target interfaces that we've identified as component property types
                // This ensures we only rename interfaces actually used as React component props
                if(componentPropTypes.has(name) && !name.endsWith('Properties')) {
                    // Get the current suffix by matching the end of the string
                    const match = name.match(/[A-Z][a-z]+$/);
                    const currentSuffix = match ? match[0] : '';

                    context.report({
                        node: node.id,
                        message: currentSuffix ?
                            `Interface used as React component property type should end with "Properties" instead of "${currentSuffix}"` :
                            `Interface used as React component property type should end with "Properties"`,
                        fix(fixer) {
                            let newName;
                            if(name.endsWith('Interface')) {
                                newName = name.replace(/Interface$/, 'Properties');
                            } else if(name.endsWith('Props')) {
                                newName = name.replace(/Props$/, 'Properties');
                            } else {
                                newName = `${name}Properties`;
                            }
                            return fixer.replaceText(node.id, newName);
                        }
                    });
                }
            },

            // Type alias declarations
            TSTypeAliasDeclaration(node) {
                const name = node.id.name;

                // Only target types that we've identified as component property types
                // This ensures we only rename types actually used as React component props
                if(componentPropTypes.has(name) && !name.endsWith('Properties')) {
                    // Get the current suffix by matching the end of the string
                    const match = name.match(/[A-Z][a-z]+$/);
                    const currentSuffix = match ? match[0] : '';

                    context.report({
                        node: node.id,
                        message: currentSuffix ?
                            `Type used as React component property type should end with "Properties" instead of "${currentSuffix}"` :
                            `Type used as React component property type should end with "Properties"`,
                        fix(fixer) {
                            let newName;
                            if(name.endsWith('Interface')) {
                                newName = name.replace(/Interface$/, 'Properties');
                            } else if(name.endsWith('Props')) {
                                newName = name.replace(/Props$/, 'Properties');
                            } else {
                                newName = `${name}Properties`;
                            }
                            return fixer.replaceText(node.id, newName);
                        }
                    });
                }
            }
        };
    }
};

// Export - Default
export default ReactPropertiesNamingRule;
