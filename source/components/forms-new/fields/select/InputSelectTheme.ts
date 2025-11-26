// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Theme - InputSelectTheme
// Common select styles
export const commonInputSelectClassNames = mergeClassNames(
    // Content
    'content--0',
    // Placeholder
    'placeholder:opacity-50',
    // Disabled
    'disabled:cursor-not-allowed disabled:opacity-80',
);

// Background styles
// Background - keep the background a bit lighter in light mode and bit darker in dark mode
export const backgroundStyleClassNames = 'background--2 inset-shadow-xs dark:background--3';

// Border styles
export const borderStyleClassNames = 'rounded-lg border border--1';

// Focus styles: border color changes on focus, disable outline to prevent double border
export const focusStyleClassNames = 'focus:border--focus focus-visible:outline-none';

// InputSelect Variants Interface - Source of truth for all input select variants
// Structure defines its base variants here, and projects can augment to add custom variants
export interface InputSelectVariants {
    A: 'A';
    Outline: 'Outline';
    Error: 'Error';
}

// Type - InputSelect Variant (derived from InputSelectVariants interface)
// Automatically includes both structure variants and any project-added variants
export type InputSelectVariant = keyof InputSelectVariants;

// InputSelect Sizes Interface - Source of truth for all input select sizes
// Structure defines its base sizes here, and projects can augment to add custom sizes
export interface InputSelectSizes {
    Small: 'Small';
    Base: 'Base';
    Large: 'Large';
}

// Type - InputSelect Size (derived from InputSelectSizes interface)
// Automatically includes both structure sizes and any project-added sizes
export type InputSelectSize = keyof InputSelectSizes;

// Type - InputSelect Theme Configuration
// Structure must define all variants/sizes it declares in the interfaces above
// Project extensions are optional (Partial)
export interface InputSelectThemeConfiguration {
    variants: Partial<Record<InputSelectVariant, string>>;
    sizes: Partial<Record<InputSelectSize, string>>;
    configuration: {
        baseClasses: string;
        focusClasses: string;
        defaultVariant: {
            variant?: InputSelectVariant;
            size?: InputSelectSize;
        };
    };
}

// InputSelect Theme - Structure Default
export const inputSelectTheme: InputSelectThemeConfiguration = {
    // Variants
    variants: {
        // Variant A - Primary select input
        // Use for: Standard form select inputs
        A: mergeClassNames(
            commonInputSelectClassNames,
            backgroundStyleClassNames,
            borderStyleClassNames,
            focusStyleClassNames,
        ),

        // Variant Error - Select input with error state
        // Use for: Selects with validation errors
        Error: mergeClassNames(
            commonInputSelectClassNames,
            backgroundStyleClassNames,
            // Border with error color
            'rounded-lg border border--negative',
            // Focus override to maintain error color
            'focus:border--negative focus-visible:outline-none',
        ),
    },

    // Sizes
    sizes: {
        Small: mergeClassNames('h-8 w-full px-3 text-sm'),
        Base: mergeClassNames('h-9 w-full px-3 text-sm'),
        Large: mergeClassNames('w-full px-3 py-2.5 text-[15px]'),
    },

    // Configuration
    configuration: {
        // Base classes
        baseClasses: mergeClassNames(
            commonInputSelectClassNames,
            backgroundStyleClassNames,
            borderStyleClassNames,
            focusStyleClassNames,
        ),

        // Focus classes
        focusClasses: focusStyleClassNames,

        // Default properties when not specified
        defaultVariant: {
            size: 'Base',
        },
    },
};
