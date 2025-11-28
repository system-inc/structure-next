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

// Base styles for drawer header (layout only, no padding - padding comes from variant)
export const baseDrawerHeaderClassNames = mergeClassNames(
    // Flex layout with vertical spacing
    'flex flex-col space-y-1.5',
    // Text alignment
    'text-left',
);

// Base styles for drawer body (structural only, no padding - padding comes from variant)
export const baseDrawerBodyClassNames = 'grow overflow-y-auto';

// Base styles for drawer footer (layout only, no padding - padding comes from variant)
export const baseDrawerFooterClassNames = mergeClassNames(
    // Flex layout with spacing
    'flex flex-row justify-end space-x-2',
);

// Drawer theme configuration
export interface DrawerThemeConfiguration {
    // Container-level variant classes (border, background)
    variants: Partial<Record<DrawerVariant, string>>;

    // Per-part variant classes (TabsTheme pattern)
    // These allow each compound part to have variant-specific styling
    // When no variant is set, parts are truly unstyled (no padding)
    variantHeaderClasses: Partial<Record<DrawerVariant, string>>;
    variantBodyClasses: Partial<Record<DrawerVariant, string>>;
    variantFooterClasses: Partial<Record<DrawerVariant, string>>;

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
        // Header base classes (layout only, no padding)
        headerBaseClasses: string;
        // Body base classes (structural only, no padding)
        bodyBaseClasses: string;
        // Footer base classes (layout only, no padding)
        footerBaseClasses: string;
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
    // Variants control visual styling (border, background)
    // NOTE: Padding moved to per-part variant classes for consistency
    variants: {
        A: mergeClassNames('border--0 background--0 dark:background--0'),
        B: mergeClassNames('border--1 background--0 dark:background--1'),
        C: mergeClassNames('border--2 background--0 dark:background--2'),
        D: mergeClassNames('border--3 background--0 dark:background--3'),
    },

    // Per-part variant classes - padding for each compound part when variant is active
    // When no variant is set, parts are truly unstyled (no padding)
    variantHeaderClasses: {
        A: 'shrink-0 px-6 pt-6 pb-4',
        B: 'shrink-0 px-6 pt-6 pb-4',
        C: 'shrink-0 px-6 pt-6 pb-4',
        D: 'shrink-0 px-6 pt-6 pb-4',
    },
    variantBodyClasses: {
        A: 'px-6',
        B: 'px-6',
        C: 'px-6',
        D: 'px-6',
    },
    variantFooterClasses: {
        A: 'shrink-0 px-6 pt-4 pb-6',
        B: 'shrink-0 px-6 pt-4 pb-6',
        C: 'shrink-0 px-6 pt-4 pb-6',
        D: 'shrink-0 px-6 pt-4 pb-6',
    },

    // Sides control where the drawer slides in from
    sides: {
        // Top side - Drawer slides in from top
        // Use for: Notifications, search bars
        Top: mergeClassNames('inset-x-0 top-12 max-h-screen'),

        // Bottom side - Drawer slides in from bottom
        // Use for: Mobile menus, action sheets, forms
        Bottom: mergeClassNames('inset-x-0 bottom-0 max-h-[80vh] rounded-t-3xl border-t'),

        // Left side - Drawer slides in from left
        // Use for: Navigation menus, side panels
        Left: mergeClassNames('inset-y-0 left-0 h-screen w-screen max-w-[min(20rem,85vw)] border-r'),

        // Right side - Drawer slides in from right
        // Use for: Side panels, settings, filters
        Right: mergeClassNames('inset-y-0 right-0 h-screen w-screen max-w-[min(20rem,85vw)] border-l'),
    },

    // Configuration
    configuration: {
        // Base classes (empty = unstyled by default, sides/variants add their own styles)
        baseClasses: 'flex flex-col',

        // Base wrapper classes
        baseWrapperClasses: mergeClassNames('fixed z-50 flex flex-col'),

        // Overlay classes
        overlayClasses: mergeClassNames('fixed inset-0 z-40 bg-dark-500'),

        // Close button classes
        closeClasses: baseDrawerCloseClassNames,

        // Header base classes (layout only, no padding)
        headerBaseClasses: baseDrawerHeaderClassNames,

        // Body base classes (structural only, no padding)
        bodyBaseClasses: baseDrawerBodyClassNames,

        // Footer base classes (layout only, no padding)
        footerBaseClasses: baseDrawerFooterClassNames,

        // Default properties when not specified
        defaultVariant: {
            // No default variant = unstyled (user must explicitly choose variant="A")
            side: 'Bottom',
        },
    },
};
