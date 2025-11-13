/**
 * Structure Alert Theme
 *
 * Default alert theme for the structure library. Provides portable, framework-agnostic
 * alert variants and sizes that work out-of-the-box in any project.
 *
 * Projects can override/extend this theme via ProjectSettings.theme.components.Alert
 */

// Dependencies - Utilities
import { mergeClassNames } from '../../utilities/style/ClassName';

// Alert Variants Interface - Source of truth for all alert variants
// Structure defines its base variants here, and projects can augment to add custom variants
export interface AlertVariants {
    Positive: 'Positive';
    Negative: 'Negative';
    Warning: 'Warning';
    Informative: 'Informative';
    Neutral: 'Neutral';
}

// Type - Alert Variant (derived from AlertVariants interface)
export type AlertVariant = keyof AlertVariants;

// Alert Sizes Interface - Source of truth for all alert sizes
// Structure defines its base sizes here, and projects can augment to add custom sizes
export interface AlertSizes {
    Base: 'Base';
    Large: 'Large';
}

// Type - Alert Size (derived from AlertSizes interface)
export type AlertSize = keyof AlertSizes;

// Type - Alert Theme Configuration
export interface AlertThemeConfiguration {
    variants: Partial<Record<AlertVariant, string>>;
    sizes: Partial<Record<AlertSize, string>>;
    iconSizes: Partial<Record<AlertSize, string>>;
    configuration: {
        baseClasses: string;
        defaultVariant: {
            variant?: AlertVariant;
            size?: AlertSize;
        };
    };
}

// Alert Theme - Structure Default
export const alertTheme: AlertThemeConfiguration = {
    // Variants
    variants: {
        // Variant Positive - Positive outcomes and confirmations
        Positive: mergeClassNames('border-content--positive background-content--positive/10'),

        // Variant Negative - Error states and critical issues
        Negative: mergeClassNames('border-content--negative background-content--negative/10'),

        // Variant Warning - Warnings and important notices
        Warning: mergeClassNames('border-content--warning background-content--warning/10'),

        // Variant Informative - Informational messages
        Informative: mergeClassNames('border-content--informative background-content--informative/10'),

        // Variant Neutral - Default neutral state
        Neutral: mergeClassNames('border--0 background--2'),
    },

    // Sizes
    sizes: {
        Base: 'p-2 text-sm',
        Large: 'p-3 text-base',
    },

    // Icon dimensions for each alert size
    iconSizes: {
        Base: 'h-[22px] w-[22px]',
        Large: 'h-6 w-6',
    },

    // Configuration
    configuration: {
        baseClasses: mergeClassNames(
            'flex max-w-3xl flex-col rounded-md border',
            // Default spacing and typography
            'text-sm',
        ),
        defaultVariant: {
            variant: 'Neutral',
            size: 'Base',
        },
    },
};
