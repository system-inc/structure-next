/**
 * Structure Toggle Theme
 *
 * Default toggle theme for the structure library. Provides portable, framework-agnostic
 * toggle variants and sizes that work out-of-the-box in any project.
 *
 * Projects can override/extend this theme via ProjectSettings.theme.components.Toggle
 */

// Dependencies - Utilities
// Use relative path to avoid Tailwind CSS resolution issues
import { mergeClassNames } from '../../utilities/style/ClassName';

// Layout styles for styled toggles
export const toggleLayoutClassNames =
    // Flex layout with spacing between icons and text
    `inline-flex items-center justify-center gap-2`;

// Common toggle styles: interaction behavior and disabled states
export const toggleCommonClassNames = mergeClassNames(
    // Layout
    'whitespace-nowrap select-none',
    // Cursor
    'cursor-pointer',
    // Animation
    'transition-colors ease-out',
    // Disabled states
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    'aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
);

// Centered toggle styles: sizing and shape
export const toggleCenteredClassNames = mergeClassNames(
    // Shape
    'rounded-md',
    // Content
    'text-sm font-medium',
);

// Focus styles for styled toggles
export const toggleFocusClassNames = mergeClassNames(
    // Remove global outline
    'focus-visible:outline-none',
    // Ring pattern
    'focus-visible:ring-1',
);

// Toggle Variants Interface - Source of truth for all toggle variants
// Structure defines its base variants here, and projects can augment to add custom variants
// Example in project code:
//   declare module '@structure/source/components/buttons/ToggleTheme' {
//     interface ToggleVariants {
//       Custom: 'Custom';
//     }
//   }
export interface ToggleVariants {
    A: 'A';
    Outline: 'Outline';
    Ghost: 'Ghost';
}

// Type - Toggle Variant (derived from ToggleVariants interface)
// Automatically includes both structure variants and any project-added variants
export type ToggleVariant = keyof ToggleVariants;

// Toggle Sizes Interface - Source of truth for all toggle sizes
// Structure defines its base sizes here, and projects can augment to add custom sizes
export interface ToggleSizes {
    Small: 'Small';
    Base: 'Base';
    Large: 'Large';
}

// Type - Toggle Size (derived from ToggleSizes interface)
export type ToggleSize = keyof ToggleSizes;

// Toggle Theme Configuration Interface
export interface ToggleThemeConfiguration {
    variants: Partial<Record<ToggleVariant, string>>;
    sizes: Partial<Record<ToggleSize, string>>;
    iconSizes: Partial<Record<ToggleSize, string>>;
    configuration: {
        baseClasses: string;
        focusClasses: string;
        disabledClasses: string;
        defaultVariant: {
            variant?: ToggleVariant;
            size?: ToggleSize;
        };
    };
}

// Toggle Theme - Structure Default
export const toggleTheme: ToggleThemeConfiguration = {
    variants: {
        // Variant A - Primary styled toggle (replaces ToggleOn/ToggleOff from ButtonTheme)
        // Single variant that uses data-[state=on] for pressed state styling
        A: mergeClassNames(
            toggleLayoutClassNames,
            toggleCommonClassNames,
            toggleCenteredClassNames,
            'rounded-md border',
            // Unpressed state (ToggleOff equivalent)
            'border--3 background--0 content--2',
            // Hover unpressed
            'hover:border--2 hover:background--2 hover:content--1',
            // Pressed state (ToggleOn equivalent)
            'data-[state=on]:border--2 data-[state=on]:background--3 data-[state=on]:content--0',
            // Hover pressed
            'data-[state=on]:hover:border--3 data-[state=on]:hover:background--4',
        ),

        // Variant Outline - Toggle with border emphasis
        // Stronger border contrast
        Outline: mergeClassNames(
            toggleLayoutClassNames,
            toggleCommonClassNames,
            toggleCenteredClassNames,
            'border',
            // Unpressed state
            'border--0 bg-transparent',
            // Hover unpressed
            'hover:border--1 hover:background--1',
            // Pressed state
            'data-[state=on]:border--2 data-[state=on]:background--3 data-[state=on]:content--0',
        ),

        // Variant Ghost - Minimal toggle without border
        // Most subtle appearance
        Ghost: mergeClassNames(
            toggleLayoutClassNames,
            toggleCommonClassNames,
            toggleCenteredClassNames,
            'bg-transparent',
            // Hover unpressed
            'hover:background--2 hover:content--1',
            // Pressed state
            'data-[state=on]:background--3 data-[state=on]:content--0',
        ),
    },

    sizes: {
        Small: mergeClassNames('h-8 w-8 p-2', '[&_svg]:pointer-events-none [&_svg]:size-3 [&_svg]:shrink-0'),
        Base: mergeClassNames('h-9 w-9 p-[10px]', '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'),
        Large: mergeClassNames('h-10 w-10 p-3', '[&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0'),
    },

    iconSizes: {
        Small: 'h-3 w-3',
        Base: 'h-4 w-4',
        Large: 'h-5 w-5',
    },

    configuration: {
        baseClasses: toggleCommonClassNames,
        focusClasses: toggleFocusClassNames,
        disabledClasses: '',
        defaultVariant: {
            size: 'Base',
        },
    },
};
