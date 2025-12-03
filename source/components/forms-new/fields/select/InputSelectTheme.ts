/**
 * Structure InputSelect Theme
 *
 * Composition-based theme that routes to underlying component themes (Button, Popover).
 * InputSelect is a composite component, so its theme maps presets to the themes of its parts
 * rather than defining its own styles.
 *
 * Projects can override/extend this theme via ProjectSettings.theme.components.InputSelect
 */

// Dependencies - Types
// Use relative paths to avoid Tailwind CSS resolution issues
import type { ButtonVariant, ButtonSize } from '../../../../components/buttons/ButtonTheme';
import type { PopoverVariant, PopoverSize } from '../../../../components/popovers/PopoverTheme';

// Variant mapping - maps to underlying component variants
export interface InputSelectVariantMapping {
    triggerButtonVariant: ButtonVariant;
    popoverVariant: PopoverVariant;
    menuItemButtonVariant: ButtonVariant;
}

// Size mapping - maps to underlying component sizes
export interface InputSelectSizeMapping {
    triggerButtonSize: ButtonSize;
    popoverSize: PopoverSize;
    menuItemButtonSize: ButtonSize;
}

// InputSelect Variants Interface - Source of truth for all input select variant presets
// Structure defines its base variants here, and projects can augment to add custom variants
// Example in project code:
//   declare module '@structure/source/components/forms-new/fields/select/InputSelectTheme' {
//     interface InputSelectVariants {
//       CustomVariant: 'CustomVariant';
//     }
//   }
export interface InputSelectVariants {
    A: 'A';
    Outline: 'Outline';
}

// Type - InputSelect Variant (derived from InputSelectVariants interface)
// Automatically includes both structure variants and any project-added variants
export type InputSelectVariant = keyof InputSelectVariants;

// InputSelect Sizes Interface - Source of truth for all input select size presets
// Structure defines its base sizes here, and projects can augment to add custom sizes
export interface InputSelectSizes {
    Small: 'Small';
    Base: 'Base';
    Large: 'Large';
}

// Type - InputSelect Size (derived from InputSelectSizes interface)
// Automatically includes both structure sizes and any project-added sizes
export type InputSelectSize = keyof InputSelectSizes;

// Type - InputSelect Theme Configuration
// Maps variant/size presets to underlying component theme values
export interface InputSelectThemeConfiguration {
    variants: Partial<Record<InputSelectVariant, InputSelectVariantMapping>>;
    sizes: Partial<Record<InputSelectSize, InputSelectSizeMapping>>;
    configuration: {
        defaultVariant: {
            variant?: InputSelectVariant;
            size?: InputSelectSize;
        };
    };
}

// InputSelect Theme - Structure Default
export const inputSelectTheme: InputSelectThemeConfiguration = {
    // Variant presets - each maps to underlying component variants
    variants: {
        // Variant A - Standard form select
        A: {
            triggerButtonVariant: 'InputSelectTrigger',
            popoverVariant: 'A',
            menuItemButtonVariant: 'MenuItem',
        },

        // Variant Outline - Transparent background with border only
        Outline: {
            triggerButtonVariant: 'Outline',
            popoverVariant: 'A',
            menuItemButtonVariant: 'MenuItem',
        },
    },

    // Size presets - each maps to underlying component sizes
    sizes: {
        Small: {
            triggerButtonSize: 'InputSelectTrigger',
            popoverSize: 'Base',
            menuItemButtonSize: 'MenuItem',
        },
        Base: {
            triggerButtonSize: 'InputSelectTrigger',
            popoverSize: 'Base',
            menuItemButtonSize: 'MenuItem',
        },
        Large: {
            triggerButtonSize: 'InputSelectTrigger',
            popoverSize: 'Base',
            menuItemButtonSize: 'MenuItem',
        },
    },

    // Configuration
    configuration: {
        defaultVariant: {
            variant: 'A',
            size: 'Base',
        },
    },
};
