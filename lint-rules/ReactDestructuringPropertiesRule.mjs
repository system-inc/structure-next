// ESLint rule to prevent destructuring in function parameters for React components
// Allows destructuring only when spreading remaining properties to another element
// Spread variables must end in 'Properties' and be semantically named
const ReactDestructuringPropertiesRule = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Prevent destructuring in function parameters unless spreading remaining properties with semantic naming',
            category: 'Best Practices',
            recommended: true,
        },
        fixable: null,
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
    node.params.forEach(parameter => {
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

// Helper function to validate component props destructuring
function validateComponentPropsDestructuring(param, functionNode) {
    // Check if there's a rest element (spread)
    const restElement = param.properties.find(prop => prop.type === 'RestElement');

    if(!restElement) {
        return {
            isValid: false,
            message: 'Destructuring in function parameters is only allowed when spreading remaining properties. Use direct property access (properties.propName) instead.'
        };
    }

    // Check if rest element name ends with 'Properties'
    const restElementName = restElement.argument.name;
    if(!restElementName.endsWith('Properties')) {
        return {
            isValid: false,
            message: `Spread variable '${restElementName}' must end with 'Properties'. Use a semantic name like 'buttonProperties' or 'divProperties'.`
        };
    }

    // Check if rest element name is semantically meaningful (not generic)
    const genericNames = ['restProperties', 'otherProperties', 'remainingProperties', 'extraProperties'];
    if(genericNames.includes(restElementName)) {
        return {
            isValid: false,
            message: `Spread variable '${restElementName}' must be semantically named for the target element (e.g., 'buttonProperties', 'inputProperties').`
        };
    }

    // Check if the spread is actually used in the function body
    const isSpreadUsed = checkIfSpreadIsUsed(functionNode, restElementName);
    if(!isSpreadUsed) {
        return {
            isValid: false,
            message: `Spread variable '${restElementName}' is not used. Remove destructuring and use direct property access instead.`
        };
    }

    return {
        isValid: true,
        message: ''
    };
}

// Helper function to check if the spread variable is actually used in JSX
function checkIfSpreadIsUsed(functionNode, spreadName) {
    let isUsed = false;

    // Walk through the function body to find spread usage
    function checkNode(node) {
        if(!node || isUsed) return;

        // Check for JSX spread attributes with direct identifier
        if(node.type === 'JSXSpreadAttribute' &&
            node.argument &&
            node.argument.type === 'Identifier' &&
            node.argument.name === spreadName) {
            isUsed = true;
            return;
        }

        // Check for JSX spread attributes with type assertion (TypeScript)
        // Pattern: {...(variableName as SomeType)}
        if(node.type === 'JSXSpreadAttribute' &&
            node.argument &&
            node.argument.type === 'TSAsExpression' &&
            node.argument.expression &&
            node.argument.expression.type === 'Identifier' &&
            node.argument.expression.name === spreadName) {
            isUsed = true;
            return;
        }

        // Check for JSX spread attributes with parenthesized expression
        // Pattern: {...(variableName)}
        if(node.type === 'JSXSpreadAttribute' &&
            node.argument &&
            node.argument.type === 'ParenthesizedExpression' &&
            node.argument.expression &&
            node.argument.expression.type === 'Identifier' &&
            node.argument.expression.name === spreadName) {
            isUsed = true;
            return;
        }

        // Check for regular spread element
        if(node.type === 'SpreadElement' &&
            node.argument &&
            node.argument.type === 'Identifier' &&
            node.argument.name === spreadName) {
            isUsed = true;
            return;
        }

        // Check for spread element with type assertion
        if(node.type === 'SpreadElement' &&
            node.argument &&
            node.argument.type === 'TSAsExpression' &&
            node.argument.expression &&
            node.argument.expression.type === 'Identifier' &&
            node.argument.expression.name === spreadName) {
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
                    } else if(child && typeof child === 'object') {
                        checkNode(child);
                    }
                }
            }
        }
    }

    checkNode(functionNode.body);
    return isUsed;
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
            callee.object && callee.object.name === 'React' &&
            callee.property && callee.property.name &&
            callee.property.name.startsWith('use')
        );
    }

    return false;
}

// Export - Default
export default ReactDestructuringPropertiesRule;