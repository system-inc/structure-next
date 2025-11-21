// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Badge Variants - Semantic color meanings
export interface BadgeVariants {
    Positive: 'Positive';
    Negative: 'Negative';
    Warning: 'Warning';
    Informative: 'Informative';
    Neutral: 'Neutral';
}

export type BadgeVariant = keyof BadgeVariants;

// Badge Types - Visual styles (filled background vs outline vs status dot)
export interface BadgeTypes {
    Filled: 'Filled';
    Outline: 'Outline';
    Status: 'Status'; // Shows a colored dot indicator
}

export type BadgeType = keyof BadgeTypes;

// Badge Sizes
export interface BadgeSizes {
    Base: 'Base';
    Large: 'Large';
}

export type BadgeSize = keyof BadgeSizes;

// Compound Variant Configuration
// Defines combinations of type + variant for backgrounds and borders
export interface BadgeCompoundVariant {
    type: BadgeType;
    variant: BadgeVariant;
    className: string;
}

// Badge Theme Configuration
export interface BadgeThemeConfiguration {
    variants: Partial<Record<BadgeVariant, string>>;
    types: Partial<Record<BadgeType, string>>;
    sizes: Partial<Record<BadgeSize, string>>;
    compoundVariants: BadgeCompoundVariant[];
    configuration: {
        baseClasses: string;
        defaultVariant: {
            variant?: BadgeVariant;
            type?: BadgeType;
            size?: BadgeSize;
        };
    };
}

// Badge Theme - Structure Default
export const badgeTheme: BadgeThemeConfiguration = {
    // Semantic color variants (content colors)
    variants: {
        Positive: mergeClassNames('content--positive'),
        Negative: mergeClassNames('content--negative'),
        Warning: mergeClassNames('content--warning'),
        Informative: mergeClassNames('content--informative'),
        Neutral: mergeClassNames('content--1'),
    },

    // Type styles (filled vs outline vs status)
    types: {
        Filled: mergeClassNames(''), // Backgrounds applied via compound variants
        Outline: mergeClassNames(''), // Borders applied via compound variants
        Status: mergeClassNames('border border--0 content--0'), // Status dot style
    },

    // Size variants
    sizes: {
        Base: mergeClassNames('px-2 text-xs font-medium', '[&_svg]:size-3.5'),
        Large: mergeClassNames('px-3 text-sm font-medium', '[&_svg]:size-4'),
    },

    // Compound variants - combinations of type + variant
    compoundVariants: [
        // Filled backgrounds
        { type: 'Filled', variant: 'Positive', className: mergeClassNames('background--positive-muted') },
        { type: 'Filled', variant: 'Negative', className: mergeClassNames('background--negative-muted') },
        { type: 'Filled', variant: 'Warning', className: mergeClassNames('background--warning-muted') },
        { type: 'Filled', variant: 'Informative', className: mergeClassNames('background--informative-muted') },
        { type: 'Filled', variant: 'Neutral', className: mergeClassNames('background--1') },
        // Outline borders
        { type: 'Outline', variant: 'Positive', className: mergeClassNames('border border--positive') },
        { type: 'Outline', variant: 'Negative', className: mergeClassNames('border border--negative') },
        { type: 'Outline', variant: 'Warning', className: mergeClassNames('border border--warning') },
        { type: 'Outline', variant: 'Informative', className: mergeClassNames('border border--informative') },
        { type: 'Outline', variant: 'Neutral', className: mergeClassNames('border border--0') },
        // Status dot colors (applied to the [data-dot] element)
        { type: 'Status', variant: 'Positive', className: mergeClassNames('[&>[data-dot=true]]:background--positive') },
        { type: 'Status', variant: 'Negative', className: mergeClassNames('[&>[data-dot=true]]:background--negative') },
        { type: 'Status', variant: 'Warning', className: mergeClassNames('[&>[data-dot=true]]:background--warning') },
        {
            type: 'Status',
            variant: 'Informative',
            className: mergeClassNames('[&>[data-dot=true]]:background--informative'),
        },
        { type: 'Status', variant: 'Neutral', className: mergeClassNames('[&>[data-dot=true]]:background--1') },
    ],

    // Configuration
    configuration: {
        baseClasses: 'inline-flex items-center justify-center gap-2 rounded-full py-1 transition-colors',
        defaultVariant: {
            type: 'Filled',
            size: 'Base',
        },
    },
};
