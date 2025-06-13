// ESLint rule to prevent destructuring in function parameters for React components
// Allows destructuring only when spreading remaining properties to another element
// Spread variables must end in 'Properties' and be semantically named
const ReactDestructuringPropertiesRule = {
    meta: {
        type: 'problem',
        docs: {
            description:
                'Prevent destructuring in function parameters unless spreading remaining properties with semantic naming',
            category: 'Best Practices',
            recommended: true,
        },
        fixable: 'code',
        schema: [],
    },
    create(context) {
        return {
            // Check function declarations
            FunctionDeclaration(node) {
                checkDestructuringInParameters(node, context);
            },
            // Check arrow function expressions
            ArrowFunctionExpression(node) {
                checkDestructuringInParameters(node, context);
            },
            // Check function expressions
            FunctionExpression(node) {
                checkDestructuringInParameters(node, context);
            },
            // Check variable declarations for destructuring assignments
            VariableDeclarator(node) {
                checkDestructuringAssignment(node, context);
            },
        };
    },
};

// Helper function to check if any parameter uses destructuring
function checkDestructuringInParameters(node, context) {
    // Skip functions with no params
    if(!node.params || node.params.length === 0) {
        return;
    }

    // Check each parameter
    node.params.forEach((parameter) => {
        // Check for object pattern (destructuring)
        if(parameter.type === 'ObjectPattern') {
            // This is a special case - allow React.useState destructuring
            const isHookAssignment = isReactHookDestructuring(parameter);

            // If it's not a hook assignment, check if it's valid component prop destructuring
            if(!isHookAssignment) {
                const validationResult = validateComponentPropsDestructuring(parameter, node);

                if(!validationResult.isValid) {
                    context.report({
                        node: parameter,
                        message: validationResult.message,
                    });
                }
            }
        }
    });
}

// Helper function to check destructuring assignments in function bodies
function checkDestructuringAssignment(node, context) {
    // Check if this is destructuring from an identifier (like properties)
    if(node.id && node.id.type === 'ObjectPattern' && node.init && node.init.type === 'Identifier') {
        // Common property names we want to prevent destructuring from
        const sourceVariableNames = ['properties', 'props'];

        if(sourceVariableNames.includes(node.init.name)) {
            // Check if there's a rest element (spread)
            const restElement = node.id.properties.find((prop) => prop.type === 'RestElement');

            if(!restElement) {
                // Get the destructured property names for the error message
                const destructuredProps = node.id.properties
                    .filter((prop) => prop.type === 'Property' && prop.key)
                    .map((prop) => prop.key.name);

                context.report({
                    node: node.id,
                    message: `Destructuring ${destructuredProps.join(', ')} from ${
                        node.init.name
                    } is not allowed without spreading remaining properties. Use ${
                        node.init.name
                    }.${destructuredProps.join(`, ${node.init.name}.`)} directly or destructure with semantic spread.`,
                });
            }
            else {
                // Find the containing function to check if spread is used
                const containingFunction = findContainingFunction(node);
                const validationResult = validateComponentPropsDestructuring(node.id, containingFunction);
                if(!validationResult.isValid) {
                    context.report({
                        node: node.id,
                        message: validationResult.message,
                    });
                }
            }
        }
    }

    // Check for simple property assignments like: const ticket = properties.ticket
    // Only check const declarations, not let declarations
    if(
        node.parent &&
        node.parent.kind === 'const' &&
        node.id &&
        node.id.type === 'Identifier' &&
        node.init &&
        node.init.type === 'MemberExpression' &&
        node.init.object &&
        node.init.object.type === 'Identifier'
    ) {
        const sourceVariableNames = ['properties', 'props'];

        if(sourceVariableNames.includes(node.init.object.name)) {
            const propertyName = node.init.property.name;
            const variableName = node.id.name;
            const sourceVariable = node.init.object.name;

            // Check if this variable is used in a React hook dependency array
            const isUsedInHookDependency = checkIfUsedInHookDependency(node, variableName);

            // Skip if used in React hook dependencies to avoid react-hooks/exhaustive-deps conflicts
            if(isUsedInHookDependency) {
                return;
            }

            context.report({
                node: node,
                message: `Avoid creating unnecessary variable '${variableName}'. Use '${sourceVariable}.${propertyName}' directly instead of assigning it to a new variable. Only extract properties for React hook dependencies.`,
                fix(fixer) {
                    // Find all references to this variable in the scope and replace them
                    const sourceCode = context.sourceCode || context.getSourceCode();
                    const scope = sourceCode.getScope(node);
                    const variable = scope.variables.find((v) => v.name === variableName);

                    if(!variable) {
                        return null;
                    }

                    const fixes = [];

                    // Remove the variable declaration
                    fixes.push(fixer.remove(node.parent));

                    // Replace all references with direct property access
                    variable.references.forEach((ref) => {
                        if(ref.identifier !== node.id) {
                            // Skip the declaration itself
                            fixes.push(fixer.replaceText(ref.identifier, `${sourceVariable}.${propertyName}`));
                        }
                    });

                    return fixes;
                },
            });
        }
    }
}

