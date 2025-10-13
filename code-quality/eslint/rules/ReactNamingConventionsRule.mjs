// ESLint rule to enforce React naming conventions
// 1. Component parameters should be named "properties" instead of "props"
// 2. Component property interfaces/types must end with "Properties"
// 3. No identifiers can end with "Prop" or "Props"
// 4. No identifiers can end with "Param" or "Params"
const ReactNamingConventionsRule = {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Enforce React naming conventions: use "properties" parameter, types end with "Properties", no "Prop"/"Props"/"Param"/"Params" suffixes, hook result naming',
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

        // Track hook invocations in the file
        const hookInvocations = new Map(); // hookName -> count

        // Track hook result variables to check later
        const hookResultsToCheck = []; // Array of { node, varName, hookName }

        // Check if a name likely belongs to a React component
        function isLikelyComponentName(name) {
            // Component names should be PascalCase and not start with "use" (which would be a hook)
            return /^[A-Z][A-Za-z0-9]*$/.test(name) && !name.startsWith('use');
        }

        // Get the expected variable name for a hook
        function getExpectedHookVariableName(hookName) {
            // useAgentQuery -> agentQuery
            // useRouter -> router
            // use -> empty string (edge case)
            if(hookName.startsWith('use') && hookName.length > 3) {
                const withoutUse = hookName.slice(3);
                return withoutUse.charAt(0).toLowerCase() + withoutUse.slice(1);
            }
            return hookName;
        }

        // Check if the variable name matches the expected pattern for a hook
        function isCorrectHookVariableName(varName, hookName) {
            // Special cases for state management hooks where variable name describes the atom/state
            const stateManagementHooks = [
                'useAtom',
                'useAtomValue',
                'useSetAtom',
                'useRecoilState',
                'useRecoilValue',
                'useSetRecoilState',
            ];
            if(stateManagementHooks.includes(hookName)) {
                // For state management hooks, any descriptive name is fine
                // Just prevent generic names
                const genericNames = ['atom', 'atomValue', 'setAtom', 'state', 'value', 'data'];
                return !genericNames.includes(varName);
            }

            // Special case for useDebounce - variable name should describe what's being debounced
            if(hookName === 'useDebounce') {
                // Any name starting with "debounced" is good
                if(varName.startsWith('debounced')) {
                    return true;
                }
                // Just prevent generic names
                return varName !== 'debounce' && varName !== 'value' && varName !== 'data';
            }

            const expected = getExpectedHookVariableName(hookName);
            const varNameLower = varName.toLowerCase();
            const expectedLower = expected.toLowerCase();

            // Exact match
            if(varName === expected) {
                return true;
            }

            // Starts with the expected name (e.g., watchEmail for useWatch)
            if(varNameLower.startsWith(expectedLower)) {
                return true;
            }

            // Ends with the expected name (e.g., emailWatch for useWatch)
            if(varNameLower.endsWith(expectedLower)) {
                return true;
            }

            // For plural hooks, check if variable name contains the singular form
            // e.g., lineSprings for useSprings -> springs contains spring
            if(expectedLower.endsWith('s') && varNameLower.includes(expectedLower.slice(0, -1))) {
                return true;
            }

            // If none of the positive patterns match, it's incorrect
            return false;
        }

        // Track if this file has Next.js page APIs
        let hasNextJsPageApis = false;

        // Helper function to check if identifier ends with disallowed suffixes and suggest fix
        function checkNamingConventions(node, name) {
            // Whitelist of allowed names that would otherwise be flagged
            const allowedNames = [
                'URLSearchParams', // Web API
            ];

            // Additional whitelist for Next.js contexts (only in specific contexts)
            const nextJsPageNames = [
                'params', // Next.js dynamic route parameters
                'searchParams', // Next.js search parameters
            ];

            // Check if we're in a Next.js page context (where Next.js prop names are allowed)
            const isPageFile =
                filename.endsWith('/page.tsx') ||
                filename.endsWith('\\page.tsx') ||
                filename.endsWith('/layout.tsx') ||
                filename.endsWith('\\layout.tsx');

            // Check various Next.js contexts where these names are legitimate
            const isInNextJsContext =
                // Property in an object type/interface (e.g., params: { id: string })
                (node.parent && node.parent.type === 'Property' && node.parent.key === node) ||
                // Member expression access (e.g., properties.params)
                (node.parent && node.parent.type === 'MemberExpression' && node.parent.property === node) ||
                // Object destructuring (e.g., { params } = properties)
                (node.parent && node.parent.type === 'Property' && node.parent.value === node) ||
                // Direct property access in interfaces for Next.js page props
                (node.parent &&
                    (node.parent.type === 'PropertySignature' || node.parent.type === 'TSPropertySignature'));

            // Skip whitelisted names
            if(allowedNames.includes(name)) {
                return;
            }

            // Allow Next.js page names in files with Next.js APIs within Next.js contexts
            if(nextJsPageNames.includes(name) && (isPageFile || hasNextJsPageApis) && isInNextJsContext) {
                return;
            }

            // Check for exact matches first
            if(name === 'e') {
                // Try to infer context to suggest appropriate name
                let suggestedName = 'event'; // Default suggestion
                let isError = false;
                let isEvent = false;

                // Check context clues for what 'e' represents
                if(node.parent) {
                    // Check for error contexts
                    if(node.parent.type === 'CatchClause' && node.parent.param === node) {
                        suggestedName = 'error';
                        isError = true;
                    }
                    // Check if we're in a function parameter and walk up to find context
                    else {
                        let current = node.parent;
                        while(current && !isEvent) {
                            // Check if this function is assigned to an event handler property
                            if(
                                current.parent &&
                                current.parent.type === 'Property' &&
                                current.parent.value === current
                            ) {
                                const key = current.parent.key;
                                if(key && key.name && /^on[A-Z]/.test(key.name)) {
                                    suggestedName = 'event';
                                    isEvent = true;
                                    break;
                                }
                            }
                            // Check if this function is assigned to a JSX event handler
                            else if(current.parent && current.parent.type === 'JSXExpressionContainer') {
                                let jsxParent = current.parent.parent;
                                if(
                                    jsxParent &&
                                    jsxParent.type === 'JSXAttribute' &&
                                    jsxParent.name &&
                                    jsxParent.name.name &&
                                    /^on[A-Z]/.test(jsxParent.name.name)
                                ) {
                                    suggestedName = 'event';
                                    isEvent = true;
                                    break;
                                }
                            }
                            // Check if this function is assigned to a variable with handler-like name
                            else if(
                                current.parent &&
                                current.parent.type === 'VariableDeclarator' &&
                                current.parent.id &&
                                current.parent.id.name
                            ) {
                                if(/handle|on[A-Z]|event/i.test(current.parent.id.name)) {
                                    suggestedName = 'event';
                                    isEvent = true;
                                    break;
                                }
                            }
                            // Check if this is a function declaration with handler-like name
                            else if(
                                current.type === 'FunctionDeclaration' &&
                                current.id &&
                                current.id.name &&
                                /handle|on[A-Z]|event/i.test(current.id.name)
                            ) {
                                suggestedName = 'event';
                                isEvent = true;
                                break;
                            }
                            current = current.parent;
                        }
                    }
                }

                const contextHint = isError
                    ? ' (appears to be an error)'
                    : isEvent
                      ? ' (appears to be an event)'
                      : ' (context unclear)';

                context.report({
                    node: node,
                    message: `Variable named "e" is too ambiguous${contextHint}. Use "${suggestedName}" or a more descriptive name.`,
                    fix(fixer) {
                        return fixer.replaceText(node, suggestedName);
                    },
                });
            }
            else if(name === 'prop') {
                context.report({
                    node: node,
                    message: `Identifier "${name}" should not be named "prop". Use "property" or a more descriptive name.`,
                    fix(fixer) {
                        return fixer.replaceText(node, 'property');
                    },
                });
            }
            else if(name === 'props') {
                // Allow accessing .props on React elements (e.g., element.props.id)
                if(node.parent && node.parent.type === 'MemberExpression' && node.parent.property === node) {
                    return; // This is accessing .props on an object, which is fine for React elements
                }

                context.report({
                    node: node,
                    message: `Identifier "${name}" should not be named "props". Use "properties" or a more descriptive name.`,
                    fix(fixer) {
                        return fixer.replaceText(node, 'properties');
                    },
                });
            }
            else if(name === 'param') {
                context.report({
                    node: node,
                    message: `Identifier "${name}" should not be named "param". Use "parameter" or a more descriptive name.`,
                    fix(fixer) {
                        return fixer.replaceText(node, 'parameter');
                    },
                });
            }
            else if(name === 'params') {
                context.report({
                    node: node,
                    message: `Identifier "${name}" should not be named "params". Use "parameters" or a more descriptive name.`,
                    fix(fixer) {
                        return fixer.replaceText(node, 'parameters');
                    },
                });
            }
            else if(name === 'ref') {
                // Skip if this is accessing .ref property on an object (like element.ref)
                if(node.parent && node.parent.type === 'MemberExpression' && node.parent.property === node) {
                    return;
                }

                // Check if this is a React.forwardRef callback parameter
                let isForwardRefParameter = false;
                let current = node.parent;

                // Walk up to find if we're in a React.forwardRef callback
                while(current) {
                    if(
                        current.type === 'CallExpression' &&
                        current.callee &&
                        current.callee.type === 'MemberExpression' &&
                        current.callee.object &&
                        current.callee.object.name === 'React' &&
                        current.callee.property &&
                        current.callee.property.name === 'forwardRef'
                    ) {
                        // Check if the node is the second parameter of the callback function
                        let func = current.arguments[0];
                        if(func && (func.type === 'FunctionExpression' || func.type === 'ArrowFunctionExpression')) {
                            if(func.params && func.params.length >= 2 && func.params[1] === node) {
                                isForwardRefParameter = true;
                                break;
                            }
                        }
                    }
                    current = current.parent;
                }

                if(isForwardRefParameter) {
                    context.report({
                        node: node,
                        message: `React.forwardRef callback should use "reference" instead of "ref" for the second parameter.`,
                        fix(fixer) {
                            // For now, do a simpler approach: just rename this parameter instance
                            // The rule will catch other instances separately and fix them too
                            return fixer.replaceText(node, 'reference');
                        },
                    });
                }
                else {
                    // General case: warn about other 'ref' variable names
                    context.report({
                        node: node,
                        message: `Identifier "${name}" should not be named "ref". Use "reference" or a more descriptive name.`,
                        fix(fixer) {
                            return fixer.replaceText(node, 'reference');
                        },
                    });
                }
            }
            else if(name.endsWith('Prop') && !name.endsWith('Properties')) {
                const suggestedName = name.replace(/Prop$/, 'Property');
                context.report({
                    node: node,
                    message: `Identifier "${name}" should not end with "Prop". Use "${suggestedName}".`,
                    fix(fixer) {
                        return fixer.replaceText(node, suggestedName);
                    },
                });
            }
            else if(name.endsWith('Props') && !name.endsWith('Properties')) {
                const suggestedName = name.replace(/Props$/, 'Properties');
                context.report({
                    node: node,
                    message: `Identifier "${name}" should not end with "Props". Use "${suggestedName}".`,
                    fix(fixer) {
                        return fixer.replaceText(node, suggestedName);
                    },
                });
            }
            else if(name.endsWith('Param')) {
                const suggestedName = name.replace(/Param$/, 'Parameter');
                context.report({
                    node: node,
                    message: `Identifier "${name}" should not end with "Param". Use "${suggestedName}".`,
                    fix(fixer) {
                        return fixer.replaceText(node, suggestedName);
                    },
                });
            }
            else if(name.endsWith('Params')) {
                const suggestedName = name.replace(/Params$/, 'Parameters');
                context.report({
                    node: node,
                    message: `Identifier "${name}" should not end with "Params". Use "${suggestedName}".`,
                    fix(fixer) {
                        return fixer.replaceText(node, suggestedName);
                    },
                });
            }
            else if(name.endsWith('Ref')) {
                const suggestedName = name.replace(/Ref$/, 'Reference');
                context.report({
                    node: node,
                    message: `Identifier "${name}" should not end with "Ref". Use "${suggestedName}".`,
                    fix(fixer) {
                        return fixer.replaceText(node, suggestedName);
                    },
                });
            }
            else if(name === 'config') {
                // Skip if this is a property key in an object literal (like { config: value })
                if(node.parent && node.parent.type === 'Property' && node.parent.key === node) {
                    return;
                }

                // Skip if this is accessing .config property on an object
                if(node.parent && node.parent.type === 'MemberExpression' && node.parent.property === node) {
                    return;
                }

                context.report({
                    node: node,
                    message: `Identifier "${name}" should not be named "config". Use "configuration" or a more descriptive name.`,
                    fix(fixer) {
                        return fixer.replaceText(node, 'configuration');
                    },
                });
            }
            else if(name.endsWith('Config')) {
                const suggestedName = name.replace(/Config$/, 'Configuration');
                context.report({
                    node: node,
                    message: `Identifier "${name}" should not end with "Config". Use "${suggestedName}".`,
                    fix(fixer) {
                        return fixer.replaceText(node, suggestedName);
                    },
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
            if(
                node.parent &&
                node.parent.type === 'VariableDeclarator' &&
                node.parent.id &&
                node.parent.id.name &&
                /^[A-Z]/.test(node.parent.id.name)
            ) {
                return true;
            }

            // For functions assigned to properties (e.g., in object literals)
            if(
                node.parent &&
                node.parent.type === 'Property' &&
                node.parent.key &&
                node.parent.key.name &&
                /^[A-Z]/.test(node.parent.key.name)
            ) {
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
                    },
                });
            }
        }

        // Function to check Next.js API function parameters
        function checkNextJsApiParameters(node) {
            // Only apply to page.tsx and layout.tsx files
            const isPageFile = filename.endsWith('/page.tsx') || filename.endsWith('\\page.tsx');
            const isLayoutFile = filename.endsWith('/layout.tsx') || filename.endsWith('\\layout.tsx');

            if(!isPageFile && !isLayoutFile) {
                return;
            }

            // Next.js API functions that require 'params' parameter
            const nextJsApiFunctions = ['generateMetadata', 'generateStaticParams', 'generateViewport'];

            // Check if this is a Next.js API function
            const functionName = node.id && node.id.name;
            if(!functionName || !nextJsApiFunctions.includes(functionName)) {
                return;
            }

            // Skip functions with no params
            if(!node.params || node.params.length === 0) {
                return;
            }

            // Check the first parameter - this should be 'properties' for our naming convention
            const firstParam = node.params[0];

            // For Next.js API functions, we need to check the type annotation to see the 'params' property
            if(
                firstParam.type === 'Identifier' &&
                firstParam.typeAnnotation &&
                firstParam.typeAnnotation.typeAnnotation
            ) {
                const typeAnnotation = firstParam.typeAnnotation.typeAnnotation;

                // Check if it's an object type with properties
                if(typeAnnotation.type === 'TSTypeLiteral' && typeAnnotation.members) {
                    for(const member of typeAnnotation.members) {
                        if(member.type === 'TSPropertySignature' && member.key) {
                            if(member.key.name === 'parameters') {
                                context.report({
                                    node: member.key,
                                    message: `Next.js ${functionName} function should use 'params' instead of 'parameters' to match the framework API.`,
                                    fix(fixer) {
                                        return fixer.replaceText(member.key, 'params');
                                    },
                                });
                            }
                            else if(member.key.name === 'searchParameters') {
                                context.report({
                                    node: member.key,
                                    message: `Next.js ${functionName} function should use 'searchParams' instead of 'searchParameters' to match the framework API.`,
                                    fix(fixer) {
                                        return fixer.replaceText(member.key, 'searchParams');
                                    },
                                });
                            }
                        }
                    }
                }
            }
        }

        return {
            // Track hook invocations throughout the file
            CallExpression(node) {
                if(node.callee.type === 'Identifier' && node.callee.name.startsWith('use')) {
                    const hookName = node.callee.name;
                    const count = hookInvocations.get(hookName) || 0;
                    hookInvocations.set(hookName, count + 1);
                }
            },

            // Detect Next.js page APIs to determine if this file should allow Next.js conventions
            ExportNamedDeclaration(node) {
                if(node.declaration && node.declaration.type === 'FunctionDeclaration' && node.declaration.id) {
                    const functionName = node.declaration.id.name;
                    const nextJsPageApis = [
                        'generateMetadata',
                        'generateStaticParams',
                        'generateStaticPaths',
                        'getServerSideProps',
                        'getStaticProps',
                        'getStaticPaths',
                    ];

                    if(nextJsPageApis.includes(functionName)) {
                        hasNextJsPageApis = true;
                    }
                }
            },

            // Check all identifiers for Prop/Props naming
            Identifier(node) {
                // Skip if this identifier is part of a React.* member expression
                if(
                    node.parent &&
                    node.parent.type === 'MemberExpression' &&
                    node.parent.object &&
                    node.parent.object.name === 'React'
                ) {
                    return;
                }

                // Skip if this identifier is part of a React.* TypeScript type reference
                if(
                    node.parent &&
                    node.parent.type === 'TSQualifiedName' &&
                    node.parent.left &&
                    node.parent.left.name === 'React'
                ) {
                    return;
                }

                // Skip if this identifier is being imported (external library names we can't control)
                if(
                    node.parent &&
                    (node.parent.type === 'ImportSpecifier' ||
                        node.parent.type === 'ImportDefaultSpecifier' ||
                        node.parent.type === 'ImportNamespaceSpecifier')
                ) {
                    return;
                }

                checkNamingConventions(node, node.name);
            },

            // First pass: Identify component property types

            // React components defined as function declarations
            FunctionDeclaration(node) {
                // Check for props parameter naming
                checkPropertiesParameter(node);

                // Check for Next.js API parameter naming
                checkNextJsApiParameters(node);

                // Skip if not a component (not PascalCase or starts with "use")
                if(!node.id || !isLikelyComponentName(node.id.name)) {
                    return;
                }

                // Check first parameter type annotation (where props would be)
                if(
                    node.params.length > 0 &&
                    node.params[0].typeAnnotation &&
                    node.params[0].typeAnnotation.typeAnnotation &&
                    node.params[0].typeAnnotation.typeAnnotation.type === 'TSTypeReference' &&
                    node.params[0].typeAnnotation.typeAnnotation.typeName &&
                    node.params[0].typeAnnotation.typeAnnotation.typeName.type === 'Identifier'
                ) {
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
                            message: currentSuffix
                                ? `React component property type should end with "Properties" instead of "${currentSuffix}"`
                                : `React component property type should end with "Properties"`,
                            fix(fixer) {
                                let newName;
                                if(typeNameStr.endsWith('Interface')) {
                                    newName = typeNameStr.replace(/Interface$/, 'Properties');
                                }
                                else if(typeNameStr.endsWith('Props')) {
                                    newName = typeNameStr.replace(/Props$/, 'Properties');
                                }
                                else {
                                    newName = `${typeNameStr}Properties`;
                                }
                                return fixer.replaceText(typeName, newName);
                            },
                        });
                    }
                }
            },

            // React components defined as arrow functions or function expressions in variable declarations
            VariableDeclarator(node) {
                // Check for hook result naming
                if(
                    node.init &&
                    node.init.type === 'CallExpression' &&
                    node.init.callee.type === 'Identifier' &&
                    node.init.callee.name.startsWith('use') &&
                    node.id &&
                    node.id.type === 'Identifier'
                ) {
                    const varName = node.id.name;
                    const hookName = node.init.callee.name;

                    // Get the count of this hook's invocations (will be counted after all are parsed)
                    // For now, we'll check at Program:exit

                    // Store for later checking when we know all hook invocations
                    hookResultsToCheck.push({ node: node.id, varName, hookName });
                }

                // Check for props parameter naming in function expressions/arrow functions
                if(
                    node.init &&
                    (node.init.type === 'ArrowFunctionExpression' || node.init.type === 'FunctionExpression')
                ) {
                    checkPropertiesParameter(node.init);
                }

                // Skip if not a component (not PascalCase or starts with "use")
                if(!node.id || !isLikelyComponentName(node.id.name)) {
                    return;
                }

                // Skip if not a function expression or arrow function
                if(
                    !node.init ||
                    (node.init.type !== 'ArrowFunctionExpression' && node.init.type !== 'FunctionExpression')
                ) {
                    return;
                }

                // Check first parameter type annotation (where props would be)
                if(
                    node.init.params.length > 0 &&
                    node.init.params[0].typeAnnotation &&
                    node.init.params[0].typeAnnotation.typeAnnotation &&
                    node.init.params[0].typeAnnotation.typeAnnotation.type === 'TSTypeReference' &&
                    node.init.params[0].typeAnnotation.typeAnnotation.typeName &&
                    node.init.params[0].typeAnnotation.typeAnnotation.typeName.type === 'Identifier'
                ) {
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
                            message: currentSuffix
                                ? `React component property type should end with "Properties" instead of "${currentSuffix}"`
                                : `React component property type should end with "Properties"`,
                            fix(fixer) {
                                let newName;
                                if(typeNameStr.endsWith('Interface')) {
                                    newName = typeNameStr.replace(/Interface$/, 'Properties');
                                }
                                else if(typeNameStr.endsWith('Props')) {
                                    newName = typeNameStr.replace(/Props$/, 'Properties');
                                }
                                else {
                                    newName = `${typeNameStr}Properties`;
                                }
                                return fixer.replaceText(typeName, newName);
                            },
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
                        message: currentSuffix
                            ? `Interface used as React component property type should end with "Properties" instead of "${currentSuffix}"`
                            : `Interface used as React component property type should end with "Properties"`,
                        fix(fixer) {
                            let newName;
                            if(name.endsWith('Interface')) {
                                newName = name.replace(/Interface$/, 'Properties');
                            }
                            else if(name.endsWith('Props')) {
                                newName = name.replace(/Props$/, 'Properties');
                            }
                            else {
                                newName = `${name}Properties`;
                            }
                            return fixer.replaceText(node.id, newName);
                        },
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
                        message: currentSuffix
                            ? `Type used as React component property type should end with "Properties" instead of "${currentSuffix}"`
                            : `Type used as React component property type should end with "Properties"`,
                        fix(fixer) {
                            let newName;
                            if(name.endsWith('Interface')) {
                                newName = name.replace(/Interface$/, 'Properties');
                            }
                            else if(name.endsWith('Props')) {
                                newName = name.replace(/Props$/, 'Properties');
                            }
                            else {
                                newName = `${name}Properties`;
                            }
                            return fixer.replaceText(node.id, newName);
                        },
                    });
                }
            },

            // Check hook results after all invocations have been counted
            'Program:exit'() {
                hookResultsToCheck.forEach(({ node, varName, hookName }) => {
                    const hookCount = hookInvocations.get(hookName) || 0;

                    // Only apply the rule if the hook is called once
                    // If called multiple times, descriptive prefixes/suffixes are expected
                    if(hookCount === 1 && !isCorrectHookVariableName(varName, hookName)) {
                        const expectedName = getExpectedHookVariableName(hookName);
                        const varNameLower = varName.toLowerCase();

                        // Provide different messages based on the issue
                        let message;

                        // Check for bad patterns
                        const badPatterns = ['result', 'data', 'value', 'state', 'hook'];
                        const hasBadSuffix = badPatterns.some((pattern) =>
                            varName.endsWith(pattern[0].toUpperCase() + pattern.slice(1)),
                        );

                        if(hasBadSuffix) {
                            message = `Hook result variable "${varName}" should not end with generic suffixes like "Result", "Data", etc. Use "${expectedName}" or something more specific.`;
                        }
                        else if(varNameLower === 'data' || varNameLower === 'result' || varName.length <= 2) {
                            message = `Hook result variable "${varName}" is too generic. Use "${expectedName}" or a descriptive name.`;
                        }
                        else {
                            message = `Hook result variable "${varName}" should be related to the hook name "${hookName}". Use "${expectedName}" or something more specific.`;
                        }

                        context.report({
                            node,
                            message,
                        });
                    }
                });
            },
        };
    },
};

// Export - Default
export default ReactNamingConventionsRule;
