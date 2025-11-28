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
    Small: 'Small';
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
        baseClassNames: string;
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
        Positive: mergeClassNames('border--positive-muted background--positive-muted'),

        // Variant Negative - Error states and critical issues
        Negative: mergeClassNames('border--negative-muted background--negative-muted'),

        // Variant Warning - Warnings and important notices
        Warning: mergeClassNames('border--warning-muted background--warning-muted'),

        // Variant Informative - Informational messages
        Informative: mergeClassNames('border--informative-muted background--informative-muted'),

        // Variant Neutral - Default neutral state
        Neutral: mergeClassNames('border--0 background--2'),
    },

    // Sizes
    sizes: {
        Small: 'p-2 text-sm', // Minimal - 8px padding, compact inline notices
        Base: 'px-4 py-3 text-sm', // Standard - 16/12px padding, most common notice size
        Large: 'px-6 py-5 text-base', // Prominent - 24/20px padding, hero notices
    },

    // Icon dimensions for each notice size
    iconSizes: {
        Small: 'size-3.5',
        Base: 'size-4.5',
        Large: 'size-6',
    },

    // Configuration
    configuration: {
        baseClassNames: mergeClassNames(
            'flex flex-col border',
            // Border radius - Default to rounded-xl (can be overridden via className)
            'rounded-xl',
            // Default spacing and typography
            'text-sm',
        ),
        defaultVariant: {
            variant: 'Neutral',
            size: 'Base',
        },
    },
};
