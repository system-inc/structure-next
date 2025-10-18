// Dependencies
import * as fs from 'fs';
import * as path from 'path';

// Cache for base variants/sizes (read once per lint run)
let baseButtonVariants = null;
let baseButtonSizes = null;

// Function to extract interface keys from ButtonTheme.ts
function getBaseButtonVariantsAndSizes() {
    if(baseButtonVariants !== null && baseButtonSizes !== null) {
        return { baseButtonVariants, baseButtonSizes };
    }

    try {
        // Find ButtonTheme.ts in structure library
        const buttonThemePath = path.join(
            process.cwd(),
            'libraries/structure/source/components/buttons/ButtonTheme.ts',
        );
        const content = fs.readFileSync(buttonThemePath, 'utf8');

        // Extract ButtonVariants interface keys using regex
        const variantsMatch = content.match(/export interface ButtonVariants\s*\{([^}]+)\}/s);
        if(variantsMatch?.[1]) {
            const variantsBody = variantsMatch[1];
            baseButtonVariants = variantsBody
                .split('\n')
                .map((line) => line.trim())
                .filter((line) => line && !line.startsWith('//'))
                .map((line) => line.split(':')[0].trim())
                .filter((key) => key && /^[A-Z]/.test(key)); // Only capitalize keys
        }

        // Extract ButtonSizes interface keys using regex
        const sizesMatch = content.match(/export interface ButtonSizes\s*\{([^}]+)\}/s);
        if(sizesMatch?.[1]) {
            const sizesBody = sizesMatch[1];
            baseButtonSizes = sizesBody
                .split('\n')
                .map((line) => line.trim())
                .filter((line) => line && !line.startsWith('//'))
                .map((line) => line.split(':')[0].trim())
                .filter((key) => key && /^[A-Z]/.test(key)); // Only capitalize keys
        }

        return { baseButtonVariants, baseButtonSizes };
    }
    catch(error) {
        // If we can't read the file, return empty arrays to avoid breaking lint
        console.warn('Could not read ButtonTheme.ts for variant validation:', error.message);
        baseButtonVariants = [];
        baseButtonSizes = [];
        return { baseButtonVariants, baseButtonSizes };
    }
}

// ESLint rule to disallow:
// 1. Imports using the alias '@project' from files within 'libraries/structure'
// 2. Project-specific button variants/sizes in structure code
const NoStructureProjectImportsRule = {
    meta: {
        type: 'problem',
        docs: {
            description: "Disallow imports from '@project' and project-specific themes within 'libraries/structure'.",
            category: 'Possible Errors',
            recommended: false,
        },
        messages: {
            forbiddenImport: "Importing from '@project' is not allowed within 'libraries/structure'.",
            forbiddenButtonVariant:
                "Button variant '{{variant}}' is project-specific and not allowed in structure code. Use base variants only: {{baseVariants}}",
            forbiddenButtonSize:
                "Button size '{{size}}' is project-specific and not allowed in structure code. Use base sizes only: {{baseSizes}}",
        },
    },
    create(context) {
        const filePath = context.getFilename();

        // Normalize file path to always use forward slashes
        const normalizedPath = filePath.replace(/\\/g, '/');

        // Check if the file is within the 'libraries/structure' directory
        const isInBaseLibrary = normalizedPath.includes('/libraries/structure/');

        // Whitelist specific imports
        const whitelistedImports = [
            '@project/ProjectSettings',
            '@project/app/_theme/styles/theme.css',
            '@project/tailwind.config',
        ];

        // Get base variants and sizes
        const { baseButtonVariants, baseButtonSizes } = getBaseButtonVariantsAndSizes();

        return {
            ImportDeclaration(node) {
                if(!isInBaseLibrary) return;

                const importSource = node.source.value;

                if(
                    typeof importSource === 'string' &&
                    importSource.startsWith('@project') &&
                    !whitelistedImports.includes(importSource)
                ) {
                    context.report({
                        node,
                        messageId: 'forbiddenImport',
                    });
                }
            },
            CallExpression(node) {
                if(!isInBaseLibrary) return;

                if(node.callee.type === 'Identifier' && node.callee.name === 'require') {
                    const argument = node.arguments[0];
                    if(
                        argument &&
                        argument.type === 'Literal' &&
                        typeof argument.value === 'string' &&
                        argument.value.startsWith('@project')
                    ) {
                        context.report({
                            node,
                            messageId: 'forbiddenImport',
                        });
                    }
                }
            },
            ImportExpression(node) {
                if(!isInBaseLibrary) return;

                const argument = node.source;
                if(
                    argument &&
                    argument.type === 'Literal' &&
                    typeof argument.value === 'string' &&
                    argument.value.startsWith('@project')
                ) {
                    context.report({
                        node,
                        messageId: 'forbiddenImport',
                    });
                }
            },
            JSXAttribute(node) {
                if(!isInBaseLibrary) return;
                if(!baseButtonVariants || !baseButtonSizes) return;

                // Only check variant/size on Button or AnimatedButton components
                const parentElement = node.parent;
                if(!parentElement || parentElement.type !== 'JSXOpeningElement') return;

                const elementName = parentElement.name;
                const componentName = elementName.type === 'JSXIdentifier' ? elementName.name : null;

                // Only validate Button and AnimatedButton components
                if(componentName !== 'Button' && componentName !== 'AnimatedButton') return;

                // Check for variant prop on Button/AnimatedButton components
                if(node.name.name === 'variant' && node.value?.type === 'Literal') {
                    const variantValue = node.value.value;
                    if(typeof variantValue === 'string' && !baseButtonVariants.includes(variantValue)) {
                        context.report({
                            node: node.value,
                            messageId: 'forbiddenButtonVariant',
                            data: {
                                variant: variantValue,
                                baseVariants: baseButtonVariants.join(', '),
                            },
                        });
                    }
                }

                // Check for size prop on Button/AnimatedButton components
                if(node.name.name === 'size' && node.value?.type === 'Literal') {
                    const sizeValue = node.value.value;
                    if(typeof sizeValue === 'string' && !baseButtonSizes.includes(sizeValue)) {
                        context.report({
                            node: node.value,
                            messageId: 'forbiddenButtonSize',
                            data: {
                                size: sizeValue,
                                baseSizes: baseButtonSizes.join(', '),
                            },
                        });
                    }
                }
            },
        };
    },
};

// Export - Default
export default NoStructureProjectImportsRule;
