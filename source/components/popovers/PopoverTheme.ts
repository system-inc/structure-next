/**
 * Structure Popover Theme
 *
 * Default popover theme for the structure library. Provides portable, framework-agnostic
 * popover variants that work out-of-the-box in any project.
 *
 * Projects can override/extend this theme via ProjectSettings.theme.components.Popover
 */

// Base styles shared across all variants
export const basePopoverClassNames =
    // Focus
    `outline-none ` +
    // Background and text
    `bg-opsis-background-primary foreground--a ` +
    // Border radius
    `rounded-small ` +
    // Base width
    `w-full`;

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
    Tip: 'Tip';
}

// Type - Popover Variant (derived from PopoverVariants interface)
// Automatically includes both structure variants and any project-added variants
export type PopoverVariant = keyof PopoverVariants;

// Type - Popover Theme Configuration
// Structure must define all variants it declares in the interface above
// Project extensions are optional (Partial)
export interface PopoverThemeConfiguration {
    variants: Partial<Record<PopoverVariant, string>>;
    configuration: {
        baseClasses: string;
        defaultVariant?: {
            variant?: PopoverVariant;
        };
    };
}

// Popover Theme - Structure Default
export const popoverTheme: PopoverThemeConfiguration = {
    variants: {
        // Primary variant - Border with background, suitable for general content (popovers, dropdowns)
        A: `${basePopoverClassNames} ` + `border border-light-4 dark:border-dark-4`,
        // Tip variant - Compact tooltips without full width
        Tip:
            `outline-none ` +
            `bg-opsis-background-primary foreground--a ` +
            `max-w-56 rounded-small px-3 py-2 text-sm shadow-04 ` +
            `border border-light-4 dark:border-dark-4`,
    },
    configuration: {
        baseClasses: '',
        defaultVariant: {
            // No default variant - must opt in
        },
    },
};
