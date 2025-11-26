/**
 * Structure Dialog Theme
 *
 * Default dialog theme for the structure library. Provides portable, framework-agnostic
 * dialog variants that work out-of-the-box in any project.
 *
 * Projects can override/extend this theme via ProjectSettings.theme.components.Dialog
 */

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Base styles for dialog overlay
export const baseDialogOverlayClassNames = mergeClassNames(
    // Position and z-index
    'fixed inset-0 z-50',
    // Background and backdrop
    'background--backdrop',
    // Animation states
    'data-[state=open]:animate-in data-[state=open]:fade-in-0',
    // Fade animation
    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
);

// Base styles for dialog close button
export const baseDialogCloseClassNames = mergeClassNames(
    // Position
    'absolute top-4 right-4',
    // Z-index to ensure it's above content
    'z-10',
);

// Base styles for dialog header (layout only, no padding - padding comes from variant)
export const baseDialogHeaderClassNames = mergeClassNames(
    // Flex layout with vertical spacing
    'flex flex-col space-y-1.5',
    // Text alignment
    'text-left',
);

// Base styles for dialog body (structural only, no padding - padding comes from variant)
export const baseDialogBodyClassNames = 'grow overflow-y-auto';

// Base styles for dialog footer (layout only, no padding - padding comes from variant)
export const baseDialogFooterClassNames =
    // Flex layout with spacing
    'flex flex-row justify-end space-x-2';

// Positioning - Centered (for desktop dialog)
export const dialogContentPositionCenteredClassNames = mergeClassNames(
    // Position, outline, and z-index
    'fixed top-[50%] left-[50%] z-50 outline-none',
    // Flex layout and alignment
    'max-h-[95vh] w-full max-w-[90vw] md:max-w-lg',
    // Animation states
    'duration-200',
    // Open animation
    'data-[state=open]:animate-in-centered data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
    // Close animation
    'data-[state=closed]:animate-out-centered data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
);

// Positioning - Top Fixed
export const dialogContentPositionTopFixedClassNames = mergeClassNames(
    // Position, outline, and z-index
    'fixed top-[10%] left-[50%] z-50 outline-none',
    // Grid layout and alignment
    'grid w-full max-w-lg translate-x-[-50%] translate-y-[0%] gap-4',
    // Animation states
    'duration-200',
    // Open animation
    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2',
    // Close animation
    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2',
);

// Dialog Variants Interface - Source of truth for all dialog variants
// Structure defines its base variants here, and projects can augment to add custom variants
// Example in project code:
//   declare module '@structure/source/components/dialogs/DialogTheme' {
//     interface DialogVariants {
//       CustomVariant: 'CustomVariant';
//     }
//   }
export interface DialogVariants {
    A: 'A';
}

// Type - Dialog Variant (derived from DialogVariants interface)
// Automatically includes both structure variants and any project-added variants
export type DialogVariant = keyof DialogVariants;

// Dialog Positions Interface - Source of truth for all dialog positions
// Structure defines its base positions here, and projects can augment to add custom positions
// Example in project code:
//   declare module '@structure/source/components/dialogs/DialogTheme' {
//     interface DialogPositions {
//       BottomSheet: 'BottomSheet';
//     }
//   }
export interface DialogPositions {
    Centered: 'Centered';
    TopFixed: 'TopFixed';
}

// Type - Dialog Position (derived from DialogPositions interface)
// Automatically includes both structure positions and any project-added positions
export type DialogPosition = keyof DialogPositions;

// Dialog Sizes Interface - Source of truth for all dialog sizes
// Structure defines its base sizes here, and projects can augment to add custom sizes
// Example in project code:
//   declare module '@structure/source/components/dialogs/DialogTheme' {
//     interface DialogSizes {
//       Large: 'Large';
//     }
//   }
export interface DialogSizes {
    Base: 'Base';
    FullScreen: 'FullScreen';
}

// Type - Dialog Size (derived from DialogSizes interface)
// Automatically includes both structure sizes and any project-added sizes
export type DialogSize = keyof DialogSizes;

// Type - Dialog Theme Configuration
// Structure must define all variants/positions/sizes it declares in the interfaces above
// Project extensions are optional (Partial)
export interface DialogThemeConfiguration {
    // Container-level variant classes
    variants: Partial<Record<DialogVariant, string>>;

    // Per-part variant classes (TabsTheme pattern)
    // These allow each compound part to have variant-specific styling
    // When no variant is set, parts are truly unstyled (no padding)
    variantHeaderClasses: Partial<Record<DialogVariant, string>>;
    variantBodyClasses: Partial<Record<DialogVariant, string>>;
    variantFooterClasses: Partial<Record<DialogVariant, string>>;

    positions: Partial<Record<DialogPosition, string>>;
    sizes: Partial<Record<DialogSize, string>>;
    configuration: {
        baseClasses: string;
        overlayClasses: string;
        closeClasses: string;
        headerBaseClasses: string;
        bodyBaseClasses: string;
        footerBaseClasses: string;
        defaultVariant?: {
            variant?: DialogVariant;
            position?: DialogPosition;
            size?: DialogSize;
        };
    };
}

// Dialog Theme - Structure Default
export const dialogTheme: DialogThemeConfiguration = {
    // Variants control visual styling (border, background, shadow)
    // NOTE: Padding moved to per-part variant classes for consistency between mobile/desktop
    variants: {
        // Variant A - Styled modal with border and shadow
        // Use for: Standard dialogs, modals, forms
        A: 'flex w-full flex-col rounded-lg border border--0 background--0 shadow-lg',
    },

    // Per-part variant classes - padding for each compound part when variant is active
    // When no variant is set, parts are truly unstyled (no padding)
    variantHeaderClasses: {
        A: 'shrink-0 px-6 pt-6 pb-4',
    },
    variantBodyClasses: {
        A: 'px-6',
    },
    variantFooterClasses: {
        A: 'shrink-0 px-6 pt-4 pb-6',
    },

    // Positions control where the dialog appears on screen
    positions: {
        // Centered position - Dialog centered in viewport
        // Use for: Standard modals, forms, confirmations
        Centered: dialogContentPositionCenteredClassNames,

        // Top fixed position - Dialog fixed near top of viewport
        // Use for: Notifications, search bars, quick actions
        TopFixed: dialogContentPositionTopFixedClassNames,
    },

    // Sizes control dialog dimensions
    sizes: {
        // Base size - Standard modal width
        // Max width: lg (32rem), max height: 95vh
        Base: 'max-h-[95vh] w-full max-w-[90vw] md:max-w-lg',

        // Full screen size - Nearly full viewport with margin
        // Uses calc() to leave breathing room around edges
        FullScreen:
            'h-full max-h-[calc(100vh-8rem)] w-full max-w-[calc(100vw-8rem)] md:max-h-[calc(100vh-8rem)] md:max-w-[calc(100vw-8rem)]',
    },

    // Configuration
    configuration: {
        // Base classes (empty = unstyled by default, positions/sizes/variants add their own styles)
        baseClasses: 'flex flex-col',

        // Overlay classes
        overlayClasses: baseDialogOverlayClassNames,

        // Close button classes
        closeClasses: baseDialogCloseClassNames,

        // Header base classes (layout only, no padding)
        headerBaseClasses: baseDialogHeaderClassNames,

        // Body base classes (structural only, no padding)
        bodyBaseClasses: baseDialogBodyClassNames,

        // Footer base classes (layout only, no padding)
        footerBaseClasses: baseDialogFooterClassNames,

        // Default properties when not specified
        defaultVariant: {
            // No default variant = unstyled
            position: 'Centered',
            size: 'Base',
        },
    },
};
