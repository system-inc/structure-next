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

// Drawer theme configuration
export interface DrawerThemeConfiguration {
    // Variants control visual styling (border, background, padding)
    variants: {
        [K in DrawerVariant]: string;
    };
    // Sides control where the drawer slides in from (positioning and sizing)
    sides: {
        [K in DrawerSide]: {
            wrapperClasses: string;
        };
    };
    // Configuration
    configuration: {
        // Base classes for the drawer wrapper
        baseWrapperClasses: string;
        // Overlay classes
        overlayClasses: string;
        // Default properties when not specified
        defaultVariant: {
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
        // Variant A - Styled drawer with border and background
        // Use for: Standard drawers, forms, menus
        A: mergeClassNames('background--0', 'border border--0'),
    },

    // Sides control where the drawer slides in from
    sides: {
        // Top side - Drawer slides in from top
        // Use for: Notifications, search bars
        Top: {
            wrapperClasses: 'max-h-screen top-12 inset-x-0',
        },

        // Bottom side - Drawer slides in from bottom
        // Use for: Mobile menus, action sheets, forms
        Bottom: {
            wrapperClasses: 'bottom-0 max-h-[80vh] rounded-t-3xl',
        },

        // Right side - Drawer slides in from right
        // Use for: Side panels, settings, filters
        Right: {
            wrapperClasses: 'right-0 inset-y-0 h-screen w-screen',
        },

        // Left side - Drawer slides in from left
        // Use for: Navigation menus, side panels
        Left: {
            wrapperClasses: 'left-0 inset-y-0 h-screen w-screen',
        },
    },

    // Configuration
    configuration: {
        baseWrapperClasses: mergeClassNames('fixed inset-x-0 h-auto w-full', 'z-50', 'flex flex-col'),
        overlayClasses: mergeClassNames('fixed inset-0 z-40 background--backdrop'),
        // Default properties when not specified
        defaultVariant: {
            // No default variant = unstyled (user must explicitly choose variant="A")
            side: 'Bottom',
        },
    },
};
