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

        // Variant A - Primary button
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

        // Variant Outline - Uses a simple border to define button shape
        // Outline: mergeClassNames(
        //     buttonLayoutClassNames,
        //     buttonCommonClassNames,
        //     buttonCenteredClassNames,
        //     buttonFocusClassNames,
        //     'border',
        //     // Light mode - Background, border, and text (using dark colors)
        //     'border-white-700 text-black-700',
        //     'hover:border-white-300 hover:text-black-900',
        //     'active:border-gray-50 active:text-black-1000',
        //     'data-[state=open]:border-gray-50 data-[state=open]:text-black-1000',
        //     // Dark mode - Background, border, and text (using light colors)
        //     'dark:border-black-350 dark:text-white-700',
        //     'dark:hover:border-black-0 dark:hover:text-white-850',
        //     'dark:active:border-gray-500 dark:active:text-white-1000',
        //     'dark:data-[state=open]:border-gray-500 dark:data-[state=open]:text-white-1000',
        // ),

        // Variant Contrast - Contrasts `background--0` using `content--0` as background colors
        Contrast: mergeClassNames(
            buttonLayoutClassNames,
            buttonCommonClassNames,
            buttonCenteredClassNames,
            buttonFocusClassNames,
            'border',
            // Light mode - Background, border, and text (using dark colors)
            'border-black-350 bg-black-350 text-white-800',
            'hover:border-black-650 hover:bg-black-550 hover:text-white-850',
            'active:border-black-500 active:bg-black-500 active:text-white-900',
            'data-[state=open]:border-black-300 data-[state=open]:bg-black-500 data-[state=open]:text-white-900',
            // Dark mode - Background, border, and text (using light colors)
            'dark:border-white-650 dark:bg-white-650 dark:text-black-350',
            'dark:hover:border-white-850 dark:hover:bg-white-850 dark:hover:text-black-550',
            'dark:active:border-white-1000 dark:active:bg-white-1000 dark:active:text-black-700',
            'dark:data-[state=open]:border-white-1000 dark:data-[state=open]:bg-white-1000 dark:data-[state=open]:text-black-700',
        ),

        // Variant Ghost - Minimal button with no background until hover
        Ghost: mergeClassNames(
            buttonCommonClassNames,
            // Rounded
            'rounded-lg',
            // Content
            'content--1',
            // Hover
            'hover:background--3 hover:content--0',
            // Active and Popover open states (for TipButton)
            'active:background--4 active:content--0',
            'data-[state=delayed-open]:background--4 data-[state=instant-open]:background--4 data-[state=open]:background--4',
            'data-[state=delayed-open]:content--0 data-[state=instant-open]:content--0 data-[state=open]:content--0',
        ),

        // Variant Destructive - Dangerous action button
        // Both modes: Subtle background with red text and red border on hover/focus
        // Use for: Delete, remove, or other destructive actions
        // TODO: Needs review
        Destructive: mergeClassNames(
            buttonLayoutClassNames,
            buttonCommonClassNames,
            buttonCenteredClassNames,
            buttonFocusClassNames,
            // Border
            'border',
            // Light
            'border--3 background--2 text-red-500',
            // Dark
            'dark:bg-dark-2 dark:border-dark-4 dark:text-red-500',
            // Light - Hover
            'hover:border-red-500',
            // Dark - Hover
            'dark:hover:border-red-500',
            // Light - Active (includes when used as open popover trigger)
            'active:bg-light-3 data-[state=open]:bg-light-3 active:border-red-500 data-[state=open]:border-red-500',
            // Dark - Active (includes when used as open popover trigger)
            'dark:active:bg-dark-3 dark:data-[state=open]:bg-dark-3 dark:active:border-red-500 dark:data-[state=open]:border-red-500',
            // Light - Focus
            'focus:border-red-500',
            // Dark - Focus
            'dark:focus:border-red-500',
            // Light - Disabled
            'disabled:hover:border--3 disabled:hover:background--2',
            // Dark - Disabled
            'dark:disabled:hover:bg-dark-1 dark:disabled:hover:border-dark-3',
        ),

        // Specialized UI Variants

        // Variant GhostDestructive - Minimal destructive action
        // Both modes: Tertiary text, red background on hover
        // Use for: Less prominent destructive actions
        // TODO: Needs review
        GhostDestructive: mergeClassNames(
            buttonLayoutClassNames,
            buttonCommonClassNames,
            buttonCenteredClassNames,
            buttonFocusClassNames,
            // Rounded and hover
            'hover:bg-accent hover:text-accent-foreground rounded-md',
            // Color, hover, and active states
            'dark:text-light-4 content--2 hover:bg-red-500/10 hover:text-red-500 active:border-0 dark:hover:text-red-500',
        ),

        // TODO: Needs review
        ToggleOn: mergeClassNames(
            buttonCommonClassNames,
            buttonCenteredClassNames,
            // Toggled on
            'border-neutral+6 bg-light-2 dark:border-dark-6 dark:bg-dark-2 rounded-md border',
        ),

        // TODO: Needs review
        ToggleOff: mergeClassNames(
            buttonCommonClassNames,
            buttonCenteredClassNames,
            // Toggled off
            'dark:border-dark-4 rounded-md border border--3',
        ),

        // TODO: Needs review
        MenuItem: mergeClassNames(
            'relative flex cursor-default items-center justify-start rounded-xs font-normal',
            // Focus states
            'focus-border-none focus-visible:outline-none',
            // Highlighted states
            'data-[highlighted=true]:bg-light-2 data-[highlighted=true]:dark:bg-dark-3',
            // Active states
            'data-[highlighted=true]:active:bg-light-3 data-[highlighted=true]:dark:active:bg-dark-4',
            // Disabled states
            'disabled:opacity-50',
            // Padding based on selected state (for checkmark icon spacing)
            'pl-8 data-[selected=true]:pl-2',
            // Icon animation when selected (applies to first direct SVG child only - the iconLeft checkmark)
            '[&[data-selected=true]>svg:first-child]:animate-in [&[data-selected=true]>svg:first-child]:duration-200 [&[data-selected=true]>svg:first-child]:fade-in',
        ),

        // TODO: Needs review
        FormInputCheckbox: mergeClassNames(
            buttonCommonClassNames,
            // Layout and sizing
            'flex content-center items-center justify-center',
            // Border
            'dark:border-light rounded-sm border border--3',
            // Text and background
            'background--0 content--0',
            // Hover
            'hover:bg-light-2 dark:hover:bg-dark-3',
            // Active (includes when used as open popover trigger)
            'active:bg-light-3 data-[state=open]:bg-light-3 dark:active:bg-light dark:data-[state=open]:bg-light',
            // Checked
            'dark:data-[state=checked]:bg-light dark:data-[state=checked]:text-dark',
            // Indeterminate
            'dark:data-[state=indeterminate]:bg-light dark:data-[state=indeterminate]:text-dark',
            // Focus
            'ring-offset-background ring-light focus-visible:ring focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:outline-none',
        ),

        // TODO: Needs review
        FormInputSelect: mergeClassNames(
            buttonCommonClassNames,
            // Layout (no justify-center because grow handles spacing)
            'inline-flex items-center',
            // Text
            'text-sm',
            // Border
            'dark:border-dark-4 rounded-lg border border--3',
            // Light text on dark background
            'background--0 content--0',
            // Active (includes when used as open popover trigger)
            'active:bg-light-3 data-[state=open]:bg-light-3 dark:active:bg-dark-4 dark:data-[state=open]:bg-dark-4',
            // Disabled
            'disabled:hover:bg-dark-2 dark:disabled:hover:bg-dark-2',
            // Focus (only when not open, since background already indicates open state)
            'focus:not([data-state=open]):border-neutral dark:focus:not([data-state=open]):border-light focus-visible:ring-0 focus-visible:outline-none',
        ),

        // TODO: Needs review
        TableHeaderCell: mergeClassNames(
            buttonCommonClassNames,
            // Text
            'hover:-text-dark dark:hover:text-light text-xs font-normal content--2',
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
