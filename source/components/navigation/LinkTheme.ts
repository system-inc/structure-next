/**
 * Structure Link Theme
 *
 * Default link theme for the structure library. Provides portable, framework-agnostic
 * link variants that work out-of-the-box in any project.
 *
 * Projects can override/extend this theme via ProjectSettings.theme.components.Link
 */

// Use relative path to avoid Tailwind CSS resolution issues
import { mergeClassNames } from '../../utilities/style/ClassName';

// Focus styles for styled buttons
export const linkCommonClassNames = mergeClassNames(
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
        baseClassNames: string;
        defaultVariant?: LinkVariant;
    };
}

// Link Theme - Structure Default
export const linkTheme: LinkThemeConfiguration = {
    // Variants
    variants: {
        // Style-based Variants

        // A - Primary links in header and footer navigation
        // Base content color, mute slightly on hover, emphasize on active
        A: mergeClassNames(
            linkCommonClassNames,
            'hover:content--3 active:content---1 dark:hover:content--2 dark:active:content---1',
        ),
        // 'text-black-700 hover:text-black-0 active:text-black-1000 dark:text-white-800 dark:hover:text-white-0 dark:active:text-white-1000',

        // B - Great for text on a background (e.g., in menus)
        // Base content color, slight emphasis on hover, more emphasis on active
        B: mergeClassNames(linkCommonClassNames, 'hover:content---1 active:content---3'),

        // C - Great for links where the link is an icon instead of text, starts out more muted
        // Slightly muted base content, emphasize on hover, emphasize even more on active
        C: mergeClassNames(
            linkCommonClassNames,
            'content--3 hover:content--2 active:content--1 dark:content--1 dark:hover:content--0 dark:active:content---1',
        ),

        // Semantic Variants

        // Inline - For links within body text/prose
        // Underlined with subtle color change
        Inline: 'underline underline-offset-2 hover:opacity-70 active:opacity-100 transition-opacity',
    },

    // Configuration
    configuration: {
        // Base classes (empty = unstyled by default)
        baseClassNames: '',

        // No default variant = completely unstyled when variant not specified
        defaultVariant: undefined,
    },
};
