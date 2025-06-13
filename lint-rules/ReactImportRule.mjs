// ESLint rule to disallow imports from 'next/navigation' and require '@structure/source/router/Navigation' instead
const ReactImportRule = {
    meta: {
        type: 'problem',
        docs: {
            description:
                "Disallow imports from 'next/navigation' and require '@structure/source/router/Navigation' instead.",
            category: 'Possible Errors',
            recommended: false,
        },
        messages: {
            forbiddenImport:
                "Importing from 'next/navigation' is not allowed. Use '@structure/source/router/Navigation' instead for framework-independent navigation.",
        },
        fixable: 'code',
    },
    create(context) {
        function checkImportSource(node, importSource) {
            if(typeof importSource === 'string' && importSource === 'next/navigation') {
                context.report({
                    node,
                    messageId: 'forbiddenImport',
                    fix(fixer) {
                        // Provide an auto-fix that replaces 'next/navigation' with '@structure/source/router/Navigation'
                        return fixer.replaceText(node.source, "'@structure/source/router/Navigation'");
                    },
                });
            }
        }

        return {
            ImportDeclaration(node) {
                checkImportSource(node, node.source.value);
            },
            CallExpression(node) {
                if(node.callee.type === 'Identifier' && node.callee.name === 'require') {
                    const argument = node.arguments[0];
                    if(argument && argument.type === 'Literal' && typeof argument.value === 'string') {
                        checkImportSource(node, argument.value);
                    }
                }
            },
            ImportExpression(node) {
                const argument = node.source;
                if(argument && argument.type === 'Literal' && typeof argument.value === 'string') {
                    checkImportSource(node, argument.value);
                }
            },
        };
    },
};

// Export - Default
export default ReactImportRule;
