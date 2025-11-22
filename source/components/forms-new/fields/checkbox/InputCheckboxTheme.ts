/**
 * Structure InputCheckbox Theme
 *
 * Default checkbox theme for the structure library. Provides accessible, framework-agnostic
 * checkbox variants and sizes using Radix UI primitives.
 */

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// InputCheckbox Variants
export interface InputCheckboxVariants {
    A: 'A';
}

// InputCheckbox Sizes
export interface InputCheckboxSizes {
    Small: 'Small';
    Base: 'Base';
}

// Export types for use in components
export type InputCheckboxVariant = InputCheckboxVariants[keyof InputCheckboxVariants];
export type InputCheckboxSize = InputCheckboxSizes[keyof InputCheckboxSizes];

// InputCheckbox Theme Configuration
export interface InputCheckboxThemeConfiguration {
    variants: Record<InputCheckboxVariant, string>;
    sizes: Record<InputCheckboxSize, string>;
    iconSizes: Record<InputCheckboxSize, string>;
    configuration: {
        baseClasses: string;
        indicatorClasses: string;
        defaultVariant: {
            variant?: InputCheckboxVariant;
            size?: InputCheckboxSize;
        };
    };
}

// Base classes applied to all checkboxes
const inputCheckboxBaseClassNames = mergeClassNames(
    'peer relative shrink-0 border transition-all ease-out',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'focus-visible:ring-1 focus-visible:outline-none',
    'rounded-sm',
);

// Theme - InputCheckbox
export const inputCheckboxTheme: InputCheckboxThemeConfiguration = {
    variants: {
        // Variant A - Default styled checkbox
        A: mergeClassNames(
            inputCheckboxBaseClassNames,
            // Base styling
            'border--2 background--0 shadow-xs dark:background--2',
            // Hover states
            'cursor-pointer hover:border--5',
            // Active states
            'active:border--5',
            // Checked state
            'data-[state=checked]:border-content--0 data-[state=checked]:background-content--0 data-[state=checked]:content--10',
            // Indeterminate state
            'data-[state=indeterminate]:border-content--0 data-[state=indeterminate]:background-content--0 data-[state=indeterminate]:content--10',
        ),
    },
    sizes: {
        Small: 'size-3',
        Base: 'size-4',
    },
    iconSizes: {
        Small: 'h-full w-full',
        Base: 'h-full w-full',
    },
    configuration: {
        baseClasses: inputCheckboxBaseClassNames,
        indicatorClasses: 'flex items-center justify-center text-current',
        defaultVariant: {
            variant: 'A',
            size: 'Base',
        },
    },
};

// Module Augmentation - Allow project to extend InputCheckbox variants and sizes
declare module '@structure/source/theme/providers/ComponentThemeProvider' {
    interface ComponentThemeContextValue {
        InputCheckbox?: {
            variants?: Partial<Record<InputCheckboxVariant | string, string>>;
            sizes?: Partial<Record<InputCheckboxSize | string, string>>;
            iconSizes?: Partial<Record<InputCheckboxSize | string, string>>;
            configuration?: {
                baseClasses?: string;
                indicatorClasses?: string;
                defaultVariant?: {
                    variant?: InputCheckboxVariant | string;
                    size?: InputCheckboxSize | string;
                };
            };
        };
    }
}
