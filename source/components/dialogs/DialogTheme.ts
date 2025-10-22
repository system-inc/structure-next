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
    'bg-background/60',
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

// Base styles for dialog header
export const baseDialogHeaderClassNames = mergeClassNames(
    // Flex layout with vertical spacing
    'flex flex-col space-y-1.5',
    // Text alignment
    'text-left',
);

// Base styles for dialog footer
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
    Default: 'Default';
    Unstyled: 'Unstyled';
    UnstyledTopFixed: 'UnstyledTopFixed';
    FullScreenWithMargin: 'FullScreenWithMargin';
}

// Type - Dialog Variant (derived from DialogVariants interface)
// Automatically includes both structure variants and any project-added variants
export type DialogVariant = keyof DialogVariants;

// Type - Dialog Theme Configuration
// Structure must define all variants it declares in the interface above
// Project extensions are optional (Partial)
export interface DialogThemeConfiguration {
    variants: Partial<Record<DialogVariant, string>>;
    configuration: {
        baseClasses: string;
        overlayClasses: string;
        closeClasses: string;
        headerClasses: string;
        footerClasses: string;
        defaultVariant?: {
            variant?: DialogVariant;
        };
    };
}

// Dialog Theme - Structure Default
export const dialogTheme: DialogThemeConfiguration = {
    // Variants
    variants: {
        // Default variant - Centered modal with border and shadow
        Default: mergeClassNames(
            dialogContentPositionCenteredClassNames,
            // Border, background, and shadow
            'flex w-full flex-col gap-4 rounded-lg border border--0 background--0 p-6 shadow-lg',
        ),

        // Unstyled centered variant
        Unstyled: dialogContentPositionCenteredClassNames,

        // Unstyled top fixed variant
        UnstyledTopFixed: dialogContentPositionTopFixedClassNames,

        // Full screen with margin
        FullScreenWithMargin: mergeClassNames(
            dialogContentPositionCenteredClassNames,
            'flex w-full flex-col gap-4 rounded-lg border border--0 background--0 p-6 shadow-lg',
            'h-full max-h-[calc(100vh-8rem)] w-full max-w-[calc(100vw-8rem)] md:max-h-[calc(100vh-8rem)] md:max-w-[calc(100vw-8rem)]',
        ),
    },

    // Configuration
    configuration: {
        // Base classes (empty = variants handle their own base styles)
        baseClasses: '',

        // Overlay classes
        overlayClasses: baseDialogOverlayClassNames,

        // Close button classes
        closeClasses: baseDialogCloseClassNames,

        // Header classes
        headerClasses: baseDialogHeaderClassNames,

        // Footer classes
        footerClasses: baseDialogFooterClassNames,

        // Default variant
        defaultVariant: {
            variant: 'Default',
        },
    },
};
