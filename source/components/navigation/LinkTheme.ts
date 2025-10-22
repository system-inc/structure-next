/**
 * Structure Link Theme
 *
 * Default link theme for the structure library. Provides portable, framework-agnostic
 * link variants that work out-of-the-box in any project.
 *
 * Projects can override/extend this theme via ProjectSettings.theme.components.Link
 */

import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Focus styles for styled buttons
export const baseLinkClassNames = mergeClassNames(
    // Animation
    'transition-colors ease-out',
);

// Link Variants Interface - Source of truth for all link variants
// Structure defines its base variants here, and projects can augment to add custom variants
// Example in project code:
//   declare module '@structure/source/components/navigation/LinkTheme' {
//     interface LinkVariants {
//       Blue: 'Blue';
//     }
//   }
export interface LinkVariants {
    // Style-based Variants
    A: 'A';
    B: 'B';
    C: 'C';

    // Semantic Variants
    Inline: 'Inline';
}

// Type - Link Variant (derived from LinkVariants interface)
// Automatically includes both structure variants and any project-added variants
export type LinkVariant = keyof LinkVariants;

// Type - Link Theme Configuration
// Structure must define all variants it declares in the interface above
// Project extensions are optional (Partial)
export interface LinkThemeConfiguration {
    variants: Partial<Record<LinkVariant, string>>;
    configuration: {
        baseClasses: string;
        defaultVariant?: LinkVariant;
    };
}

// Link Theme - Structure Default
export const linkTheme: LinkThemeConfiguration = {
    // Variants
    variants: {
        // Style-based Variants

        // A - Primary links in header and footer navigation
        // Base content, mute slightly on hover, emphasize on active
        A: mergeClassNames(
            baseLinkClassNames,
            'hover:content--3 active:content---1 dark:hover:content--2 dark:active:content---1',
        ),
        // 'text-black-700 hover:text-black-0 active:text-black-1000 dark:text-white-800 dark:hover:text-white-0 dark:active:text-white-1000',

        // B - Great for icon links
        // Slightly muted base content, emphasize on hover, emphasize even more on active
        B: mergeClassNames(
            baseLinkClassNames,
            'content--3 hover:content--2 active:content---1 dark:content--1 dark:hover:content--0 dark:active:content---1',
        ),

        // C - ???
        C: mergeClassNames('text-purple-500'),

        // Semantic Variants

        // Inline - For links within body text/prose
        // Underlined with subtle color change
        Inline: 'underline underline-offset-2 hover:opacity-70 transition-opacity',
    },

    // Configuration
    configuration: {
        // Base classes (empty = unstyled by default)
        baseClasses: '',

        // No default variant = completely unstyled when variant not specified
        defaultVariant: undefined,
    },
};
