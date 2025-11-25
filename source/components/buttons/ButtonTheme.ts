/**
 * Structure Button Theme
 *
 * Default button theme for the structure library. Provides portable, framework-agnostic
 * button variants and sizes that work out-of-the-box in any project.
 *
 * Projects can override/extend this theme via ProjectSettings.theme.components.Button
 */

// Dependencies - Utilities
// Use relative path to avoid Tailwind CSS resolution issues
import { mergeClassNames } from '../../utilities/style/ClassName';

// Common layout: flex container with icon/text spacing
export const buttonCommonLayoutClassNames =
    // Flex layout with spacing between icons and text
    `inline-flex items-center justify-center gap-2`;

// Common behavior: text handling, transitions, disabled states
export const buttonCommonBehaviorClassNames = mergeClassNames(
    // Text behavior
    'whitespace-nowrap select-none',
    // Animation
    'transition-colors ease-out',
    // Disabled states (works for both button[disabled] and a[aria-disabled])
    'disabled:cursor-not-allowed disabled:opacity-75',
    'aria-disabled:cursor-not-allowed aria-disabled:opacity-75',
);

// Common typography: font weight for button text
export const buttonCommonTypographyClassNames = mergeClassNames(
    // Content
    'font-medium',
);

// Common focus: ring-offset pattern for 1px gap effect
// Override global outline with ring-offset pattern for 1px gap effect
export const buttonCommonFocusClassNames = mergeClassNames(
    // Remove global outline
    'focus-visible:outline-none',
    // Ring pattern: 1px gap + 1px border
    'focus-visible:ring-1 focus-visible:ring-border-focus',
    'focus-visible:ring-offset-1',
    // Ring offset color (matches background--0 for gap effect)
    'focus-visible:ring-offset-background-0',
);

// Icon-only buttons: square aspect ratio (no text, just icon)
export const buttonIconOnlyLayoutClassNames = `aspect-square`;

// Button Variants Interface - Source of truth for all button variants
// Structure defines its base variants here, and projects can augment to add custom variants
// Example in project code:
//   declare module '@structure/source/components/buttons/ButtonTheme' {
//     interface ButtonVariants {
//       Blue: 'Blue';
//     }
//   }
export interface ButtonVariants {
    A: 'A';
    B: 'B';
    Common: 'Common';
    Outline: 'Outline';
    Contrast: 'Contrast';
    Ghost: 'Ghost';
    Destructive: 'Destructive';
    GhostDestructive: 'GhostDestructive';
    ToggleOn: 'ToggleOn';
    ToggleOff: 'ToggleOff';
    MenuItem: 'MenuItem';
    InputSelect: 'InputSelect';
    TableHeaderCell: 'TableHeaderCell';
}

// Type - Button Variant (derived from ButtonVariants interface)
// Automatically includes both structure variants and any project-added variants
export type ButtonVariant = keyof ButtonVariants;

// Button Sizes Interface - Source of truth for all button sizes
// Structure defines its base sizes here, and projects can augment to add custom sizes
// Example in project code:
//   declare module '@structure/source/components/buttons/ButtonTheme' {
//     interface ButtonSizes {
//       ExtraLarge: 'ExtraLarge';
//     }
//   }
export interface ButtonSizes {
    ExtraExtraSmall: 'ExtraExtraSmall';
    ExtraSmall: 'ExtraSmall';
    Small: 'Small';
    Base: 'Base';
    Large: 'Large';
    ExtraLarge: 'ExtraLarge';
    IconExtraExtraSmall: 'IconExtraExtraSmall';
    IconExtraSmall: 'IconExtraSmall';
    IconSmall: 'IconSmall';
    Icon: 'Icon';
    IconLarge: 'IconLarge';
    IconExtraLarge: 'IconExtraLarge';
    IconExtraExtraLarge: 'IconExtraLarge';
    MenuItem: 'MenuItem';
    InputSelect: 'InputSelect';
    TableHeaderCell: 'TableHeaderCell';
}

// Type - Button Size (derived from ButtonSizes interface)
// Automatically includes both structure sizes and any project-added sizes
export type ButtonSize = keyof ButtonSizes;

