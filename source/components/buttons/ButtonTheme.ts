/**
 * Structure Button Theme
 *
 * Default button theme for the structure library. Provides portable, framework-agnostic
 * button variants and sizes that work out-of-the-box in any project.
 *
 * Projects can override/extend this theme via ProjectSettings.theme.components.Button
 */

// Dependencies - Utilities
import { mergeClassNames } from './../../utilities/style/ClassName';

// Layout styles for styled buttons (not applied to unstyled buttons)
export const buttonLayoutClassNames =
    // Flex layout with spacing between icons and text
    `inline-flex items-center justify-center gap-2`;

// Common button styles: interaction behavior and disabled states
export const buttonCommonClassNames = mergeClassNames(
    // Layout
    'whitespace-nowrap select-none',
    // Cursor
    'cursor-pointer',
    // Animation
    'transition-colors ease-out',
    // Disabled states (works for both button[disabled] and a[aria-disabled])
    'disabled:cursor-not-allowed disabled:opacity-75',
    'aria-disabled:cursor-not-allowed aria-disabled:opacity-75',
);

// Centered button styles: sizing and shape
export const buttonCenteredClassNames = mergeClassNames(
    // Shape
    'rounded-lg',
    // Content
    'text-sm font-medium',
);

// Focus styles for styled buttons
export const buttonFocusClassNames = mergeClassNames(
    // Focus
    'focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none',
    // Ring offset colors (matches background--0 for gap effect)
    'focus-visible:ring-offset-white-1000 dark:focus-visible:ring-offset-black-700',
    // Light and dark mode focus ring colors
    'focus-visible:ring-black-350 dark:focus-visible:ring-white-650',
);

