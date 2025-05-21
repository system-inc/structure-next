// ESLint rule to enforce React component property interfaces/types ending with "Properties"
// This ensures consistency in component property type naming
const ReactComponentPropertiesTypeNamingRule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Enforce React component property types/interfaces to end with "Properties"',
            category: 'Stylistic Issues',
            recommended: true,
        },
        fixable: 'code',
        schema: [],
    },
    create(context) {
        // Track component property types that need to be renamed
        const componentPropTypes = new Set();

        // Check if a name likely belongs to a React component 
        function isLikelyComponentName(name) {
            // Component names should be PascalCase and not start with "use" (which would be a hook)
            return /^[A-Z][A-Za-z0-9]*$/.test(name) && !name.startsWith('use');
        }

        return {
            // First pass: Identify component property types

            // React components defined as function declarations
            FunctionDeclaration(node) {
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

export default ReactComponentPropertiesTypeNamingRule;