// ESLint rule to disallow imports from 'next/navigation', 'next/link', and 'framer-motion'
const ReactImportRule = {
    meta: {
        type: 'problem',
        docs: {
            description:
                "Disallow imports from 'next/navigation', 'next/link', and 'framer-motion' and require their replacements instead.",
            category: 'Possible Errors',
            recommended: false,
        },
        messages: {
            forbiddenNavigationImport:
                "Importing from 'next/navigation' is not allowed. Use '@structure/source/router/Navigation' instead for framework-independent navigation.",
            forbiddenLinkImport:
                "Importing from 'next/link' is not allowed. Use '@structure/source/components/navigation/Link' instead for framework-independent links.",
            forbiddenMotionImport: "Importing from 'framer-motion' is not allowed. Use 'motion/react' instead.",
        },
        fixable: 'code',
    },
    create(context) {
        function checkImportSource(node, importSource) {
            if(typeof importSource === 'string') {
                if(importSource === 'next/navigation') {
                    context.report({
                        node,
                        messageId: 'forbiddenNavigationImport',
                        fix(fixer) {
                            // Provide an auto-fix that replaces 'next/navigation' with '@structure/source/router/Navigation'
                            return fixer.replaceText(node.source, "'@structure/source/router/Navigation'");
                        },
                    });
                }
                else if(importSource === 'framer-motion') {
                    context.report({
                        node,
                        messageId: 'forbiddenMotionImport',
                        fix(fixer) {
                            // Provide an auto-fix that replaces 'framer-motion' with 'motion/react'
                            return fixer.replaceText(node.source, "'motion/react'");
                        },
                    });
                }
            }
        }

        return {
            ImportDeclaration(node) {
                checkImportSource(node, node.source.value);
            },
            CallExpression(node) {
                if(node.callee.type === 'Identifier' && node.callee.name === 'require') {
                    const argument = node.arguments[0];
                    if(argument?.type === 'Literal' && typeof argument.value === 'string') {
                        checkImportSource(node, argument.value);
                    }
                }
            },
            ImportExpression(node) {
                const argument = node.source;
                if(argument?.type === 'Literal' && typeof argument.value === 'string') {
                    checkImportSource(node, argument.value);
                }
            },
        };
    },
};

// Export - Default
export default ReactImportRule;
