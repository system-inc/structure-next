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
    ExtraLarge: 'ExtraLarge';
}

// Type - Notice Size (derived from NoticeSizes interface)
export type NoticeSize = keyof NoticeSizes;

// Notice Presentations Interface - Source of truth for all notice presentations
// Structure defines its base presentations here, and projects can augment to add custom presentations
export interface NoticePresentations {
    Inline: 'Inline';
    Card: 'Card';
}

// Type - Notice Presentation (derived from NoticePresentations interface)
export type NoticePresentation = keyof NoticePresentations;

// Type - Notice Theme Configuration
export interface NoticeThemeConfiguration {
    variants: Partial<Record<NoticeVariant, string>>;
    sizes: Partial<Record<NoticeSize, string>>;
    presentations: Partial<Record<NoticePresentation, string>>;
    iconSizes: Partial<Record<NoticeSize, string>>;
    configuration: {
        baseClasses: string;
        defaultVariant: {
            variant?: NoticeVariant;
            size?: NoticeSize;
            presentation?: NoticePresentation;
        };
    };
}

// Notice Theme - Structure Default
export const noticeTheme: NoticeThemeConfiguration = {
    // Variants
    variants: {
        // Variant Positive - Positive outcomes and confirmations
        Positive: mergeClassNames('border-content--positive background--positive-muted'),

        // Variant Negative - Error states and critical issues
        Negative: mergeClassNames('border-content--negative background--negative-muted'),

        // Variant Warning - Warnings and important notices
        Warning: mergeClassNames('border-content--warning background--warning-muted'),

        // Variant Informative - Informational messages
        Informative: mergeClassNames('border-content--informative background--informative-muted'),

        // Variant Neutral - Default neutral state
        Neutral: mergeClassNames('border--0 background--2'),
    },

    // Sizes
    sizes: {
        Small: 'p-2 text-sm', // Minimal - 8px padding
        Base: 'p-3 text-sm', // Standard - 12px padding
        Large: 'px-4 py-3 text-sm', // Generous - 16/12px padding (ToastCard small equivalent)
        ExtraLarge: 'px-6 py-5 text-base', // Maximum - 24/20px padding (ToastCard large equivalent)
    },

    // Presentations - Visual presentation styles
    presentations: {
        Inline: mergeClassNames('max-w-3xl rounded-md'), // Traditional box - sharp corners, constrained width
        Card: mergeClassNames('rounded-xl'), // Card/toast style - soft corners, flexible width
    },

    // Icon dimensions for each notice size
    iconSizes: {
        Small: 'h-[20px] w-[20px]', // 20px
        Base: 'h-[22px] w-[22px]', // 22px
        Large: 'size-5', // 20px (ToastCard small equivalent)
        ExtraLarge: 'size-6', // 24px (ToastCard large equivalent, fixed from size-4 bug)
    },

    // Configuration
    configuration: {
        baseClasses: mergeClassNames(
            'flex flex-col border',
            // Default spacing and typography
            'text-sm',
        ),
        defaultVariant: {
            variant: 'Neutral',
            size: 'Base',
            presentation: 'Inline',
        },
    },
};
