// Dependencies - Utilities
// Use relative path to avoid Tailwind CSS resolution issues
import { mergeClassNames } from '../../../../utilities/style/ClassName';

// Theme - InputTextTheme

// Icon container base styles (structural)
export const inputTextCommonIconContainerClassNames =
    'pointer-events-none absolute inset-y-0 flex items-center content--3';

// Container wrapper styles
export const inputTextCommonIconWrapperClassNames = 'relative w-full';

// Clear button base styles (positioning)
const inputTextCommonClearButtonClassNames = 'absolute inset-y-0 my-auto';

// Common input styles
export const inputTextCommonClassNames = mergeClassNames(
    // Content
    'content--0',
    // Placeholder
    '',
    // Placeholder (disabled)
    'disabled:placeholder:opacity-20',
    // Disabled
    'disabled:cursor-not-allowed disabled:opacity-50',
);

// Background - keep the background a bit lighter in light mode and bit darker in dark mode
export const inputTextCommonBackgroundClassNames = 'background--2 inset-shadow-xs dark:background--3';

// Border styles (from existing InputText.tsx)
export const inputTextCommonBorderClassNames = 'rounded-lg border border--1';

// Focus styles: border color changes on focus, disable outline to prevent double border
export const inputTextCommonFocusClassNames = 'focus:border--focus focus-visible:outline-none';

// Autofill styles (from existing InputText.tsx)
export const inputTextCommonAutofillClassNames = 'autofill:bg-transparent dark:autofill:bg-transparent';

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
    Outline: 'Outline';
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

// Type - Icon Size Configuration
export interface InputTextIconSizeConfiguration {
    icon: string; // Icon dimensions (size-4, size-5)
    containerLeft: string; // Left icon container positioning (left-0 pl-2.5)
    containerRight: string; // Right icon container positioning (right-0 pr-2.5)
    inputPaddingLeft: string; // Input left padding when icon present (pl-9)
    inputPaddingRight: string; // Input right padding when icon present (pr-9)
    clearButton: string; // Clear button size (size-5, size-6)
}

// Type - InputText Theme Configuration
// Structure must define all variants/sizes it declares in the interfaces above
// Project extensions are optional (Partial)
export interface InputTextThemeConfiguration {
    variants: Partial<Record<InputTextVariant, string>>;
    sizes: Partial<Record<InputTextSize, string>>;
    iconSizes: Partial<Record<InputTextSize, InputTextIconSizeConfiguration>>;
    configuration: {
        baseClassNames: string;
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
            inputTextCommonClassNames,
            inputTextCommonBackgroundClassNames,
            inputTextCommonBorderClassNames,
            inputTextCommonFocusClassNames,
            inputTextCommonAutofillClassNames,
        ),

        // Variant Outline - Transparent background with border only
        // Use for: Lighter, more subtle inputs, inline editing, or when background should show through
        Outline: mergeClassNames(
            inputTextCommonClassNames,
            inputTextCommonAutofillClassNames,
            // Border styling
            inputTextCommonBorderClassNames,
            inputTextCommonFocusClassNames,
        ),

        // Variant Error - Text input with error state
        // Use for: Inputs with validation errors
        Error: mergeClassNames(
            inputTextCommonClassNames,
            inputTextCommonBackgroundClassNames,
            inputTextCommonAutofillClassNames,
            // Border with error color
            'rounded-lg border border--negative',
            // Focus override to maintain error color
            'focus:border--negative focus-visible:outline-none',
        ),
    },

    // Sizes (using padding instead of hardcoded heights)
    sizes: {
        Small: mergeClassNames('w-full px-3 py-1.5 text-sm'),
        Base: mergeClassNames('w-full px-3 py-2 text-sm'),
        Large: mergeClassNames('w-full px-3 py-2.5 text-[15px]'),
    },

    // Icon sizes per input size
    iconSizes: {
        Small: {
            icon: 'size-4',
            containerLeft: 'left-0 ml-2.5',
            containerRight: 'right-0 mr-2.5',
            inputPaddingLeft: 'pl-9',
            inputPaddingRight: 'pr-9',
            clearButton: mergeClassNames(inputTextCommonClearButtonClassNames, 'size-7'),
        },
        Base: {
            icon: 'size-4',
            containerLeft: 'left-0 ml-3',
            containerRight: 'right-0 mr-3',
            inputPaddingLeft: 'pl-10',
            inputPaddingRight: 'pr-10',
            clearButton: mergeClassNames(inputTextCommonClearButtonClassNames, 'size-8'),
        },
        Large: {
            icon: 'size-4.5',
            containerLeft: 'left-0 ml-4',
            containerRight: 'right-0 mr-2',
            inputPaddingLeft: 'pl-11',
            inputPaddingRight: 'pr-11',
            clearButton: mergeClassNames(inputTextCommonClearButtonClassNames, 'size-8'),
        },
    },

    // Configuration
    configuration: {
        // Base classes
        baseClassNames: mergeClassNames(
            inputTextCommonClassNames,
            inputTextCommonBackgroundClassNames,
            inputTextCommonBorderClassNames,
            inputTextCommonFocusClassNames,
            inputTextCommonAutofillClassNames,
        ),

        // Focus classes
        focusClasses: inputTextCommonFocusClassNames,

        // Default properties when not specified
        defaultVariant: {
            size: 'Base',
        },
    },
};
