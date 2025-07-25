// Code Consistency Rule
// This rule enforces various code consistency patterns across the codebase

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Enforce code consistency patterns',
            category: 'Stylistic Issues',
            recommended: true,
        },
        fixable: 'code',
        messages: {
            noUnderscoreUtils: 'Folder name "_utils" is not allowed. Use "_utilities" instead.',
            noUtils: 'Folder name "utils" is not allowed. Use "utilities" instead.',
            useSimpleComment: 'Use single-line comment instead of JSDoc for single-line descriptions.',
        },
        schema: [],
    },
    create(context) {
        // Helper function to get the filename safely
        function getFilename() {
            return context.filename || context.getFilename() || context.getPhysicalFilename() || '';
        }

        // Helper function to check if a JSDoc comment is just a single-line description
        function isSingleLineJsDoc(comment) {
            const text = comment.value.trim();
            // Check if it's a JSDoc comment
            if(comment.type === 'Block' && text.startsWith('*')) {
                const lines = text.split('\n').map((line) => line.trim());
                // Remove leading and trailing asterisks
                const cleanLines = lines.map((line) => line.replace(/^\*\s?/, '')).filter((line) => line.length > 0);

                // If it's just a single line description (no @param, @returns, etc.), it should be a single-line comment
                const hasJsDocTags = cleanLines.some((line) => line.startsWith('@'));
                const isOnlyDescription = cleanLines.length === 1 && !hasJsDocTags;

                return isOnlyDescription;
            }
            return false;
        }

        // Helper function to extract description from JSDoc comment
        function extractDescription(comment) {
            const text = comment.value.trim();
            const lines = text.split('\n').map((line) => line.trim());
            // Remove leading and trailing asterisks and filter empty lines
            const cleanLines = lines.map((line) => line.replace(/^\*\s?/, '')).filter((line) => line.length > 0);

            // Return the first non-empty line as the description
            return cleanLines[0] || '';
        }

        return {
            // Check at program start for folder naming
            Program(node) {
                const filename = getFilename();

                // Check for _utils folder
                if(filename.includes('/_utils/') || filename.includes('\\_utils\\')) {
                    // Report on the first line of the file
                    const firstToken = context.getSourceCode().getFirstToken(node);
                    context.report({
                        node: firstToken || node,
                        messageId: 'noUnderscoreUtils',
                    });
                }

                // Check for utils folder (without underscore)
                if(filename.includes('/utils/') || filename.includes('\\utils\\')) {
                    // Report on the first line of the file
                    const firstToken = context.getSourceCode().getFirstToken(node);
                    context.report({
                        node: firstToken || node,
                        messageId: 'noUtils',
                    });
                }
            },

            // Check all comments in the program
            'Program:exit'() {
                const sourceCode = context.getSourceCode();
                const allComments = sourceCode.getAllComments();

                allComments.forEach((comment) => {
                    // Check if it's a single-line JSDoc that should be a regular comment
                    if(isSingleLineJsDoc(comment)) {
                        const description = extractDescription(comment);

                        // Create the single-line comment format
                        const singleLineComment = `// ${description}`;

                        context.report({
                            node: comment,
                            messageId: 'useSimpleComment',
                            fix(fixer) {
                                return fixer.replaceText(comment, singleLineComment);
                            },
                        });
                    }
                });
            },
        };
    },
};
