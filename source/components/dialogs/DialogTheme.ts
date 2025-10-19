/**
 * Structure Dialog Theme
 *
 * Default dialog theme for the structure library. Provides portable, framework-agnostic
 * dialog variants that work out-of-the-box in any project.
 *
 * Projects can override/extend this theme via ProjectSettings.theme.components.Dialog
 */

// Base styles for dialog overlay
export const baseDialogOverlayClassNames =
    // Position and z-index
    'fixed inset-0 z-50 ' +
    // Background and backdrop
    'bg-background/60 ' +
    // Animation states
    'data-[state=open]:animate-in data-[state=open]:fade-in-0 ' +
    // Fade animation
    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0';

// Base styles for dialog close button
export const baseDialogCloseClassNames =
    // Position
    'absolute right-4 top-4 ' +
    // Z-index to ensure it's above content
    'z-10';

// Base styles for dialog header
export const baseDialogHeaderClassNames =
    // Flex layout with vertical spacing
    'flex flex-col space-y-1.5 ' +
    // Text alignment
    'text-left';

// Base styles for dialog footer
export const baseDialogFooterClassNames =
    // Flex layout with spacing
    'flex flex-row justify-end space-x-2';

// Positioning - Centered (for desktop dialog)
export const dialogContentPositionCenteredClassNames =
    // Position, outline, and z-index
    'outline-none fixed left-[50%] top-[50%] z-50 ' +
    // Flex layout and alignment
    'w-full max-w-[90vw] md:max-w-lg max-h-[95vh] ' +
    // Animation states
    'duration-200 ' +
    // Open animation
    'data-[state=open]:animate-in-centered data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] ' +
    // Close animation
    'data-[state=closed]:animate-out-centered data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]';

// Positioning - Top Fixed
export const dialogContentPositionTopFixedClassNames =
    // Position, outline, and z-index
    'outline-none fixed left-[50%] top-[10%] z-50 ' +
    // Grid layout and alignment
    'grid w-full max-w-lg translate-x-[-50%] translate-y-[0%] gap-4 ' +
    // Animation states
    'duration-200 ' +
    // Open animation
    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 ' +
    // Close animation
    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2';

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
        Default:
            `${dialogContentPositionCenteredClassNames} ` +
            // Border, background, and shadow
            'flex flex-col border border-opsis-border-primary bg-background p-6 shadow-lg rounded-lg w-full gap-4',

        // Unstyled centered variant
        Unstyled: `${dialogContentPositionCenteredClassNames}`,

        // Unstyled top fixed variant
        UnstyledTopFixed: `${dialogContentPositionTopFixedClassNames}`,

        // Full screen with margin
        FullScreenWithMargin:
            `${dialogContentPositionCenteredClassNames} ` +
            'flex flex-col border border-opsis-border-primary bg-background p-6 shadow-lg rounded-lg w-full gap-4 ' +
            'h-full max-h-[calc(100vh-8rem)] w-full max-w-[calc(100vw-8rem)] md:max-h-[calc(100vh-8rem)] md:max-w-[calc(100vw-8rem)]',
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