// Type - Button Theme Configuration
// Structure must define all variants/sizes it declares in the interfaces above
// Project extensions are optional (Partial)
export interface ButtonThemeConfiguration {
    variants: Partial<Record<ButtonVariant, string>>;
    sizes: Partial<Record<ButtonSize, string>>;
    iconSizes: Partial<Record<ButtonSize, string>>;
    configuration: {
        baseClasses: string;
        focusClasses: string;
        disabledClasses: string;
        defaultVariant: {
            variant?: ButtonVariant;
            size?: ButtonSize;
        };
    };
}

// Button Theme - Structure Default
export const buttonTheme: ButtonThemeConfiguration = {
    // Variants
    variants: {
        // General Purpose Variants

        // Variant A
        A: mergeClassNames(
            buttonCommonLayoutClassNames,
            buttonCommonBehaviorClassNames,
            buttonCommonTypographyClassNames,
            buttonCommonFocusClassNames,
            'rounded-lg border',
            // Light mode - Background, border, and text
            'border-white-550 bg-white-850 text-black-800',
            'hover:border-white-450 hover:bg-white-750 hover:text-black-850',
            'active:border-white-350 active:bg-white-650 active:text-black-900',
            'data-[state=open]:border-white-350 data-[state=open]:bg-white-650 data-[state=open]:text-black-900',
            // Dark mode - Background, border, and text
            'dark:border-black-300 dark:bg-black-600 dark:text-white-800',
            'dark:hover:border-black-250 dark:hover:bg-black-550 dark:hover:text-white-850',
            'dark:active:border-black-200 dark:active:bg-black-500 dark:active:text-white-900',
            'dark:data-[state=open]:border-black-200 dark:data-[state=open]:bg-black-500 dark:data-[state=open]:text-white-900',
        ),

        // Variant B
        B: mergeClassNames(
            buttonCommonLayoutClassNames,
            buttonCommonBehaviorClassNames,
            buttonCommonTypographyClassNames,
            buttonCommonFocusClassNames,
            // Border is fully round and outlined
            'rounded-full border border--0',
            // Background and content match the page background and content
            'background--0 content--0',
            // Hover emphasizes the border and content
            'hover:border--5 hover:content---1',
            // Active further emphasizes border
            'active:border--10 active:content---3',
            // Open and active states match active styling
            'data-[state=open]:border--10 data-[state=open]:content---3',
            'data-[state=active]:border--10 data-[state=active]:content---3',
        ),

        // Variant Common
        Common: mergeClassNames(
            buttonCommonLayoutClassNames,
            buttonCommonBehaviorClassNames,
            buttonCommonTypographyClassNames,
            buttonCommonFocusClassNames,
        ),

        // Variant Outline - Button with visible border and no fill
        Outline: mergeClassNames(
            buttonCommonLayoutClassNames,
            buttonCommonBehaviorClassNames,
            buttonCommonTypographyClassNames,
            buttonCommonFocusClassNames,
            'rounded-lg border border--0 content--0',
            // Hover - Emphasize border and content
            'hover:border--6 hover:content---1',
            // Active and open - Further emphasize border and content
            'active:border-content--5 active:content---3',
            'data-[state=open]:border-content--5 data-[state=open]:content---3',
        ),

        // Variant Contrast - High contrast button using inverted content colors
        Contrast: mergeClassNames(
            buttonCommonLayoutClassNames,
            buttonCommonBehaviorClassNames,
            buttonCommonTypographyClassNames,
            buttonCommonFocusClassNames,
            'rounded-lg border',
            // Base: Use content color as background for true contrast
            'border-content--0 background-content--0 content--10',
            // Hover: Emphasize with darker/lighter content colors
            'hover:border-content---1 hover:background-content---1 hover:content--9',
            // Active: Maximum emphasis
            'active:border-content---2 active:background-content---2 active:content--8',
            'data-[state=open]:border-content---2 data-[state=open]:background-content---2 data-[state=open]:content--8',
        ),

        // Variant Ghost - Minimal button with no background until hover
        Ghost: mergeClassNames(
            buttonCommonLayoutClassNames,
            buttonCommonBehaviorClassNames,
            buttonCommonTypographyClassNames,
            'rounded-lg',
            // Content
            'content--0',
            // Hover
            'hover:background--3 hover:content---1',
            // Active and Popover open states (for TipButton)
            'active:background--5 data-[state=active]:background--5 data-[state=delayed-open]:background--5 data-[state=instant-open]:background--5 data-[state=open]:background--5',
            'active:content---3 data-[state=active]:content---1 data-[state=delayed-open]:content---1 data-[state=instant-open]:content---1 data-[state=open]:content---1',
        ),

        // Variant Destructive - Dangerous/destructive action button
        Destructive: mergeClassNames(
            buttonCommonLayoutClassNames,
            buttonCommonBehaviorClassNames,
            buttonCommonTypographyClassNames,
            buttonCommonFocusClassNames,
            'rounded-lg border',
            // Base: Subtle background with semantic negative content
            'border--3 background--2 content--negative',
            // Hover: Emphasize border with negative color
            'hover:border--negative hover:background--3',
            // Active: Stronger emphasis (includes when used as open popover trigger)
            'active:border--negative active:background--4',
            'data-[state=open]:border--negative data-[state=open]:background--4',
            // Focus: Use negative border
            'focus:border--negative',
            // Disabled: Revert to base appearance
            'disabled:hover:border--3 disabled:hover:background--2',
        ),

        // Specialized UI Variants

        // Variant GhostDestructive - Minimal destructive action button
        // Use for: Less prominent destructive actions (e.g., remove from list, clear)
        GhostDestructive: mergeClassNames(
            buttonCommonBehaviorClassNames,
            // Rounded
            'rounded-lg',
            // Content
            'content--3',
            // Hover
            'hover:background--negative/5 hover:content--3',
            // Active and Popover open states (for TipButton)
            'active:background--8 data-[state=delayed-open]:background--8 data-[state=instant-open]:background--8 data-[state=open]:background--8',
            'active:content---1 data-[state=delayed-open]:content---1 data-[state=instant-open]:content---1 data-[state=open]:content---1',
        ),

        // Variant ToggleOn - Button in toggled/active state
        // Use for: Toggle buttons, filter chips, or selectable options that are currently ON
        ToggleOn: mergeClassNames(
            buttonCommonBehaviorClassNames,
            buttonCommonTypographyClassNames,
            'rounded-md border',
            // Toggled on: More prominent appearance to show active state
            'border--2 background--3 content--0',
            // Hover: Slightly more emphasis
            'hover:border--3 hover:background--4',
        ),

        // Variant ToggleOff - Button in untoggled/inactive state
        // Use for: Toggle buttons, filter chips, or selectable options that are currently OFF
        ToggleOff: mergeClassNames(
            buttonCommonBehaviorClassNames,
            buttonCommonTypographyClassNames,
            'rounded-md border',
            // Toggled off: Subtle appearance to show inactive state
            'border--3 background--0 content--2',
            // Hover: Slight emphasis to show interactivity
            'hover:border--2 hover:background--2 hover:content--1',
        ),

        // Variant MenuItem - Menu item button styling
        // Use for: Items within dropdown menus, context menus, select options
        MenuItem: mergeClassNames(
            // Layout
            'relative flex cursor-default items-center justify-start gap-2',
            // Padding based on selected state (for checkmark icon spacing)
            'pl-8 data-[selected=true]:pl-2',
            // Border
            'rounded',
            // Border - Focus states
            'focus:border-none focus-visible:outline-none',
            // Highlighted states
            'data-[highlighted=true]:background--3 dark:data-[highlighted=true]:background--4',
            // Active states
            'data-[highlighted=true]:active:background--4 dark:data-[highlighted=true]:active:background--5',
            // Disabled states
            'disabled:opacity-50',
            // Icon animation when selected (applies to first direct SVG child only - the iconLeft checkmark)
            '[&[data-selected=true]>svg:first-child]:animate-in [&[data-selected=true]>svg:first-child]:duration-200 [&[data-selected=true]>svg:first-child]:fade-in',
        ),

        // Variant InputSelect - Select input button styling
        // Use for: Custom select/dropdown triggers in forms
        InputSelect: mergeClassNames(
            buttonCommonBehaviorClassNames,
            buttonCommonFocusClassNames,
            // Layout (no justify-center because grow handles spacing)
            'inline-flex items-center',
            // Text
            'text-sm content--0',
            // Light text on dark background
            'background--2 dark:background--3',
            // Border
            'rounded-lg border border--1',
            // Hover
            'hover:border--2 hover:background--3 hover:content---1 hover:dark:background--4',
            // Active - Light and Dark (includes when used as open popover trigger)
            'active:border-content--6 data-[state=open]:border-content--6',
            // Active - Light (includes when used as open popover trigger)
            'active:background--4 data-[state=open]:background--4',
            // Active - Dark (includes when used as open popover trigger)
            'dark:active:background--5 dark:data-[state=open]:background--5',
            // Disabled
            'disabled:hover:background--5',
        ),

        // Variant TableHeaderCell - Sortable table header cell button
        // Use for: Clickable/sortable table headers
        TableHeaderCell: mergeClassNames(
            buttonCommonBehaviorClassNames,
            'text-xs font-normal',
            // Base: Muted content
            'content--2',
            // Hover: Emphasize to show interactivity
            'hover:content--0',
            // Active: Strongest emphasis (for sorted column)
            'active:content---1',
        ),
    },

    // Sizes
    sizes: {
        // General Purpose Sizes
        ExtraExtraSmall: mergeClassNames('px-1 py-0.5 text-xs'),
        ExtraSmall: mergeClassNames('px-2 py-1 text-xs'),
        Small: mergeClassNames('px-3 py-1.5 text-sm'),
        Base: mergeClassNames('px-4 py-2 text-sm'),
        Large: mergeClassNames('px-6 py-2.5'),
        ExtraLarge: mergeClassNames('px-10 py-4 text-lg'),

        // Icon-only Button Sizes (square buttons with no text, only an icon)
        IconExtraExtraSmall: mergeClassNames(buttonIconOnlyLayoutClassNames, 'p-0.5'),
        IconExtraSmall: mergeClassNames(buttonIconOnlyLayoutClassNames, 'p-1'),
        IconSmall: mergeClassNames(buttonIconOnlyLayoutClassNames, 'p-1.5'),
        Icon: mergeClassNames(buttonIconOnlyLayoutClassNames, 'p-2'),
        IconLarge: mergeClassNames(buttonIconOnlyLayoutClassNames, 'p-2.5'),
        IconExtraLarge: mergeClassNames(buttonIconOnlyLayoutClassNames, 'p-3'),
        IconExtraExtraLarge: mergeClassNames(buttonIconOnlyLayoutClassNames, 'p-4'),

        // Specialized Sizes
        MenuItem: 'pt-1.5 pr-3 pb-1.5',
        InputSelect: 'px-4 h-9',
        TableHeaderCell: 'h-8',
    },

    // Icon dimensions for each button size
    // Maps button sizes to their corresponding icon dimensions (applied via themeIcon utility)
    iconSizes: {
        // Icon dimensions for text buttons (buttons with text + icon)
        ExtraExtraSmall: 'h-3 w-3',
        ExtraSmall: 'h-2 w-2',
        Small: 'h-3 w-3',
        Base: 'h-4 w-4',
        Large: 'h-5 w-5',
        ExtraLarge: 'h-6 w-6',

        // Icon dimensions for icon-only buttons (no text, just an icon)
        IconExtraExtraSmall: 'h-1.5 w-1.5',
        IconExtraSmall: 'h-2 w-2',
        IconSmall: 'h-3 w-3',
        Icon: 'h-4 w-4',
        IconLarge: 'h-5 w-5',
        IconExtraLarge: 'h-6 w-6',
        IconExtraExtraLarge: 'h-7 w-7',

        // Specialized Sizes
        MenuItem: 'h-4 w-4',
        InputSelect: 'h-4 w-4',
        TableHeaderCell: 'h-3 w-3',
    },

    // Configuration
    configuration: {
        // Base classes applied to all buttons regardless of variant
        baseClasses: 'cursor-pointer',

        // Focus ring for keyboard navigation (empty = variants handle their own focus)
        focusClasses: '',

        // Disabled state styling (empty = variants handle their own disabled states)
        disabledClasses: '',

        // Default properties when not specified
        // No variant = completely unstyled
        // Has variant but no size = Base size applied automatically
        defaultVariant: {
            size: 'Base',
        },
    },
};
