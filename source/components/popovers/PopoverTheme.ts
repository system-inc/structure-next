/**
 * Structure Popover Theme
 *
 * Default popover theme for the structure library. Provides portable, framework-agnostic
 * popover variants that work out-of-the-box in any project.
 *
 * Projects can override/extend this theme via ProjectSettings.theme.components.Popover
 */

// Dependencies - Utilities
import { mergeClassNames } from '../../utilities/style/ClassName';

// Base styles shared across all popovers
export const basePopoverClassNames = mergeClassNames(
    // Focus - Remove outline from popover container (focus should be on interactive elements inside)
    'outline-none',
);

// Popover Variants Interface - Source of truth for all popover variants
// Structure defines its base variants here, and projects can augment to add custom variants
// Example in project code:
//   declare module '@structure/source/components/popovers/PopoverTheme' {
//     interface PopoverVariants {
//       CustomVariant: 'CustomVariant';
//     }
//   }
export interface PopoverVariants {
    A: 'A';
    B: 'B';
    Tip: 'Tip';
}

// Type - Popover Variant (derived from PopoverVariants interface)
// Automatically includes both structure variants and any project-added variants
export type PopoverVariant = keyof PopoverVariants;

// Popover Sizes Interface - Source of truth for all popover sizes
// Structure defines its base sizes here, and projects can augment to add custom sizes
// Example in project code:
//   declare module '@structure/source/components/popovers/PopoverTheme' {
//     interface PopoverSizes {
//       TipLarge: 'TipLarge';
//     }
//   }
export interface PopoverSizes {
    Base: 'Base';
    Tip: 'Tip';
}

// Type - Popover Size (derived from PopoverSizes interface)
// Automatically includes both structure sizes and any project-added sizes
export type PopoverSize = keyof PopoverSizes;

// Type - Popover Theme Configuration
// Structure must define all variants/sizes it declares in the interfaces above
// Project extensions are optional (Partial)
export interface PopoverThemeConfiguration {
    variants: Partial<Record<PopoverVariant, string>>;
    sizes: Partial<Record<PopoverSize, string>>;
    configuration: {
        baseClasses: string;
        defaultVariant?: {
            variant?: PopoverVariant;
            size?: PopoverSize;
        };
    };
}

// Popover Theme - Structure Default
export const popoverTheme: PopoverThemeConfiguration = {
    // Variants control visual styling (colors, borders, shadows)
    variants: {
        // Variant A - Primary popover with subtle border
        // Use for: Dropdowns, menus, general popover content
        A: mergeClassNames(basePopoverClassNames, 'border border--0 background--0 content--0'),

        // Variant B - Secondary popover with more prominent border
        // Use for: Alternative popover styling
        B: mergeClassNames(basePopoverClassNames, 'border border--1 background--0 content--0'),

        // Variant Tip - Compact tooltip styling with shadow
        // Use for: Tooltips, help text, brief explanatory content
        Tip: mergeClassNames(basePopoverClassNames, 'border border--3 background--0 content--0 shadow-lg'),
    },

    // Sizes control dimensions (padding, width, text size, border radius)
    sizes: {
        // Base size - Full-width popovers for dropdowns and menus
        // Matches trigger width via Radix variables
        Base: 'rounded-lg',

        // Tip size - Compact tooltips with constrained width
        // Fixed max-width for brief content
        Tip: 'max-w-56 px-3 py-2 text-sm rounded-xl',
    },

    configuration: {
        baseClasses: '',
        defaultVariant: {
            variant: 'A',
            size: 'Base',
        },
    },
};
