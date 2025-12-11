// Dependencies - Utilities
// Use relative path to avoid Tailwind CSS resolution issues
import { mergeClassNames } from '../../../../utilities/style/ClassName';

// Theme - InputTextAreaTheme
// Common input styles
export const inputTextAreaCommonClassNames = mergeClassNames(
    // Content
    'content--0',
    // Placeholder
    'placeholder:opacity-50',
    // Placeholder (disabled)
    'disabled:placeholder:opacity-20',
    // Disabled
    'disabled:cursor-not-allowed disabled:opacity-50',
);

// Background styles (matching InputText)
// Background - keep the background a bit lighter in light mode and bit darker in dark mode
export const inputTextAreaCommonBackgroundClassNames = 'background--2 inset-shadow-xs dark:background--3';

// Border styles (matching InputText - using rounded-lg instead of rounded-sm)
export const inputTextAreaCommonBorderClassNames = 'rounded-lg border border--1';

// Focus styles: border color changes on focus, disable outline to prevent double border
export const inputTextAreaCommonFocusClassNames = 'focus:border--focus focus-visible:outline-none';

// Autofill styles (matching InputText)
export const inputTextAreaCommonAutofillClassNames = 'autofill:bg-transparent dark:autofill:bg-transparent';

// InputTextArea Variants Interface - Source of truth for all textarea variants
// Structure defines its base variants here, and projects can augment to add custom variants
// Example in project code:
//   declare module '@structure/source/components/forms-new/InputTextAreaTheme' {
//     interface InputTextAreaVariants {
//       CustomVariant: 'CustomVariant';
//     }
//   }
export interface InputTextAreaVariants {
    A: 'A';
    Outline: 'Outline';
    Error: 'Error';
}

// Type - InputTextArea Variant (derived from InputTextAreaVariants interface)
// Automatically includes both structure variants and any project-added variants
export type InputTextAreaVariant = keyof InputTextAreaVariants;

// InputTextArea Sizes Interface - Source of truth for all textarea sizes
// Structure defines its base sizes here, and projects can augment to add custom sizes
// Example in project code:
//   declare module '@structure/source/components/forms-new/InputTextAreaTheme' {
//     interface InputTextAreaSizes {
//       ExtraLarge: 'ExtraLarge';
//     }
//   }
export interface InputTextAreaSizes {
    Small: 'Small';
    Base: 'Base';
    Large: 'Large';
}

// Type - InputTextArea Size (derived from InputTextAreaSizes interface)
// Automatically includes both structure sizes and any project-added sizes
export type InputTextAreaSize = keyof InputTextAreaSizes;

// InputTextArea Resize Options Interface
export interface InputTextAreaResizeOptions {
    none: 'none';
    vertical: 'vertical';
    horizontal: 'horizontal';
    both: 'both';
}

export type InputTextAreaResize = keyof InputTextAreaResizeOptions;

// Type - InputTextArea Theme Configuration
// Structure must define all variants/sizes it declares in the interfaces above
// Project extensions are optional (Partial)
export interface InputTextAreaThemeConfiguration {
    variants: Partial<Record<InputTextAreaVariant, string>>;
    sizes: Partial<Record<InputTextAreaSize, string>>;
    resize: Partial<Record<InputTextAreaResize, string>>;
    configuration: {
        baseClassNames: string;
        focusClasses: string;
        defaultVariant: {
            variant?: InputTextAreaVariant;
            size?: InputTextAreaSize;
            resize?: InputTextAreaResize;
        };
    };
}

// InputTextArea Theme - Structure Default
export const inputTextAreaTheme: InputTextAreaThemeConfiguration = {
    // Variants
    variants: {
        // Variant A - Primary textarea (matches existing InputTextArea default variant)
        // Use for: Standard form textareas
        A: mergeClassNames(
            inputTextAreaCommonClassNames,
            inputTextAreaCommonBackgroundClassNames,
            inputTextAreaCommonBorderClassNames,
            inputTextAreaCommonFocusClassNames,
            inputTextAreaCommonAutofillClassNames,
        ),

        // Variant Outline - Transparent background with border only
        // Use for: Lighter, more subtle textareas, inline editing, or when background should show through
        Outline: mergeClassNames(
            inputTextAreaCommonClassNames,
            inputTextAreaCommonAutofillClassNames,
            // Border styling
            inputTextAreaCommonBorderClassNames,
            inputTextAreaCommonFocusClassNames,
        ),

        // Variant Error - Textarea with error state
        // Use for: Textareas with validation errors
        Error: mergeClassNames(
            inputTextAreaCommonClassNames,
            inputTextAreaCommonBackgroundClassNames,
            inputTextAreaCommonAutofillClassNames,
            // Border with error color
            'rounded-sm border border--negative',
            // Focus override to maintain error color
            'focus:border--negative focus-visible:outline-none',
        ),
    },

    // Sizes (matches existing InputTextArea sizes)
    sizes: {
        Small: 'px-2.5 py-1.5 text-sm',
        Base: 'px-3 py-2 text-sm w-full',
        Large: 'px-3 py-2.5 text-base',
    },

    // Resize options
    resize: {
        none: 'resize-none',
        vertical: 'resize-vertical',
        horizontal: 'resize-horizontal',
        both: 'resize',
    },

    // Configuration
    configuration: {
        // Base classes
        baseClassNames: mergeClassNames(
            inputTextAreaCommonClassNames,
            inputTextAreaCommonBackgroundClassNames,
            inputTextAreaCommonBorderClassNames,
            inputTextAreaCommonFocusClassNames,
            inputTextAreaCommonAutofillClassNames,
        ),

        // Focus classes
        focusClasses: inputTextAreaCommonFocusClassNames,

        // Default properties when not specified
        defaultVariant: {
            size: 'Base',
            resize: 'vertical',
        },
    },
};
