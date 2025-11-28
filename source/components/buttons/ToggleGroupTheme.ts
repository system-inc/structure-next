// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// ToggleGroup Variants
export interface ToggleGroupVariants {
    A: 'A';
    Segmented: 'Segmented';
    Spaced: 'Spaced';
}

// ToggleGroup Sizes
export interface ToggleGroupSizes {
    Small: 'Small';
    Base: 'Base';
    Large: 'Large';
}

// Export types for use in components
export type ToggleGroupVariant = ToggleGroupVariants[keyof ToggleGroupVariants];
export type ToggleGroupSize = ToggleGroupSizes[keyof ToggleGroupSizes];

// ToggleGroup Theme Configuration
export interface ToggleGroupThemeConfiguration {
    variants: Record<ToggleGroupVariant, string>;
    sizes: Record<ToggleGroupSize, string>;
    configuration: {
        baseClassNames: string;
        defaultVariant: {
            variant?: ToggleGroupVariant;
            size?: ToggleGroupSize;
        };
    };
}

// Common layout classes for the root container
const toggleGroupLayoutClassNames = mergeClassNames('inline-flex items-center');

// Theme - ToggleGroup
export const toggleGroupTheme: ToggleGroupThemeConfiguration = {
    variants: {
        // Variant A: Container with background and padding for grouped appearance
        A: mergeClassNames(toggleGroupLayoutClassNames, 'rounded-lg background--3'),

        // Segmented: Continuous bar with no gap between items (macOS/iOS style)
        Segmented: mergeClassNames(toggleGroupLayoutClassNames, 'rounded-lg background--3'),

        // Spaced: No container background, items spaced apart
        Spaced: mergeClassNames(toggleGroupLayoutClassNames, 'gap-2'),
    },
    sizes: {
        Small: '',
        Base: '',
        Large: '',
    },
    configuration: {
        baseClassNames: toggleGroupLayoutClassNames,
        defaultVariant: {
            variant: 'A',
            size: 'Base',
        },
    },
};

// Module Augmentation - Allow project to extend ToggleGroup variants and sizes
declare module '@structure/source/theme/providers/ComponentThemeProvider' {
    interface ComponentThemeContextValue {
        ToggleGroup?: {
            variants?: Partial<Record<ToggleGroupVariant | string, string>>;
            sizes?: Partial<Record<ToggleGroupSize | string, string>>;
            configuration?: {
                baseClassNames?: string;
                defaultVariant?: {
                    variant?: ToggleGroupVariant | string;
                    size?: ToggleGroupSize | string;
                };
            };
        };
    }
}
