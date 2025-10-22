// Dependencies - Utilities
import { extendTailwindMerge } from 'tailwind-merge';
import { clsx, ClassValue } from 'clsx';
import { cva } from 'class-variance-authority';

// Type for class property (matching CVA's ClassProp)
type ClassProperty = { class?: ClassValue; className?: never } | { class?: never; className?: ClassValue };

// Configure tailwind-merge to handle our custom border--0 utility
// Without this, tailwind-merge treats 'border' and 'border--0' as conflicting
const twMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            'border-custom': ['border--0'],
        } as Record<string, string[]>, // Type assertion for custom class group names
    },
});

/**
 * Merges multiple class names into a single string. Later parameters override earlier ones.
 *
 * `clsx` is used to concatenate class names, handling various types of input and
 * ignoring falsey values.
 *
 * `twMerge` is used to merge class names according to TailwindCSS conventions.
 * We extend twMerge with custom class groups for our double-dash utilities (border--0, etc.)
 * so they don't conflict with Tailwind's built-in utilities (border, bg, text).
 *
 * This function is particularly useful in a React component where class names might
 * be conditionally applied based on component state or properties.
 *
 * @param {ClassValue[]} classNameValues - An array of class names to merge. Each `ClassValue` can be a string, or an object where keys are class names and values are booleans indicating whether the class should be included.
 * @returns {string} A single string containing all merged class names, separated by spaces.
 */
export function mergeClassNames(...classNameValues: ClassValue[]): string {
    return twMerge(clsx(classNameValues));
}

/**
 * Creates a type-safe className builder function for component variants.
 *
 * This utility helps create components with multiple style variants (like size, color, etc.)
 * while maintaining TypeScript type safety and avoiding manual className conditionals.
 *
 * Wraps class-variance-authority (CVA) with development-mode validation that warns when
 * variants or sizes are used that don't exist in the theme (helpful for catching missing
 * ComponentThemeProvider or project-specific variants used without project theme).
 *
 * @example
 * const buttonClassNames = createVariantClassNames(
 *   'inline-flex items-center', // Base classes always applied
 *   {
 *     variants: {
 *       variant: {
 *         Primary: 'bg-blue-600 text-white',
 *         Secondary: 'bg-gray-200 text-black'
 *       },
 *       size: {
 *         Small: 'h-8 px-2',
 *         Large: 'h-12 px-6'
 *       }
 *     },
 *     defaultVariants: {
 *       variant: 'Primary',
 *       size: 'Small'
 *     }
 *   }
 * );
 *
 * // Usage in component
 * function Button(properties: ButtonProperties) {
 *   return (
 *     <button className={buttonClassNames({
 *       variant: properties.variant,
 *       size: properties.size
 *     })}>
 *       {properties.children}
 *     </button>
 *   );
 * }
 */
export function createVariantClassNames<T extends Record<string, Record<string, ClassValue>>>(
    base?: ClassValue,
    configuration?: {
        variants?: T;
        defaultVariants?: Partial<Record<keyof T, string>>;
        compoundVariants?: Array<Partial<Record<keyof T, string>> & ClassProperty>;
    },
) {
    // Create the CVA function - use type assertion to match CVA's expected signature
    const cvaFunction = cva(base, configuration as Parameters<typeof cva>[1]);

    // Return a wrapper that validates in development
    return function (properties?: Partial<Record<keyof T, string>> & ClassProperty) {
        // Development-only validation
        if(process.env.NODE_ENV === 'development' && properties && configuration?.variants) {
            for(const [variantKey, variantValue] of Object.entries(properties)) {
                // Skip special properties
                if(variantKey === 'class' || variantKey === 'className') continue;

                // Check if this variant key exists in config
                const variantOptions = configuration.variants[variantKey as keyof T];
                if(variantOptions && variantValue) {
                    // Check if the value exists in the variant options
                    if(typeof variantValue === 'string' && !(variantValue in variantOptions)) {
                        console.warn(
                            `Variant "${variantKey}" value "${variantValue}" is not defined in theme. ` +
                                `Available ${variantKey} values: ${Object.keys(variantOptions).join(', ')}. ` +
                                `Did you forget to provide ComponentThemeProvider with your project theme?`,
                        );
                    }
                }
            }
        }

        // Call the original CVA function
        return cvaFunction(properties as Parameters<typeof cvaFunction>[0]);
    };
}

// Type - VariantProperties
export type { VariantProps as VariantProperties } from 'class-variance-authority';