// Helper function to validate component props destructuring
function validateComponentPropsDestructuring(param, functionNode) {
    // Check if there's a rest element (spread)
    const restElement = param.properties.find((prop) => prop.type === 'RestElement');

    if(!restElement) {
        return {
            isValid: false,
            message:
                'Destructuring in function parameters is only allowed when spreading remaining properties. Use direct property access (properties.propName) instead.',
        };
    }

    // Check if rest element name ends with 'Properties'
    const restElementName = restElement.argument.name;
    if(!restElementName.endsWith('Properties')) {
        return {
            isValid: false,
            message: `Spread variable '${restElementName}' must end with 'Properties'. Use a semantic name like 'buttonProperties' or 'divProperties'.`,
        };
    }

    // Check if rest element name is semantically meaningful (not generic)
    const genericNames = ['restProperties', 'otherProperties', 'remainingProperties', 'extraProperties'];
    if(genericNames.includes(restElementName)) {
        return {
            isValid: false,
            message: `Spread variable '${restElementName}' must be semantically named for the target element (e.g., 'buttonProperties', 'inputProperties').`,
        };
    }

    // Check if the spread is actually used in the function body
    const isSpreadUsed = checkIfSpreadIsUsed(functionNode, restElementName);
    if(!isSpreadUsed) {
        return {
            isValid: false,
            message: `Spread variable '${restElementName}' is not used. Remove destructuring and use direct property access instead.`,
        };
    }

    return {
        isValid: true,
        message: '',
    };
}

// Helper function to check if the spread variable is actually used in JSX
function checkIfSpreadIsUsed(functionNode, spreadName) {
    let isUsed = false;

    // Walk through the function body to find spread usage
    function checkNode(node) {
        if(!node || isUsed) return;

        // Check for JSX spread attributes with direct identifier
        if(
            node.type === 'JSXSpreadAttribute' &&
            node.argument &&
            node.argument.type === 'Identifier' &&
            node.argument.name === spreadName
        ) {
            isUsed = true;
            return;
        }

        // Check for JSX spread attributes with type assertion (TypeScript)
        // Pattern: {...(variableName as SomeType)}
        if(
            node.type === 'JSXSpreadAttribute' &&
            node.argument &&
            node.argument.type === 'TSAsExpression' &&
            node.argument.expression &&
            node.argument.expression.type === 'Identifier' &&
            node.argument.expression.name === spreadName
        ) {
            isUsed = true;
            return;
        }

        // Check for JSX spread attributes with parenthesized expression
        // Pattern: {...(variableName)}
        if(
            node.type === 'JSXSpreadAttribute' &&
            node.argument &&
            node.argument.type === 'ParenthesizedExpression' &&
            node.argument.expression &&
            node.argument.expression.type === 'Identifier' &&
            node.argument.expression.name === spreadName
        ) {
            isUsed = true;
            return;
        }

        // Check for regular spread element
        if(
            node.type === 'SpreadElement' &&
            node.argument &&
            node.argument.type === 'Identifier' &&
            node.argument.name === spreadName
        ) {
            isUsed = true;
            return;
        }

        // Check for spread element with type assertion
        if(
            node.type === 'SpreadElement' &&
            node.argument &&
            node.argument.type === 'TSAsExpression' &&
            node.argument.expression &&
            node.argument.expression.type === 'Identifier' &&
            node.argument.expression.name === spreadName
        ) {
            isUsed = true;
            return;
        }

        // Recursively check child nodes
        if(typeof node === 'object') {
            for(const key in node) {
                if(key !== 'parent' && !isUsed) {
                    const child = node[key];
                    if(Array.isArray(child)) {
                        child.forEach(checkNode);
                    }
                    else if(child && typeof child === 'object') {
                        checkNode(child);
                    }
                }
            }
        }
    }

    // Check if functionNode and its body exist before proceeding
    if(functionNode && functionNode.body) {
        checkNode(functionNode.body);
    }
    return isUsed;
}

