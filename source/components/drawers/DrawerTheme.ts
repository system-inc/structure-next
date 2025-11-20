/**
 * Structure Drawer Theme
 *
 * Default drawer theme for the structure library. Provides portable, framework-agnostic
 * drawer variants that work out-of-the-box in any project.
 *
 * Projects can override/extend this theme via ProjectSettings.theme.components.Drawer
 */

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Drawer Variants Interface - Source of truth for all drawer variants
// Structure defines its base variants here, and projects can augment to add custom variants
// Example in project code:
//   declare module '@structure/source/components/drawers/DrawerTheme' {
//     interface DrawerVariants {
//       CustomVariant: 'CustomVariant';
//     }
//   }
export interface DrawerVariants {
    A: 'A';
    B: 'B';
    C: 'C';
    D: 'D';
}

// Type - Drawer Variant (derived from DrawerVariants interface)
// Automatically includes both structure variants and any project-added variants
export type DrawerVariant = keyof DrawerVariants;

// Drawer Sides Interface - Source of truth for all drawer sides
// Structure defines its base sides here, and projects can augment to add custom sides
// Example in project code:
//   declare module '@structure/source/components/drawers/DrawerTheme' {
//     interface DrawerSides {
//       CustomSide: 'CustomSide';
//     }
//   }
export interface DrawerSides {
    Top: 'Top';
    Bottom: 'Bottom';
    Left: 'Left';
    Right: 'Right';
}

// Type - Drawer Side (derived from DrawerSides interface)
// Automatically includes both structure sides and any project-added sides
export type DrawerSide = keyof DrawerSides;

// Base styles for drawer close button
export const baseDrawerCloseClassNames = mergeClassNames(
    // Position
    'absolute top-4 right-4',
    // Z-index to ensure it's above content
    'z-10',
);

// Base styles for drawer header
export const baseDrawerHeaderClassNames = mergeClassNames(
    // Flex and spacing
    'shrink-0 px-6 pt-6 pb-4',
);

// Base styles for drawer footer
export const baseDrawerFooterClassNames = mergeClassNames(
    // Flex layout with spacing
    'flex flex-row justify-end space-x-2',
);

// Drawer theme configuration
export interface DrawerThemeConfiguration {
    // Variants control visual styling (border, background, padding)
    variants: Partial<Record<DrawerVariant, string>>;
    // Sides control where the drawer slides in from (positioning and sizing)
    sides: Partial<Record<DrawerSide, string>>;
    // Configuration
    configuration: {
        // Base classes for all drawer content
        baseClasses: string;
        // Base classes for the drawer wrapper
        baseWrapperClasses: string;
        // Overlay classes
        overlayClasses: string;
        // Close button classes
        closeClasses: string;
        // Header classes
        headerClasses: string;
        // Footer classes
        footerClasses: string;
        // Default properties when not specified
        defaultVariant?: {
            // No default variant = unstyled
            variant?: DrawerVariant;
            side?: DrawerSide;
        };
    };
}

// Default drawer theme
export const drawerTheme: DrawerThemeConfiguration = {
    // Variants control visual styling (border, background, padding)
    variants: {
        A: mergeClassNames('border--0 background--0 dark:background--0'),
        B: mergeClassNames('border--1 background--0 dark:background--1'),
        C: mergeClassNames('border--2 background--0 dark:background--2'),
        D: mergeClassNames('border--3 background--0 dark:background--3'),
    },

    // Sides control where the drawer slides in from
    sides: {
        // Top side - Drawer slides in from top
        // Use for: Notifications, search bars
        Top: mergeClassNames('inset-x-0 top-12 max-h-screen'),

        // Bottom side - Drawer slides in from bottom
        // Use for: Mobile menus, action sheets, forms
        Bottom: mergeClassNames('bottom-0 max-h-[80vh] rounded-t-3xl border-t'),

        // Right side - Drawer slides in from right
        // Use for: Side panels, settings, filters
        Right: mergeClassNames('inset-y-0 right-0 h-screen w-screen max-w-[min(20rem,80vw)] border-l'),

        // Left side - Drawer slides in from left
        // Use for: Navigation menus, side panels
        Left: mergeClassNames('inset-y-0 left-0 h-screen w-screen max-w-[min(20rem,80vw)] border-r'),
    },

    // Configuration
    configuration: {
        // Base classes (empty = unstyled by default, sides/variants add their own styles)
        baseClasses: '',

        // Base wrapper classes
        baseWrapperClasses: mergeClassNames('fixed inset-x-0 h-auto w-full', 'z-50', 'flex flex-col'),

        // Overlay classes
        overlayClasses: mergeClassNames('fixed inset-0 z-40 background--backdrop'),

        // Close button classes
        closeClasses: baseDrawerCloseClassNames,

        // Header classes
        headerClasses: baseDrawerHeaderClassNames,

        // Footer classes
        footerClasses: baseDrawerFooterClassNames,

        // Default properties when not specified
        defaultVariant: {
            // No default variant = unstyled (user must explicitly choose variant="A")
            side: 'Bottom',
        },
    },
};
