// ESLint rule to prevent destructuring in React components and hooks
// Allows destructuring only when spreading remaining properties to another element
// Spread variables must end in 'Properties' and be semantically named
const ReactDestructuringRule = {
    meta: {
        type: 'problem',
        docs: {
            description:
                'Prevent destructuring in React components and hooks unless spreading remaining properties with semantic naming',
            category: 'Best Practices',
            recommended: true,
        },
        fixable: 'code',
        schema: [],
    },
    create(context) {
        // Cache for performance
        const hookCallCache = new WeakMap();

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
                checkDestructuringAssignment(node, context, hookCallCache);
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

    // Check if this is a component or hook function
    const functionName = getFunctionName(node);
    const isComponent = functionName && /^[A-Z]/.test(functionName);
    const isHook = functionName && functionName.startsWith('use');

    // Only check React components and hooks
    if(!isComponent && !isHook) {
        return;
    }

    // Check each parameter
    node.params.forEach(function (parameter) {
        // Check for object pattern (destructuring)
        if(parameter.type === 'ObjectPattern') {
            const validationResult = validateParameterDestructuring(parameter, node);

            if(!validationResult.isValid) {
                context.report({
                    node: parameter,
                    message: validationResult.message,
                });
            }
        }
    });
}

// Helper function to check destructuring assignments in function bodies
function checkDestructuringAssignment(node, context, hookCallCache) {
    // Skip if not object destructuring
    if(!node.id || node.id.type !== 'ObjectPattern' || !node.init) {
        return;
    }

    // Check if we're inside a custom hook
    if(isInsideCustomHook(node)) {
        reportDestructuringInHook(node, context);
        return;
    }

    // Check different types of destructuring sources
    if(node.init.type === 'Identifier') {
        checkDestructuringFromIdentifier(node, context);
    }
    else if(node.init.type === 'CallExpression') {
        checkDestructuringFromCall(node, context, hookCallCache);
    }
    else if(node.init.type === 'MemberExpression') {
        checkSimplePropertyAssignment(node, context);
    }
}

// Check destructuring from identifiers like properties or props
function checkDestructuringFromIdentifier(node, context) {
    const sourceVariableNames = ['properties', 'props'];

    if(!sourceVariableNames.includes(node.init.name)) {
        return;
    }

    // Check if there's a rest element (spread)
    const restElement = node.id.properties.find((prop) => prop.type === 'RestElement');

    if(!restElement) {
        const destructuredProperties = getDestructuredPropertyNames(node.id);
        context.report({
            node: node.id,
            message: `Destructuring from '${node.init.name}' is not allowed. Use ${node.init.name}.${destructuredProperties[0]} directly.`,
        });
    }
    else {
        // Validate the spread usage
        const containingFunction = findContainingFunction(node);
        const validationResult = validateParameterDestructuring(node.id, containingFunction);
        if(!validationResult.isValid) {
            context.report({
                node: node.id,
                message: validationResult.message,
            });
        }
    }
}

// Check destructuring from function calls (hooks)
function checkDestructuringFromCall(node, context, hookCallCache) {
    const callInformation = getCallInformation(node.init, hookCallCache);

    if(!callInformation.isHook) {
        return;
    }

    const destructuredProps = getDestructuredPropertyNames(node.id);
    const suggestion =
        destructuredProps.length > 0
            ? `const ${callInformation.suggestedVarName} = ${callInformation.hookName}(); then use ${callInformation.suggestedVarName}.${destructuredProps[0]}`
            : `const ${callInformation.suggestedVarName} = ${callInformation.hookName}();`;

    context.report({
        node: node.id,
        message: `Destructuring from hook '${callInformation.hookName}' is not allowed. Store the result in a variable first (e.g., ${suggestion}).`,
    });
}

// Check simple property assignments like: const ticket = properties.ticket
function checkSimplePropertyAssignment(node, context) {
    // Only check const declarations
    if(!node.parent || node.parent.kind !== 'const' || node.id.type !== 'Identifier') {
        return;
    }

    const memberExpression = node.init;
    if(!memberExpression.object || memberExpression.object.type !== 'Identifier') {
        return;
    }

    const sourceVariableNames = ['properties', 'props'];
    if(!sourceVariableNames.includes(memberExpression.object.name)) {
        return;
    }

    const propertyName = memberExpression.property.name;
    const variableName = node.id.name;
    const sourceVariable = memberExpression.object.name;

    // Check if used in React hook dependencies
    if(checkIfUsedInHookDependency(node, variableName)) {
        return;
    }

    context.report({
        node: node,
        message: `Avoid extracting '${variableName}'. Use '${sourceVariable}.${propertyName}' directly.`,
        fix(fixer) {
            return fixPropertyAssignment(node, context, fixer, sourceVariable, propertyName, variableName);
        },
    });
}

// Report destructuring inside custom hooks
function reportDestructuringInHook(node, context) {
    let source = 'a value';

    if(node.init) {
        if(node.init.type === 'Identifier') {
            source = `'${node.init.name}'`;
        }
        else if(node.init.type === 'CallExpression') {
            const callInfo = getCallInformation(node.init, new WeakMap());
            source = `${callInfo.hookName || 'function'}()`;
        }
    }

    context.report({
        node: node.id,
        message: `Destructuring is not allowed inside custom hooks. Store ${source} in a variable and access properties directly.`,
    });
}

// Get information about a function call
function getCallInformation(callExpression, cache) {
    // Check cache first
    if(cache.has(callExpression)) {
        return cache.get(callExpression);
    }

    const result = {
        isHook: false,
        hookName: '',
        suggestedVarName: 'result',
    };

    const callee = callExpression.callee;

    // Direct call: useHook()
    if(callee.type === 'Identifier') {
        if(callee.name.startsWith('use')) {
            result.isHook = true;
            result.hookName = callee.name;
            // Convert useMyHook to myHookResult
            result.suggestedVarName =
                callee.name.replace(/^use/, '').charAt(0).toLowerCase() + callee.name.slice(4) + 'Result';
        }
    }
    // Member expression: React.useHook()
    else if(callee.type === 'MemberExpression' && callee.property) {
        const propName = callee.property.name;
        if(propName && propName.startsWith('use')) {
            result.isHook = true;
            result.hookName = propName;
            result.suggestedVarName =
                propName.replace(/^use/, '').charAt(0).toLowerCase() + propName.slice(4) + 'Result';
        }
    }

    cache.set(callExpression, result);
    return result;
}

// Get destructured property names from an ObjectPattern
function getDestructuredPropertyNames(pattern) {
    return pattern.properties.filter((prop) => prop.type === 'Property' && prop.key).map((prop) => prop.key.name);
}

// Get the name of a function
function getFunctionName(node) {
    if(node.id) {
        return node.id.name;
    }

    // Check if it's assigned to a variable
    if(node.parent && node.parent.type === 'VariableDeclarator' && node.parent.id) {
        return node.parent.id.name;
    }

    return null;
}

// Validate parameter destructuring (for components/hooks)
function validateParameterDestructuring(param, functionNode) {
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
    if(functionNode && !checkIfSpreadIsUsed(functionNode, restElementName)) {
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

// Check if the spread variable is actually used
function checkIfSpreadIsUsed(functionNode, spreadName) {
    if(!functionNode || !functionNode.body) {
        return false;
    }

    let isUsed = false;

    // Walk through the function body to find spread usage
    function checkNode(node) {
        if(!node || isUsed) return;

        // Check JSX spread attributes
        if(node.type === 'JSXSpreadAttribute' && node.argument) {
            if(isSpreadReference(node.argument, spreadName)) {
                isUsed = true;
                return;
            }
        }

        // Check regular spread elements
        if(node.type === 'SpreadElement' && node.argument) {
            if(isSpreadReference(node.argument, spreadName)) {
                isUsed = true;
                return;
            }
        }

        // Recursively check child nodes
        for(const key in node) {
            if(key !== 'parent' && !isUsed && node[key]) {
                const child = node[key];
                if(Array.isArray(child)) {
                    child.forEach(checkNode);
                }
                else if(typeof child === 'object') {
                    checkNode(child);
                }
            }
        }
    }

    checkNode(functionNode.body);
    return isUsed;
}

// Check if a node references the spread variable
function isSpreadReference(node, spreadName) {
    // Direct identifier
    if(node.type === 'Identifier' && node.name === spreadName) {
        return true;
    }

    // TypeScript type assertion: variableName as Type
    if(
        node.type === 'TSAsExpression' &&
        node.expression &&
        node.expression.type === 'Identifier' &&
        node.expression.name === spreadName
    ) {
        return true;
    }

    // Parenthesized expression: (variableName)
    if(
        node.type === 'ParenthesizedExpression' &&
        node.expression &&
        node.expression.type === 'Identifier' &&
        node.expression.name === spreadName
    ) {
        return true;
    }

    return false;
}

// Find the containing function node
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

// Check if we're inside a custom hook function
function isInsideCustomHook(node) {
    let current = node;
    while(current) {
        // Check if we're inside a function that starts with 'use'
        const functionName = getFunctionName(current);
        if(functionName && functionName.startsWith('use')) {
            return true;
        }

        current = current.parent;
    }
    return false;
}

// Check if a variable is used in a React hook dependency array
function checkIfUsedInHookDependency(node, variableName) {
    const functionNode = findContainingFunction(node);

    if(!functionNode || !functionNode.body) {
        return false;
    }

    let isUsedInDependency = false;

    // Check for React hook calls with dependency arrays
    function checkNode(currentNode) {
        if(!currentNode || isUsedInDependency) return;

        // Check for React hook calls
        if(currentNode.type === 'CallExpression' && currentNode.callee) {
            const isReactHook =
                (currentNode.callee.type === 'MemberExpression' &&
                    currentNode.callee.object &&
                    currentNode.callee.object.name === 'React' &&
                    currentNode.callee.property &&
                    currentNode.callee.property.name &&
                    currentNode.callee.property.name.startsWith('use')) ||
                (currentNode.callee.type === 'Identifier' && currentNode.callee.name.startsWith('use'));

            if(isReactHook && currentNode.arguments && currentNode.arguments.length >= 2) {
                const depArray = currentNode.arguments[1];

                // Check if the dependency array contains our variable
                if(depArray.type === 'ArrayExpression' && depArray.elements) {
                    for(const element of depArray.elements) {
                        if(element && element.type === 'Identifier' && element.name === variableName) {
                            isUsedInDependency = true;
                            return;
                        }
                    }
                }
            }
        }

        // Recursively check child nodes
        for(const key in currentNode) {
            if(key !== 'parent' && !isUsedInDependency && currentNode[key]) {
                const child = currentNode[key];
                if(Array.isArray(child)) {
                    child.forEach(checkNode);
                }
                else if(typeof child === 'object') {
                    checkNode(child);
                }
            }
        }
    }

    checkNode(functionNode.body);
    return isUsedInDependency;
}

// Fix property assignment by replacing with direct access
function fixPropertyAssignment(node, context, fixer, sourceVariable, propertyName, variableName) {
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
            fixes.push(fixer.replaceText(ref.identifier, `${sourceVariable}.${propertyName}`));
        }
    });

    return fixes;
}

// Export - Default
export default ReactDestructuringRule;
