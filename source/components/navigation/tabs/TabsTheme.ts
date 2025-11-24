/**
 * Structure Tabs Theme
 *
 * Default tabs theme for the structure library. Provides portable, framework-agnostic
 * tabs variants and sizes that work out-of-the-box in any project.
 *
 * Projects can override/extend this theme via ProjectSettings.theme.components.Tabs
 */

// Dependencies - Utilities
import { mergeClassNames } from '../../../utilities/style/ClassName';

// Tabs Variants Interface - Source of truth for all tabs variants
// Structure defines its base variants here, and projects can augment to add custom variants
// Example in project code:
//   declare module '@structure/source/components/navigation/tabs/TabsTheme' {
//     interface TabsVariants {
//       Minimal: 'Minimal';
//     }
//   }
export interface TabsVariants {
    Bubble: 'Bubble';
    LineBottom: 'LineBottom';
}

// Type - Tabs Variant (derived from TabsVariants interface)
// Automatically includes both structure variants and any project-added variants
export type TabsVariant = keyof TabsVariants;

// Tabs Sizes Interface - Source of truth for all tabs sizes
// Structure defines its base sizes here, and projects can augment to add custom sizes
// Example in project code:
//   declare module '@structure/source/components/navigation/tabs/TabsTheme' {
//     interface TabsSizes {
//       ExtraLarge: 'ExtraLarge';
//     }
//   }
export interface TabsSizes {
    ExtraSmall: 'ExtraSmall';
    Small: 'Small';
    Base: 'Base';
    Large: 'Large';
    ExtraLarge: 'ExtraLarge';
}

// Type - Tabs Size (derived from TabsSizes interface)
// Automatically includes both structure sizes and any project-added sizes
export type TabsSize = keyof TabsSizes;

// Type - Tabs Theme Configuration
// Structure must define all variants/sizes it declares in the interfaces above
// Project extensions are optional (Partial)
export interface TabsThemeConfiguration {
    variants: Partial<Record<TabsVariant, string>>;
    variantItemClasses: Partial<Record<TabsVariant, string>>; // Per-variant classes for TabItem element
    variantItemWrapperClasses: Partial<Record<TabsVariant, string>>; // Per-variant wrapper classes for children
    variantItemActiveClasses: Partial<Record<TabsVariant, string>>; // Per-variant active indicator classes
    sizes: Partial<Record<TabsSize, string>>;
    configuration: {
        baseClasses: string; // Applied to Tabs wrapper (minimal)
        itemBaseClasses: string; // Applied to all TabItems (minimal, shared interaction states)
        itemActiveClasses: string; // Applied to active indicator (minimal, variant adds specific styling)
        defaultVariant: {
            variant?: TabsVariant;
            size?: TabsSize;
        };
    };
}

// Tabs Theme - Structure Default
export const tabsTheme: TabsThemeConfiguration = {
    // Variants
    variants: {
        // Variant Bubble - Default tabs styling with pill background
        // Use for: Standard tab navigation with rounded pill design and background container
        // Features: Light background container, animated active state indicator, smooth transitions
        Bubble: mergeClassNames(
            // Layout
            'z-0 flex',
            // Animation
            'transition-colors',
            // Background and padding for wrapper
            'gap-1 rounded-full background--5 p-0.5',
        ),

        // Variant LineBottom - Underline tabs with animated bottom border
        // Use for: Clean, minimal tab navigation with emphasis on active state
        // Features: Bottom border baseline, animated active indicator line
        LineBottom: mergeClassNames(
            // Layout
            'flex',
            // Bottom border (baseline)
            'border-b border--0',
        ),
    },

    // Per-variant classes for TabItem element
    variantItemClasses: {
        Bubble: mergeClassNames(
            // Layout
            'group relative flex',
            // Interaction
            'cursor-pointer transition-colors',
            // Colors
            'content--2 hover:content--0 data-[state=active]:content--0',
            // Shape
            'rounded-full',
        ),

        LineBottom: mergeClassNames(
            // Layout
            'relative flex',
            // Interaction
            'cursor-pointer transition-colors',
            // Colors
            'content--2 hover:content--0 data-[state=active]:content--0',
        ),
    },

    // Per-variant wrapper classes for TabItem children
    // If set, TabItem wraps children in a div with these classes
    // Used for z-index layering with animated backgrounds, or other variant-specific needs
    variantItemWrapperClasses: {
        Bubble: 'relative z-10 flex', // Variant Bubble needs z-index for animated background indicator, flex to properly contain children
    },

    // Per-variant active indicator classes
    variantItemActiveClasses: {
        Bubble: mergeClassNames(
            'absolute inset-0 h-full w-full border border-transparent',
            'z-0 group-data-[state=active]:border--4 group-data-[state=active]:background--0',
            'rounded-full', // Match the rounded corners of the tab item
        ),

        LineBottom: mergeClassNames(
            // Position at bottom of tab item, full width
            'absolute right-0 -bottom-px left-0',
            // Line styling, rounded-full means we get a rounded stroke end cap
            'h-px rounded-full background-content--0',
        ),
    },

    // Sizes - Define padding, typography, and spacing for TabItems
    // Note: TabItem now uses asChild pattern, so children (typically Button components) handle their own sizing
    sizes: {
        ExtraSmall: '',
        Small: '',
        Base: '',
        Large: '',
        ExtraLarge: '',
    },

    // Configuration
    configuration: {
        // Base classes for Tabs wrapper (empty - variants define everything)
        baseClasses: '',

        // Base classes for all TabItems (empty - variants define everything)
        itemBaseClasses: '',

        // Base active indicator classes (empty - variants define everything)
        itemActiveClasses: '',

        // Default variant and size
        defaultVariant: {
            size: 'Base',
        },
    },
};
