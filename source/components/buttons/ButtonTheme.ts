/**
 * Structure Button Theme
 *
 * Default button theme for the structure library. Provides portable, framework-agnostic
 * button variants and sizes that work out-of-the-box in any project.
 *
 * Projects can override/extend this theme via ProjectSettings.theme.components.Button
 */

// Layout styles for styled buttons (not applied to unstyled buttons)
export const buttonLayoutClassNames =
    // Flex layout with spacing between icons and text
    `inline-flex items-center justify-center gap-2`;

// Common button styles: interaction behavior and disabled states
export const buttonCommonClassNames =
    // Layout
    `whitespace-nowrap select-none ` +
    // Cursor
    `cursor-pointer ` +
    // Disabled states (works for both button[disabled] and a[aria-disabled])
    `disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75`;

// Centered button styles: sizing and shape
export const buttonCenteredClassNames =
    // Shape
    `rounded-small ` +
    // Content
    `text-sm font-medium`;

// Focus styles for styled buttons
export const buttonFocusClassNames =
    // Focus
    `focus-visible:outline-none focus-visible:ring-0`;

// Hover styles: background and text color changes on hover
export const buttonHoverClassNames =
    // Hover
    `hover:bg-dark-5 dark:hover:bg-dark-3 ` +
    // Disabled (works for both button[disabled] and a[aria-disabled])
    `disabled:hover:bg-dark-2 dark:disabled:hover:bg-dark-2 ` +
    `aria-disabled:hover:bg-dark-2 dark:aria-disabled:hover:bg-dark-2`;

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
    B: 'B';
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

        // Variant A - Primary action button (inverted for high contrast)
        // Light mode: Dark background (#181818), light text (#ffffff)
        // Dark mode: Light background (#e7e7e7), dark text (#181818)
        // Use for: Primary actions, call-to-action buttons (e.g., Submit, Sign Up)
        // Equivalent to old bg-opsis-action-primary
        A:
            `${buttonLayoutClassNames} ${buttonCommonClassNames} ${buttonCenteredClassNames} ${buttonFocusClassNames} ` +
            // Background uses foreground color (inversion), text uses background color
            `bg-[var(--foreground--a)] text-[var(--background--a)] ` +
            // Border matches background
            `border border-[var(--foreground--a)] ` +
            // Hover - slightly lighter/darker
            `hover:bg-black-600 dark:hover:bg-white-600 ` +
            // Active (includes when used as open popover trigger)
            `active:bg-black-500 dark:active:bg-white-500 ` +
            `data-[state=open]:bg-black-500 dark:data-[state=open]:bg-white-500 ` +
            // Focus
            `focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-blue-500 ` +
            // Disabled
            `disabled:opacity-50 disabled:cursor-not-allowed`,

        // Variant B - Standard button (adapts to theme)
        // Light mode: Light background, dark text
        // Dark mode: Dark background, light text
        // Use for: Secondary actions, default buttons
        B:
            `${buttonLayoutClassNames} ${buttonCommonClassNames} ${buttonCenteredClassNames} ${buttonFocusClassNames} ` +
            // Follows theme direction
            `background--b foreground--a ` +
            // Border
            `border border--b ` +
            // Hover
            `hover:background--c ` +
            // Active (includes when used as open popover trigger)
            `active:background--d data-[state=open]:background--d ` +
            // Focus
            `focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-gray-500 ` +
            // Disabled
            `disabled:opacity-50 disabled:cursor-not-allowed`,

        // Variant Ghost - Minimal button with no background
        // Light mode: Secondary text color, light background on hover
        // Dark mode: Secondary text color, dark background on hover
        // Use for: Tertiary actions, icon buttons, less prominent interactions
        Ghost:
            `${buttonCommonClassNames} ` +
            // Rounded
            `rounded-xs ` +
            // Text color
            `foreground--b ` +
            // Hover and active states
            `hover:bg-light-2 hover:foreground--a active:bg-light-4 dark:hover:bg-dark-4 dark:active:bg-dark-6 ` +
            // Popover open states (for TipButton)
            `data-[state=delayed-open]:bg-light-2 data-[state=instant-open]:bg-light-2 data-[state=open]:bg-light-2 ` +
            `data-[state=delayed-open]:dark:bg-dark-4 data-[state=instant-open]:dark:bg-dark-4 data-[state=open]:dark:bg-dark-4`,

        // Variant Destructive - Dangerous action button
        // Both modes: Subtle background with red text and red border on hover/focus
        // Use for: Delete, remove, or other destructive actions
        Destructive:
            `${buttonLayoutClassNames} ${buttonCommonClassNames} ${buttonCenteredClassNames} ${buttonFocusClassNames} ` +
            // Border
            `border ` +
            // Light
            `bg-light-1 border--d text-red-500 ` +
            // Dark
            `dark:bg-dark-2 dark:border-dark-4 dark:text-red-500 ` +
            // Light - Hover
            `hover:border-red-500 ` +
            // Dark - Hover
            `dark:hover:border-red-500 ` +
            // Light - Active (includes when used as open popover trigger)
            `active:bg-light-3 data-[state=open]:bg-light-3 active:border-red-500 data-[state=open]:border-red-500 ` +
            // Dark - Active (includes when used as open popover trigger)
            `dark:active:bg-dark-3 dark:data-[state=open]:bg-dark-3 dark:active:border-red-500 dark:data-[state=open]:border-red-500 ` +
            // Light - Focus
            `focus:border-red-500  ` +
            // Dark - Focus
            `dark:focus:border-red-500 ` +
            // Light - Disabled
            `disabled:hover:bg-light-1 disabled:hover:border--d ` +
            // Dark - Disabled
            `dark:disabled:hover:bg-dark-1 dark:disabled:hover:border-dark-3`,

        // Specialized UI Variants

        // Variant GhostDestructive - Minimal destructive action
        // Both modes: Tertiary text, red background on hover
        // Use for: Less prominent destructive actions
        GhostDestructive:
            `${buttonLayoutClassNames} ${buttonCommonClassNames} ${buttonCenteredClassNames} ${buttonFocusClassNames} ` +
            // Rounded and hover
            `rounded-md hover:bg-accent hover:text-accent-foreground ` +
            // Color, hover, and active states
            `foreground--c hover:bg-red-500/10 hover:text-red-500 dark:text-light-4 dark:hover:text-red-500 active:border-0`,

        ToggleOn:
            `${buttonCommonClassNames} ${buttonCenteredClassNames} ` +
            // Toggled on
            `rounded-md border border-neutral+6 dark:border-dark-6 bg-light-2 dark:bg-dark-2`,

        ToggleOff:
            `${buttonCommonClassNames} ${buttonCenteredClassNames} ` +
            // Toggled off
            `rounded-md border border--d dark:border-dark-4`,

        MenuItem:
            `relative flex items-center justify-start font-normal cursor-default rounded-xs ` +
            // Focus states
            `focus-border-none focus-visible:outline-none ` +
            // Highlighted states
            `data-[highlighted=true]:bg-light-2 data-[highlighted=true]:dark:bg-dark-3 ` +
            // Active states
            `data-[highlighted=true]:active:bg-light-3 data-[highlighted=true]:dark:active:bg-dark-4 ` +
            // Disabled states
            `disabled:opacity-50 ` +
            // Padding based on selected state (for checkmark icon spacing)
            `data-[selected=true]:pl-2 pl-8 ` +
            // Icon animation when selected (applies to first direct SVG child only - the iconLeft checkmark)
            `[&[data-selected=true]>svg:first-child]:animate-in [&[data-selected=true]>svg:first-child]:fade-in [&[data-selected=true]>svg:first-child]:duration-200`,

        FormInputCheckbox:
            `${buttonCommonClassNames} ` +
            // Layout and sizing
            `flex items-center justify-center content-center ` +
            // Border
            `rounded-small border border--d dark:border-light ` +
            // Text and background
            `background--a foreground--a ` +
            // Hover
            `hover:bg-light-2 dark:hover:bg-dark-3 ` +
            // Active (includes when used as open popover trigger)
            `active:bg-light-3 data-[state=open]:bg-light-3 dark:active:bg-light dark:data-[state=open]:bg-light ` +
            // Checked
            `dark:data-[state=checked]:bg-light dark:data-[state=checked]:text-dark ` +
            // Indeterminate
            `dark:data-[state=indeterminate]:bg-light dark:data-[state=indeterminate]:text-dark ` +
            // Focus
            `focus-visible:outline-none ring-offset-background focus-visible:ring-offset-2 focus-visible:ring focus-visible:ring-1 ring-light`,

        FormInputSelect:
            `${buttonCommonClassNames} ` +
            // Layout (no justify-center because flex-grow handles spacing)
            `inline-flex items-center ` +
            // Text
            `text-sm ` +
            // Border
            `rounded-small border border--d dark:border-dark-4 ` +
            // Light text on dark background
            `background--a foreground--a ` +
            // Active (includes when used as open popover trigger)
            `active:bg-light-3 data-[state=open]:bg-light-3 dark:active:bg-dark-4 dark:data-[state=open]:bg-dark-4 ` +
            // Disabled
            `disabled:hover:bg-dark-2 dark:disabled:hover:bg-dark-2 ` +
            // Focus (only when not open, since background already indicates open state)
            `focus:not([data-state=open]):border-neutral dark:focus:not([data-state=open]):border-light focus-visible:outline-none focus-visible:ring-0`,

        TableHeaderCell:
            `${buttonCommonClassNames} ` +
            // Text
            `text-xs font-normal foreground--c hover:-text-dark dark:hover:text-light`,
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
        IconExtraSmall: `${buttonIconLayoutClassNames} p-1`,
        IconSmall: `${buttonIconLayoutClassNames} p-1.5`,
        Icon: `${buttonIconLayoutClassNames} p-2`,
        IconLarge: `${buttonIconLayoutClassNames} p-2.5`,
        IconExtraLarge: `${buttonIconLayoutClassNames} p-3`,

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
