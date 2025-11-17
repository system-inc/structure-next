// Dependencies - Utilities
import { extendTailwindMerge } from 'tailwind-merge';
import { clsx, ClassValue } from 'clsx';
import { cva } from 'class-variance-authority';

// Type for class property (matching CVA's ClassProp)
type ClassProperty = { class?: ClassValue; className?: never } | { class?: never; className?: ClassValue };

// Configure tailwind-merge to handle our custom double-dash utilities
// Extends Tailwind's existing class groups so our utilities properly conflict with built-in ones
const twMerge = extendTailwindMerge({
    extend: {
        classGroups: {
            // Extend Tailwind's 'bg-color' group with our custom background utilities
            // This ensures bg-white-500 and background--0 properly override each other
            'bg-color': [
                // Standard background colors
                'background--0',
                'background--1',
                'background--2',
                'background--3',
                'background--4',
                'background--5',
                'background--6',
                'background--7',
                'background--8',
                'background--9',
                'background--10',
                'background---1',
                'background---2',
                'background---3',
                'background--positive',
                'background--negative',
                'background--warning',
                'background--informative',
                'background--backdrop',
                // Background using content colors
                'background-content--0',
                'background-content--1',
                'background-content--2',
                'background-content--3',
                'background-content--4',
                'background-content--5',
                'background-content--6',
                'background-content--7',
                'background-content--8',
                'background-content--9',
                'background-content--10',
                'background-content---1',
                'background-content---2',
                'background-content---3',
                'background-content--positive',
                'background-content--negative',
                'background-content--warning',
                'background-content--informative',
                'background-content--disabled',
                'background-content--placeholder',
                // Background using border colors
                'background-border--0',
                'background-border--1',
                'background-border--2',
                'background-border--3',
                'background-border--4',
                'background-border--5',
                'background-border--6',
                'background-border--7',
                'background-border--8',
                'background-border--9',
                'background-border--10',
                'background-border---1',
                'background-border---2',
                'background-border---3',
                'background-border--positive',
                'background-border--negative',
                'background-border--warning',
                'background-border--informative',
                'background-border--focus',
            ],
            // Extend Tailwind's 'text-color' group with our custom content utilities
            // This ensures text-gray-400 and content--0 properly override each other
            'text-color': [
                'content--0',
                'content--1',
                'content--2',
                'content--3',
                'content--4',
                'content--5',
                'content--6',
                'content--7',
                'content--8',
                'content--9',
                'content--10',
                'content---1',
                'content---2',
                'content---3',
                'content--positive',
                'content--negative',
                'content--warning',
                'content--informative',
                'content--disabled',
                'content--placeholder',
                // Text using background colors
                'content-background--0',
                'content-background--1',
                'content-background--2',
                'content-background--3',
                'content-background--4',
                'content-background--5',
                'content-background--6',
                'content-background--7',
                'content-background--8',
                'content-background--9',
                'content-background--10',
                'content-background---1',
                'content-background---2',
                'content-background---3',
                'content-background--positive',
                'content-background--negative',
                'content-background--warning',
                'content-background--informative',
                'content-background--disabled',
                'content-background--placeholder',
            ],
            // Extend Tailwind's 'border-color' group with our custom border utilities
            // This ensures border-blue-500 and border--0 properly override each other
            'border-color': [
                // Standard border colors
                'border--0',
                'border--1',
                'border--2',
                'border--3',
                'border--4',
                'border--5',
                'border--6',
                'border--7',
                'border--8',
                'border--9',
                'border--10',
                'border---1',
                'border---2',
                'border---3',
                'border--positive',
                'border--negative',
                'border--warning',
                'border--informative',
                'border--focus',
                // Border using content colors
                'border-content--0',
                'border-content--1',
                'border-content--2',
                'border-content--3',
                'border-content--4',
                'border-content--5',
                'border-content--6',
                'border-content--7',
                'border-content--8',
                'border-content--9',
                'border-content--10',
                'border-content---1',
                'border-content---2',
                'border-content---3',
                'border-content--positive',
                'border-content--negative',
                'border-content--warning',
                'border-content--informative',
                'border-content--disabled',
                'border-content--placeholder',
            ],
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
        defaultVariants?: Partial<Record<keyof T, string | boolean>>;
        compoundVariants?: Array<Partial<Record<keyof T, string | boolean>> & ClassProperty>;
    },
) {
    // Create the CVA function - use type assertion to match CVA's expected signature
    const cvaFunction = cva(base, configuration as Parameters<typeof cva>[1]);

    // Return a wrapper that validates in development
    return function (properties?: Partial<Record<keyof T, string | boolean>> & ClassProperty) {
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
