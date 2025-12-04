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
    // Container variants (background, border colors)
    variants: Partial<Record<NoticeVariant, string>>;
    // Container sizes (padding, text size)
    sizes: Partial<Record<NoticeSize, string>>;
    // Icon dimensions for each size
    iconSizes: Partial<Record<NoticeSize, string>>;
    // Icon color classes for each variant
    iconVariants: Partial<Record<NoticeVariant, string>>;
    // Icon container class names when notice has children (per size for alignment)
    iconContainerWithChildrenSizes: Partial<Record<NoticeSize, string>>;
    // Layout class names per size (title only, no children)
    layoutSizes: Partial<Record<NoticeSize, string>>;
    // Layout class names per size when notice has children
    layoutWithChildrenSizes: Partial<Record<NoticeSize, string>>;
    // Title color classes for each variant
    titleVariants: Partial<Record<NoticeVariant, string>>;
    // Title size/typography classes for each size
    titleSizes: Partial<Record<NoticeSize, string>>;
    // Content (children) color classes for each variant
    contentVariants: Partial<Record<NoticeVariant, string>>;
    // Content (children) size/typography classes for each size
    contentSizes: Partial<Record<NoticeSize, string>>;
    configuration: {
        baseClassNames: string;
        // Icon container class names
        iconContainerClassNames: string;
        // Content container spacing (margin-top for children)
        contentSpacingClassNames: string;
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
        Small: 'px-2.5 py-1.5 text-xs', // Compact - minimal padding, inline notices
        Base: 'pl-3.5 pr-6 pt-2 pb-2 text-sm', // Standard - compact notices
        Large: 'pl-4 pr-7 pt-3 pb-3', // Prominent - most common notice size
    },

    // Icon dimensions for each notice size
    iconSizes: {
        Small: 'size-3.5',
        Base: 'size-4.5',
        Large: 'size-4.5',
    },

    // Icon color classes for each variant
    iconVariants: {
        Positive: 'content--positive',
        Negative: 'content--negative',
        Warning: 'content--warning',
        Informative: 'content--informative',
        Neutral: 'content--1',
    },

    // Icon container class names when notice has children (per size for alignment)
    iconContainerWithChildrenSizes: {
        Small: 'flex justify-center',
        Base: 'flex justify-center pt-px',
        Large: 'flex justify-center pt-[3px]',
    },

    // Layout class names per size (title only, no children)
    layoutSizes: {
        Small: 'flex gap-1.5 items-center',
        Base: 'flex gap-2.5 items-center',
        Large: 'flex gap-2.5 items-center',
    },

    // Layout class names per size when notice has children
    layoutWithChildrenSizes: {
        Small: 'flex gap-1.5 items-start',
        Base: 'flex gap-2 items-start pb-1',
        Large: 'flex gap-2.5 items-start',
    },

    // Title color classes for each variant
    titleVariants: {
        Positive: 'content--positive',
        Negative: 'content--negative',
        Warning: 'content--warning',
        Informative: 'content--informative',
        Neutral: 'content--0',
    },

    // Title size/typography classes for each size
    titleSizes: {
        Small: 'text-xs font-medium',
        Base: 'text-sm font-medium',
        Large: 'text-base font-medium',
    },

    // Content (children) color classes for each variant
    contentVariants: {
        Positive: 'content--positive',
        Negative: 'content--negative',
        Warning: 'content--warning',
        Informative: 'content--informative',
        Neutral: 'content--0',
    },

    // Content (children) size/typography classes for each size
    contentSizes: {
        Small: '',
        Base: '',
        Large: '',
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
        // Icon container class names
        iconContainerClassNames: 'flex justify-center',
        // Content container spacing (margin-top for children)
        contentSpacingClassNames: 'mt-3',
        defaultVariant: {
            variant: 'Neutral',
            size: 'Base',
        },
    },
};
