/**
 * Structure Button Theme
 *
 * Default button theme for the structure library. Provides portable, framework-agnostic
 * button variants and sizes that work out-of-the-box in any project.
 *
 * Projects can override/extend this theme via ProjectSettings.theme.components.Button
 */

// Common button styles: flex container, interaction behavior, and focus styles
const commonButton =
    // Layout and container
    `inline-flex items-center whitespace-nowrap select-none ` +
    // Cursor
    `cursor-pointer ` +
    // Disabled states (works for both button[disabled] and a[aria-disabled])
    `disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75`;

// Centered button styles: alignment, sizing, and shape
const centeredButton =
    // Layout and container
    `justify-center rounded-small ` +
    // Content
    `text-sm font-medium`;

// Focus styles
const focusStyle =
    // Focus
    `focus-visible:outline-none focus-visible:ring-0`;

// Hover styles: background and text color changes on hover
const hoverStyle =
    // Hover
    `hover:bg-dark-5 dark:hover:bg-dark-3 ` +
    // Disabled (works for both button[disabled] and a[aria-disabled])
    `disabled:hover:bg-dark-2 dark:disabled:hover:bg-dark-2 ` +
    `aria-disabled:hover:bg-dark-2 dark:aria-disabled:hover:bg-dark-2`;

// Types - Button Base Variants (available in structure library)
export type ButtonBaseVariant =
    | 'Primary'
    | 'Secondary'
    | 'Contrast'
    | 'Ghost'
    | 'Destructive'
    | 'GhostDestructive'
    | 'ToggleOn'
    | 'ToggleOff'
    | 'MenuItem'
    | 'FormInputCheckbox'
    | 'FormInputSelect'
    | 'TableHeaderCell';

// Types - Button Base Sizes (available in structure library)
export type ButtonBaseSize =
    | 'Small'
    | 'Medium'
    | 'Large'
    | 'MenuItem'
    | 'FormInputCheckbox'
    | 'FormInputSelect'
    | 'TableHeaderCell';

// Type - Button Theme Configuration
export interface ButtonThemeConfiguration {
    variants: Record<ButtonBaseVariant, string>;
    sizes: Record<ButtonBaseSize, string>;
    configuration: {
        baseClasses: string;
        iconOnlyClasses: string;
        focusClasses: string;
        disabledClasses: string;
        defaultVariant: {
            variant: ButtonBaseVariant;
            size: ButtonBaseSize;
        };
    };
}

