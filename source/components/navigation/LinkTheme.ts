/**
 * Structure Link Theme
 *
 * Default link theme for the structure library. Provides portable, framework-agnostic
 * link variants that work out-of-the-box in any project.
 *
 * Projects can override/extend this theme via ProjectSettings.theme.components.Link
 */

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
        A: 'text-black-700 hover:text-black-0 active:text-black-1000 dark:text-white-800 dark:hover:text-white-0 dark:active:text-white-1000 transition-colors ease-out',

        // B - Alternate link for for content in light mode
        B: 'text-black-0 hover:text-gray-900 active:text-black-300 dark:text-white-800 dark:hover:text-white-0 dark:active:text-white-1000 transition-colors ease-out',

        // C - ???
        C: 'text-gray-600 hover:text-gray-500 active:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 dark:active:text-gray-500 transition-colors',

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