// Helper function to find the containing function node
function findContainingFunction(node) {
    let current = node.parent;
    while(current) {
        if(
            current.type === 'FunctionDeclaration' ||
            current.type === 'FunctionExpression' ||
            current.type === 'ArrowFunctionExpression'
        ) {
            return current;
        }
        current = current.parent;
    }
    return null;
}

// Helper function to check if destructuring is for a React hook
function isReactHookDestructuring(node) {
    // Skip if not in a variable declaration
    if(!node.parent || node.parent.type !== 'VariableDeclarator') {
        return false;
    }

    // Check if right side is a call expression
    const rightSide = node.parent.init;
    if(!rightSide || rightSide.type !== 'CallExpression') {
        return false;
    }

    // Check if the call is to a React hook
    const callee = rightSide.callee;
    if(callee.type === 'MemberExpression') {
        return (
            callee.object &&
            callee.object.name === 'React' &&
            callee.property &&
            callee.property.name &&
            callee.property.name.startsWith('use')
        );
    }

    return false;
}

// Helper function to check if a variable is used in a React hook dependency array
function checkIfUsedInHookDependency(node, variableName) {
    // Find the containing function
    let functionNode = node.parent;
    while(
        functionNode &&
        functionNode.type !== 'FunctionDeclaration' &&
        functionNode.type !== 'FunctionExpression' &&
        functionNode.type !== 'ArrowFunctionExpression'
    ) {
        functionNode = functionNode.parent;
    }

    if(!functionNode || !functionNode.body) {
        return false;
    }

    let isUsedInHookDep = false;

    // Check for React hook calls with dependency arrays
    function checkNode(currentNode) {
        if(!currentNode || isUsedInHookDep) return;

        // Check for React hook calls (React.useCallback, React.useMemo, React.useEffect, etc.)
        if(
            currentNode.type === 'CallExpression' &&
            currentNode.callee &&
            currentNode.callee.type === 'MemberExpression' &&
            currentNode.callee.object &&
            currentNode.callee.object.name === 'React' &&
            currentNode.callee.property &&
            currentNode.callee.property.name &&
            currentNode.callee.property.name.startsWith('use')
        ) {
            // Check if it has a dependency array (second argument)
            if(currentNode.arguments && currentNode.arguments.length >= 2) {
                const depArray = currentNode.arguments[1];

                // Check if the dependency array is an array expression
                if(depArray.type === 'ArrayExpression' && depArray.elements) {
                    // Check if our variable is in the dependency array
                    for(const element of depArray.elements) {
                        if(element && element.type === 'Identifier' && element.name === variableName) {
                            isUsedInHookDep = true;
                            return;
                        }
                    }
                }
            }
        }

        // Recursively check child nodes
        if(typeof currentNode === 'object') {
            for(const key in currentNode) {
                if(key !== 'parent' && !isUsedInHookDep) {
                    const child = currentNode[key];
                    if(Array.isArray(child)) {
                        child.forEach(checkNode);
                    }
                    else if(child && typeof child === 'object') {
                        checkNode(child);
                    }
                }
            }
        }
    }

    checkNode(functionNode.body);
    return isUsedInHookDep;
}

// Export - Default
export default ReactDestructuringPropertiesRule;
