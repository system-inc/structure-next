/**
 * Structure Notice Theme
 *
 * Default notice theme for the structure library. Provides portable, framework-agnostic
 * notice variants and sizes that work out-of-the-box in any project.
 *
 * Projects can override/extend this theme via ProjectSettings.theme.components.Notice
 */

// Dependencies - Utilities
import { mergeClassNames } from '../../utilities/style/ClassName';

// Notice Variants Interface - Source of truth for all notice variants
// Structure defines its base variants here, and projects can augment to add custom variants
export interface NoticeVariants {
    Positive: 'Positive';
    Negative: 'Negative';
    Warning: 'Warning';
    Informative: 'Informative';
    Neutral: 'Neutral';
}

// Type - Notice Variant (derived from NoticeVariants interface)
export type NoticeVariant = keyof NoticeVariants;

// Notice Sizes Interface - Source of truth for all notice sizes
// Structure defines its base sizes here, and projects can augment to add custom sizes
export interface NoticeSizes {
    Base: 'Base';
    Large: 'Large';
}

// Type - Notice Size (derived from NoticeSizes interface)
export type NoticeSize = keyof NoticeSizes;

// Type - Notice Theme Configuration
export interface NoticeThemeConfiguration {
    variants: Partial<Record<NoticeVariant, string>>;
    sizes: Partial<Record<NoticeSize, string>>;
    iconSizes: Partial<Record<NoticeSize, string>>;
    configuration: {
        baseClasses: string;
        defaultVariant: {
            variant?: NoticeVariant;
            size?: NoticeSize;
        };
    };
}

// Notice Theme - Structure Default
export const noticeTheme: NoticeThemeConfiguration = {
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

    // Icon dimensions for each notice size
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
