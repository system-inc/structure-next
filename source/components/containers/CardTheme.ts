// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Card Variants
// Interface allows project-level extension via module augmentation
export interface CardVariants {
    A: 'A';
}

// Derived type automatically includes project additions
export type CardVariant = keyof CardVariants;

// Card Sizes
// Interface allows project-level extension via module augmentation
export interface CardSizes {
    Small: 'Small';
    Base: 'Base';
    Large: 'Large';
}

// Derived type automatically includes project additions
export type CardSize = keyof CardSizes;

// Card Theme Configuration Interface
export interface CardThemeConfiguration {
    variants: Partial<Record<CardVariant, string>>;
    sizes: Partial<Record<CardSize, string>>;
    configuration: {
        baseClasses: string;
        defaultVariant: {
            variant?: CardVariant;
            size?: CardSize;
        };
    };
}

// Common Card Classes
export const cardCommonLayoutClassNames = 'flex flex-col items-start justify-start';
export const cardCommonBehaviorClassNames = 'transition-all';

// Default Structure Card Theme
export const cardTheme: CardThemeConfiguration = {
    variants: {
        A: mergeClassNames(
            cardCommonLayoutClassNames,
            cardCommonBehaviorClassNames,
            'rounded-2xl border border--0 background--0 shadow--0',
        ),
    },
    sizes: {
        Small: 'gap-4 p-4',
        Base: 'gap-6 p-8',
        Large: 'gap-8 p-12',
    },
    configuration: {
        baseClasses: '',
        defaultVariant: {
            size: 'Base',
        },
    },
};