// Icon button layout: square aspect ratio for icon-only buttons
export const buttonIconLayoutClassNames = `aspect-square`;

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
    Outline: 'Outline';
    Contrast: 'Contrast';
    Ghost: 'Ghost';
    Destructive: 'Destructive';
    GhostDestructive: 'GhostDestructive';
    ToggleOn: 'ToggleOn';
    ToggleOff: 'ToggleOff';
    MenuItem: 'MenuItem';
    FormInputCheckbox: 'FormInputCheckbox';
    FormInputSelect: 'FormInputSelect';
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
    ExtraSmall: 'ExtraSmall';
    Small: 'Small';
    Base: 'Base';
    Large: 'Large';
    ExtraLarge: 'ExtraLarge';
    IconExtraSmall: 'IconExtraSmall';
    IconSmall: 'IconSmall';
    Icon: 'Icon';
    IconLarge: 'IconLarge';
    IconExtraLarge: 'IconExtraLarge';
    MenuItem: 'MenuItem';
    FormInputCheckbox: 'FormInputCheckbox';
    FormInputSelect: 'FormInputSelect';
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

        // Variant A - Primary button with custom styling
        // Use for: Main call-to-action buttons, primary actions
        A: mergeClassNames(
            buttonLayoutClassNames,
            buttonCommonClassNames,
            buttonCenteredClassNames,
            buttonFocusClassNames,
            'border',
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

        // Variant Outline - Button with visible border and no fill
        // Use for: Secondary actions, alternative options
        Outline: mergeClassNames(
            buttonLayoutClassNames,
            buttonCommonClassNames,
            buttonCenteredClassNames,
            buttonFocusClassNames,
            'border border--0 content--0',
            // Hover - Emphasize border and content
            'hover:border--6 hover:content---1',
            // Active and open - Further emphasize border and content
            'active:border-content--5 active:content---3',
            'data-[state=open]:border-content--5 data-[state=open]:content---3',
        ),

        // Variant Contrast - High contrast button using inverted content colors
        // Use for: Important CTAs that need maximum visibility against background--0
        Contrast: mergeClassNames(
            buttonLayoutClassNames,
            buttonCommonClassNames,
            buttonCenteredClassNames,
            buttonFocusClassNames,
            'border',
            // Base: Use content color as background for true contrast
            'border-content--0 background-content--0 content--10',
            // Hover: Emphasize with darker/lighter content colors
            'hover:border-content---1 hover:background-content---1 hover:content--9',
            // Active: Maximum emphasis
            'active:border-content---2 active:background-content---2 active:content--8',
            'data-[state=open]:border-content---2 data-[state=open]:background-content---2 data-[state=open]:content--8',
        ),

        // Variant Ghost - Minimal button with no background until hover
        // Use for: Tertiary actions, icon buttons, toolbar buttons, less prominent actions
        Ghost: mergeClassNames(
            buttonCommonClassNames,
            // Rounded
            'rounded-lg',
            // Content
            'content--3',
            // Hover
            'hover:background--6 hover:content--1',
            // Active and Popover open states (for TipButton)
            'active:background--8 data-[state=delayed-open]:background--8 data-[state=instant-open]:background--8 data-[state=open]:background--8',
            'active:content---1 data-[state=delayed-open]:content---1 data-[state=instant-open]:content---1 data-[state=open]:content---1',
        ),

        // Variant Destructive - Dangerous/destructive action button
        // Use for: Delete, remove, or other irreversible destructive actions
        Destructive: mergeClassNames(
            buttonLayoutClassNames,
            buttonCommonClassNames,
            buttonCenteredClassNames,
            buttonFocusClassNames,
            'border',
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
            buttonCommonClassNames,
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
            buttonCommonClassNames,
            buttonCenteredClassNames,
            'rounded-md border',
            // Toggled on: More prominent appearance to show active state
            'border--2 background--3 content--0',
            // Hover: Slightly more emphasis
            'hover:border--3 hover:background--4',
        ),

        // Variant ToggleOff - Button in untoggled/inactive state
        // Use for: Toggle buttons, filter chips, or selectable options that are currently OFF
        ToggleOff: mergeClassNames(
            buttonCommonClassNames,
            buttonCenteredClassNames,
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
            'relative flex cursor-default items-center justify-start',
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

        // Variant FormInputCheckbox - Checkbox button in forms
        // Use for: Checkbox inputs with custom styling
        FormInputCheckbox: mergeClassNames(
            buttonCommonClassNames,
            buttonFocusClassNames,
            'flex items-center justify-center',
            'rounded-sm border',
            // Base: Subtle background with border
            'border--3 background--0 content--0',
            // Hover: Slight emphasis
            'hover:border--2 hover:background--2',
            // Checked state: Inverted colors (content color becomes background)
            'data-[state=checked]:border-content--0 data-[state=checked]:background-content--0 data-[state=checked]:content--10',
            // Indeterminate state: Same styling as checked
            'data-[state=indeterminate]:border-content--0 data-[state=indeterminate]:background-content--0 data-[state=indeterminate]:content--10',
        ),

        // Variant FormInputSelect - Select input button styling
        // Use for: Custom select/dropdown triggers in forms
        FormInputSelect: mergeClassNames(
            buttonCommonClassNames,
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
            buttonCommonClassNames,
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
        ExtraSmall: 'h-7 rounded-md px-2 text-xs',
        Small: 'h-8 rounded-md px-3 text-xs',
        Base: 'h-9 px-4 py-2',
        Large: 'h-10 rounded-md px-8',
        ExtraLarge: 'h-11 rounded-md px-10',

        // Icon Button Sizes
        IconExtraSmall: mergeClassNames(buttonIconLayoutClassNames, 'rounded-sm p-1'),
        IconSmall: mergeClassNames(buttonIconLayoutClassNames, 'p-1.5'),
        Icon: mergeClassNames(buttonIconLayoutClassNames, 'p-2'),
        IconLarge: mergeClassNames(buttonIconLayoutClassNames, 'p-2.5'),
        IconExtraLarge: mergeClassNames(buttonIconLayoutClassNames, 'p-3'),

        // Specialized Sizes
        MenuItem: 'pt-1.5 pr-3 pb-1.5',
        FormInputCheckbox: 'h-4 w-4',
        FormInputSelect: 'px-4 h-9',
        TableHeaderCell: 'h-8',
    },

    // Icon Sizes (corresponding to button sizes)
    iconSizes: {
        // General Purpose Sizes
        ExtraSmall: 'h-2 w-2',
        Small: 'h-3 w-3',
        Base: 'h-4 w-4',
        Large: 'h-5 w-5',
        ExtraLarge: 'h-6 w-6',

        // Icon Button Sizes
        IconExtraSmall: 'h-3 w-3',
        IconSmall: 'h-4 w-4',
        Icon: 'h-4.5 w-4.5',
        IconLarge: 'h-6 w-6',
        IconExtraLarge: 'h-7 w-7',

        // Specialized Sizes
        MenuItem: 'h-4 w-4',
        FormInputCheckbox: 'h-3 w-3',
        FormInputSelect: 'h-4 w-4',
        TableHeaderCell: 'h-3 w-3',
    },

    // Configuration
    configuration: {
        // Base classes (empty = unstyled by default, variants include their own base styles)
        baseClasses: '',

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
