// Dependencies - Utilities
import { mergeClassNames } from '../../utilities/style/ClassName';

// Card Variants
// Interface allows project-level extension via module augmentation
export interface CardVariants {
    A: 'A';
    B: 'B';
    C: 'C';
    D: 'D';
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
export const cardCommonLayoutClassNames = 'flex flex-col';

// Default Structure Card Theme
export const cardTheme: CardThemeConfiguration = {
    variants: {
        A: mergeClassNames(cardCommonLayoutClassNames, 'border border--0 background--0 shadow--0'),
        B: mergeClassNames(cardCommonLayoutClassNames, 'border border--1 background--0 shadow--0 dark:background--1'),
        C: mergeClassNames(cardCommonLayoutClassNames, 'border border--2 background--1 shadow--0 dark:background--2'),
        D: mergeClassNames(cardCommonLayoutClassNames, 'border border--3 background--2 shadow--0 dark:background--3'),
    },
    sizes: {
        Small: 'rounded-xl p-4',
        Base: 'rounded-2xl p-8',
        Large: 'rounded-2xl p-12',
    },
    configuration: {
        baseClasses: '',
        defaultVariant: {
            size: 'Base',
        },
    },
};
