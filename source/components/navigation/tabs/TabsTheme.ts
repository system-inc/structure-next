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

// Layout styles for tabs wrapper (container around all tabs)
export const tabsWrapperLayoutClassNames = mergeClassNames(
    // Flexbox layout
    'z-0 flex items-center gap-1',
    // Shape
    'rounded-full',
    // Spacing
    'p-0.5',
    // Animation
    'transition-colors',
);

// Common tab item styles: interaction behavior and layout
export const tabItemCommonClassNames = mergeClassNames(
    // Layout
    'group relative cursor-pointer',
    // Shape
    'rounded-full',
    // Animation
    'transition-colors',
);

// Layout styles for tabs with text content
export const tabItemTextLayoutClassNames = 'inline-flex items-center';

// Tabs Variants Interface - Source of truth for all tabs variants
// Structure defines its base variants here, and projects can augment to add custom variants
// Example in project code:
//   declare module '@structure/source/components/navigation/tabs/TabsTheme' {
//     interface TabsVariants {
//       Minimal: 'Minimal';
//     }
//   }
export interface TabsVariants {
    A: 'A';
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
    Small: 'Small';
    Base: 'Base';
    Large: 'Large';
    ExtraSmall: 'ExtraSmall';
    IconSmall: 'IconSmall';
    Icon: 'Icon';
    IconLarge: 'IconLarge';
    IconExtraSmall: 'IconExtraSmall';
}

// Type - Tabs Size (derived from TabsSizes interface)
// Automatically includes both structure sizes and any project-added sizes
export type TabsSize = keyof TabsSizes;

// Type - Tabs Theme Configuration
// Structure must define all variants/sizes it declares in the interfaces above
// Project extensions are optional (Partial)
export interface TabsThemeConfiguration {
    variants: Partial<Record<TabsVariant, string>>;
    sizes: Partial<Record<TabsSize, string>>;
    iconSizes: Partial<Record<TabsSize, string>>;
    configuration: {
        baseClasses: string; // Applied to Tabs wrapper (minimal, variant adds styling)
        itemBaseClasses: string; // Applied to all TabItems (minimal, variant adds styling)
        itemActiveClasses: string; // Applied to active TabItem background indicator
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
        // Variant A - Default tabs styling with pill background
        // Use for: Standard tab navigation with rounded pill design and background container
        // Features: Light background container, animated active state indicator, smooth transitions
        A: mergeClassNames(
            tabsWrapperLayoutClassNames,
            // Background for wrapper
            'background--1',
        ),
    },

    // Sizes - Define padding, typography, and spacing for TabItems
    sizes: {
        // Text tabs (with labels)
        Small: mergeClassNames(tabItemTextLayoutClassNames, 'gap-2 px-4 py-1.5 text-xs'),
        Base: mergeClassNames(tabItemTextLayoutClassNames, 'gap-2.5 px-5 py-2 text-sm'),
        Large: mergeClassNames(tabItemTextLayoutClassNames, 'gap-3 px-6 py-3 text-sm font-medium'),
        ExtraSmall: mergeClassNames(tabItemTextLayoutClassNames, 'gap-2 px-6 py-1.5 text-sm'),

        // Icon-only tabs (no text, just icon)
        IconSmall: 'px-2.5 py-2.5',
        Icon: 'px-3 py-3',
        IconLarge: 'px-3.5 py-3.5',
        IconExtraSmall: 'px-2 py-2',
    },

    // Icon dimensions for TabItem icons
    // Maps tab sizes to their corresponding icon dimensions (applied via themeIcon utility)
    iconSizes: {
        // Icon dimensions for text tabs (tabs with text + icon)
        Small: 'size-3.5',
        Base: 'size-4',
        Large: 'size-4',
        ExtraSmall: 'size-4',

        // Icon dimensions for icon-only tabs (no text, just an icon)
        IconSmall: 'size-3.5',
        Icon: 'size-4',
        IconLarge: 'size-4',
        IconExtraSmall: 'size-4',
    },

    // Configuration
    configuration: {
        // Base classes for Tabs wrapper (minimal, variant A adds the background)
        baseClasses: '',

        // Base classes for all TabItems (common interaction states)
        itemBaseClasses: mergeClassNames(
            tabItemCommonClassNames,
            // Default content color
            'content--2',
            // Hover state
            'hover:content--0',
            // Active state
            'data-[state=active]:content--0',
        ),

        // Active state background indicator for TabItem
        // Animated background that slides between tabs using Framer Motion layoutId
        itemActiveClasses: mergeClassNames(
            'absolute inset-0 h-full w-full border border-transparent',
            'z-0 group-data-[state=active]:border--0 group-data-[state=active]:background--0',
        ),

        // Default variant and size
        defaultVariant: {
            variant: 'A',
            size: 'Base',
        },
    },
};
