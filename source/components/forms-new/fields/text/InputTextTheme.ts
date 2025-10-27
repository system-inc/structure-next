// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Theme - InputTextTheme
// Common input styles
export const commonInputTextClassNames = mergeClassNames(
    // Content
    'content--0',
    // Placeholder
    'placeholder:opacity-70',
    // Placeholder (disabled)
    'disabled:placeholder:opacity-20',
    // Disabled
    'disabled:cursor-not-allowed disabled:opacity-20',
);

// Background styles (from existing InputText.tsx)
// Background - keep the background a bit lighter in light mode and bit darker in dark mode
export const backgroundStyleClassNames = 'background--2 inset-shadow-xs dark:background--3';

// Border styles (from existing InputText.tsx)
export const borderStyleClassNames = 'rounded-lg border border--1';

// Focus styles: border color changes on focus, disable outline to prevent double border
export const focusStyleClassNames = 'focus:border--focus focus-visible:outline-none';

// Autofill styles (from existing InputText.tsx)
export const autofillStyleClassNames = 'autofill:bg-transparent dark:autofill:bg-transparent';

// InputText Variants Interface - Source of truth for all input text variants
// Structure defines its base variants here, and projects can augment to add custom variants
// Example in project code:
//   declare module '@structure/source/components/forms-new/InputTextTheme' {
//     interface InputTextVariants {
//       CustomVariant: 'CustomVariant';
//     }
//   }
export interface InputTextVariants {
    A: 'A';
    Error: 'Error';
}

// Type - InputText Variant (derived from InputTextVariants interface)
// Automatically includes both structure variants and any project-added variants
export type InputTextVariant = keyof InputTextVariants;

// InputText Sizes Interface - Source of truth for all input text sizes
// Structure defines its base sizes here, and projects can augment to add custom sizes
// Example in project code:
//   declare module '@structure/source/components/forms-new/InputTextTheme' {
//     interface InputTextSizes {
//       ExtraLarge: 'ExtraLarge';
//     }
//   }
export interface InputTextSizes {
    Small: 'Small';
    Base: 'Base';
    Large: 'Large';
}

// Type - InputText Size (derived from InputTextSizes interface)
// Automatically includes both structure sizes and any project-added sizes
export type InputTextSize = keyof InputTextSizes;

// Type - InputText Theme Configuration
// Structure must define all variants/sizes it declares in the interfaces above
// Project extensions are optional (Partial)
export interface InputTextThemeConfiguration {
    variants: Partial<Record<InputTextVariant, string>>;
    sizes: Partial<Record<InputTextSize, string>>;
    configuration: {
        baseClasses: string;
        focusClasses: string;
        defaultVariant: {
            variant?: InputTextVariant;
            size?: InputTextSize;
        };
    };
}

// InputText Theme - Structure Default
export const inputTextTheme: InputTextThemeConfiguration = {
    // Variants
    variants: {
        // Variant A - Primary text input (matches existing InputText default variant)
        // Use for: Standard form text inputs
        A: mergeClassNames(
            commonInputTextClassNames,
            backgroundStyleClassNames,
            borderStyleClassNames,
            focusStyleClassNames,
            autofillStyleClassNames,
        ),

        // Variant Error - Text input with error state
        // Use for: Inputs with validation errors
        Error: mergeClassNames(
            commonInputTextClassNames,
            backgroundStyleClassNames,
            autofillStyleClassNames,
            // Border with error color
            'rounded-lg border border--negative',
            // Focus override to maintain error color
            'focus:border--negative focus-visible:outline-none',
        ),
    },

    // Sizes (matches existing InputText sizes)
    sizes: {
        Small: 'h-8 px-3 text-sm',
        Base: 'h-9 px-3 text-sm w-full',
        Large: 'h-10 px-3 text-base',
    },

    // Configuration
    configuration: {
        // Base classes
        baseClasses: mergeClassNames(
            commonInputTextClassNames,
            backgroundStyleClassNames,
            borderStyleClassNames,
            focusStyleClassNames,
            autofillStyleClassNames,
        ),

        // Focus classes
        focusClasses: focusStyleClassNames,

        // Default properties when not specified
        defaultVariant: {
            variant: 'A',
            size: 'Base',
        },
    },
};
