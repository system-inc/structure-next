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

// Badge Kinds - Visual styles (filled background vs outline vs status dot)
export interface BadgeKinds {
    Filled: 'Filled';
    Outline: 'Outline';
    Status: 'Status'; // Shows a colored dot indicator
}

export type BadgeKind = keyof BadgeKinds;

// Badge Sizes
export interface BadgeSizes {
    Base: 'Base';
    Large: 'Large';
}

export type BadgeSize = keyof BadgeSizes;

// Compound Variant Configuration
// Defines combinations of kind + variant for backgrounds and borders
export interface BadgeCompoundVariant {
    kind: BadgeKind;
    variant: BadgeVariant;
    className: string;
}

// Badge Theme Configuration
export interface BadgeThemeConfiguration {
    variants: Partial<Record<BadgeVariant, string>>;
    kinds: Partial<Record<BadgeKind, string>>;
    sizes: Partial<Record<BadgeSize, string>>;
    compoundVariants: BadgeCompoundVariant[];
    configuration: {
        baseClasses: string;
        defaultVariant: {
            variant?: BadgeVariant;
            kind?: BadgeKind;
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

    // Kind styles (filled vs outline vs status)
    kinds: {
        Filled: mergeClassNames(''), // Backgrounds applied via compound variants
        Outline: mergeClassNames(''), // Borders applied via compound variants
        Status: mergeClassNames('border border--0 content--0'), // Status dot style
    },

    // Size variants
    sizes: {
        Base: mergeClassNames('px-2 text-xs font-medium', '[&_svg]:size-3.5'),
        Large: mergeClassNames('px-3 text-sm font-medium', '[&_svg]:size-4'),
    },

    // Compound variants - combinations of kind + variant
    compoundVariants: [
        // Filled backgrounds
        { kind: 'Filled', variant: 'Positive', className: mergeClassNames('background--positive-muted') },
        { kind: 'Filled', variant: 'Negative', className: mergeClassNames('background--negative-muted') },
        { kind: 'Filled', variant: 'Warning', className: mergeClassNames('background--warning-muted') },
        { kind: 'Filled', variant: 'Informative', className: mergeClassNames('background--informative-muted') },
        { kind: 'Filled', variant: 'Neutral', className: mergeClassNames('background--1') },
        // Outline borders (using muted variants for subtler appearance)
        { kind: 'Outline', variant: 'Positive', className: mergeClassNames('border border--positive-muted') },
        { kind: 'Outline', variant: 'Negative', className: mergeClassNames('border border--negative-muted') },
        { kind: 'Outline', variant: 'Warning', className: mergeClassNames('border border--warning-muted') },
        { kind: 'Outline', variant: 'Informative', className: mergeClassNames('border border--informative-muted') },
        { kind: 'Outline', variant: 'Neutral', className: mergeClassNames('border border--0') },
        // Status dot colors (applied to the [data-dot] element)
        { kind: 'Status', variant: 'Positive', className: mergeClassNames('[&>[data-dot=true]]:background--positive') },
        { kind: 'Status', variant: 'Negative', className: mergeClassNames('[&>[data-dot=true]]:background--negative') },
        { kind: 'Status', variant: 'Warning', className: mergeClassNames('[&>[data-dot=true]]:background--warning') },
        {
            kind: 'Status',
            variant: 'Informative',
            className: mergeClassNames('[&>[data-dot=true]]:background--informative'),
        },
        { kind: 'Status', variant: 'Neutral', className: mergeClassNames('[&>[data-dot=true]]:background--1') },
    ],

    // Configuration
    configuration: {
        baseClasses: 'inline-flex items-center justify-center gap-2 rounded-full py-1 transition-colors',
        defaultVariant: {
            kind: 'Filled',
            size: 'Base',
        },
    },
};
