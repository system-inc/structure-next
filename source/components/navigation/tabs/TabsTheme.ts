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
    'z-0 flex',
    // Animation
    'transition-colors',
);

// Common tab item styles: interaction behavior and layout
export const tabItemCommonClassNames = mergeClassNames(
    // Layout
    'group relative flex cursor-pointer',
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
            // Background and padding for wrapper
            'gap-1 rounded-full background--5 p-0.5',
        ),
    },

    // Sizes - Define padding, typography, and spacing for TabItems
    sizes: {
        // Text tabs (with labels)
        ExtraSmall: mergeClassNames(tabItemTextLayoutClassNames, 'gap-0.5 p-px text-xs'),
        Small: mergeClassNames(tabItemTextLayoutClassNames, 'gap-1 p-2 text-xs'),
        Base: mergeClassNames(tabItemTextLayoutClassNames, 'gap-2.5 px-5 py-2 text-sm'),
        Large: mergeClassNames(tabItemTextLayoutClassNames, 'gap-3 px-6 py-3 text-sm font-medium'),

        // Icon-only tabs (no text, just icon)
        IconExtraSmall: mergeClassNames('p-px'),
        IconSmall: mergeClassNames('p-2'),
        Icon: mergeClassNames('p-3'),
        IconLarge: mergeClassNames('p-3.5'),
    },

    // Icon dimensions for TabItem icons
    // Maps tab sizes to their corresponding icon dimensions (applied via themeIcon utility)
    iconSizes: {
        // Icon dimensions for text tabs (tabs with text + icon)
        ExtraSmall: 'size-3',
        Small: 'size-4',
        Base: 'size-5',
        Large: 'size-6',

        // Icon dimensions for icon-only tabs (no text, just an icon)
        IconExtraSmall: 'size-3',
        IconSmall: 'size-4',
        Icon: 'size-5',
        IconLarge: 'size-6',
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
            // Variant A
            'rounded-full',
        ),

        // Active state background indicator for TabItem
        // Animated background that slides between tabs using Framer Motion layoutId
        itemActiveClasses: mergeClassNames(
            'absolute inset-0 h-full w-full border border-transparent',
            'z-0 group-data-[state=active]:border--4 group-data-[state=active]:background--0',
            // Variant A
            'rounded-full',
        ),

        // Default variant and size
        defaultVariant: {
            variant: 'A',
            size: 'Base',
        },
    },
};