// Button Theme - Structure Default
export const buttonTheme: ButtonThemeConfiguration = {
    // Variants
    variants: {
        // General Purpose Variants
        Primary:
            `${commonButton} ${focusStyle} ${centeredButton} ` +
            // Light text on dark background
            `text-light bg-theme-light-primary dark:bg-theme-dark-primary ` +
            // Hover
            `hover:bg-theme-light-primary-hover dark:hover:bg-theme-dark-primary-hover ` +
            // Active (includes when used as open popover trigger)
            `active:bg-theme-light-primary-active data-[state=open]:bg-theme-light-primary-active dark:active:bg-theme-dark-primary-active dark:data-[state=open]:bg-theme-dark-primary-active ` +
            // Disabled
            `disabled:opacity-100 disabled:bg-theme-light-primary-disabled disabled:dark:bg-theme-dark-primary-disabled`,

        Secondary:
            `${commonButton} ${focusStyle} ${centeredButton} ` +
            // Dark text on light background
            `border bg-light-1 dark:bg-light-2 text-dark dark:text-dark hover:bg-light dark:hover:bg-light ` +
            // Disabled states
            `disabled:hover:bg-light-1 dark:disabled:hover:bg-light-2 ` +
            // Active states (includes when used as open popover trigger)
            `active:bg-light-2 data-[state=open]:bg-light-2 dark:active:bg-light-3 dark:data-[state=open]:bg-light-3`,

        Contrast:
            `${commonButton} ${focusStyle} ${centeredButton} ${hoverStyle} ` +
            // Light text on dark background
            `text-white dark:text-light-2 bg-dark-2 dark:bg-dark-2 ` +
            // Active (includes when used as open popover trigger)
            `active:bg-dark-3 data-[state=open]:bg-dark-3 dark:active:bg-dark-4 dark:data-[state=open]:bg-dark-4 ` +
            // Border matches background
            `border border-dark-2 dark:border-dark-2`,

        Ghost:
            `${commonButton} ${focusStyle} ${centeredButton} ` +
            // Rounded and hover
            `rounded-medium hover:bg-accent border border-transparent hover:text-accent-foreground`,

        Destructive:
            `${commonButton} ${focusStyle} ${centeredButton} ` +
            // Border
            `border ` +
            // Light
            `bg-light-1 border-light-3 text-red-500 ` +
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
            `disabled:hover:bg-light-1 disabled:hover:border-light-3 ` +
            // Dark - Disabled
            `dark:disabled:hover:bg-dark-1 dark:disabled:hover:border-dark-3`,

        // Specialized UI Variants
        GhostDestructive:
            `${commonButton} ${focusStyle} ${centeredButton} ` +
            // Rounded and hover
            `rounded-medium hover:bg-accent hover:text-accent-foreground ` +
            // Color, hover, and active states
            `text-neutral+6 hover:bg-red-500/10 hover:text-red-500 dark:text-light-4 dark:hover:text-red-500 active:border-0`,

        ToggleOn:
            `${commonButton} ${centeredButton} ` +
            // Toggled on
            `rounded-medium border border-neutral+6 dark:border-dark-6 bg-light-2 dark:bg-dark-2`,

        ToggleOff:
            `${commonButton} ${centeredButton} ` +
            // Toggled off
            `rounded-medium border border-light-6 dark:border-dark-4`,

        MenuItem:
            `relative flex items-center justify-start font-normal cursor-default rounded-extra-small ` +
            // Focus states
            `focus-border-none focus-visible:outline-none ` +
            // Highlighted states
            `data-[highlighted=true]:bg-light-2 data-[highlighted=true]:dark:bg-dark-3 ` +
            // Active states
            `data-[highlighted=true]:active:bg-light-3 data-[highlighted=true]:dark:active:bg-dark-4 ` +
            // Disabled states
            `disabled:opacity-50`,

        FormInputCheckbox:
            `${commonButton} ` +
            // Layout and sizing
            `flex items-center justify-center content-center ` +
            // Border
            `rounded-small border border-light-6 dark:border-light ` +
            // Text and background
            `bg-opsis-background-primary text-opsis-content-primary ` +
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
            `${commonButton} ` +
            // Text
            `text-sm ` +
            // Border
            `rounded-small border border-light-6 dark:border-dark-3 ` +
            // Light text on dark background
            `bg-opsis-background-primary text-opsis-content-primary ` +
            // Hover
            `hover:bg-light-2 dark:hover:bg-dark-1 ` +
            // Active (includes when used as open popover trigger)
            `active:bg-light-3 data-[state=open]:bg-light-3 dark:active:bg-dark-4 dark:data-[state=open]:bg-dark-4 ` +
            // Disabled
            `disabled:hover:bg-dark-2 dark:disabled:hover:bg-dark-2 ` +
            // Focus
            `focus:border-neutral dark:focus:border-light focus-visible:outline-none focus-visible:ring-0`,

        TableHeaderCell:
            `${commonButton} ` +
            // Text
            `text-xs font-normal text-neutral-2 dark:text-neutral+5 hover:-text-dark dark:hover:text-light`,
    },

    // Sizes
    sizes: {
        // General Purpose Sizes
        Small: 'h-8 rounded-medium px-3 text-xs',
        Medium: 'h-9 px-4 py-2',
        Large: 'h-10 rounded-medium px-8',

        // Specialized Sizes
        MenuItem: 'pt-1.5 pr-3 pb-1.5 pl-3',
        FormInputCheckbox: 'h-4 w-4',
        FormInputSelect: 'px-4 h-9',
        TableHeaderCell: 'h-8',
    },

    // Configuration
    configuration: {
        // Always applied to every button
        baseClasses: 'inline-flex items-center justify-center gap-2 font-medium transition-colors',

        // Only applied when icon prop is provided (makes button square)
        iconOnlyClasses: 'aspect-square',

        // Focus ring for keyboard navigation
        focusClasses: 'focus-visible:outline-none focus-visible:ring-0',

        // Disabled state styling
        disabledClasses: 'disabled:opacity-75 disabled:cursor-not-allowed',

        // Default props when not specified
        defaultVariant: {
            variant: 'Primary',
            size: 'Medium',
        },
    },
};
