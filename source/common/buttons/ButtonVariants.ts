// Common button styles: flex container, interaction behavior, and focus styles
const commonButton =
    // Layout and container
    `inline-flex items-center whitespace-nowrap select-none ` +
    // Disabled states
    `disabled:cursor-not-allowed disabled:opacity-75 ` +
    // Animation
    `transition-colors`;

// Centered button styles: alignment, sizing, and shape
const centeredButton =
    // Layout and container
    `justify-center rounded-md ` +
    // Content
    `text-sm font-medium`;

// Focus styles
const focusStyle =
    // Focus
    `focus:border focus:border-light-6 dark:focus:border-light focus-visible:outline-none focus-visible:ring-0`;

// Hover styles: background and text color changes on hover
const hoverStyle =
    // Hover
    `hover:bg-dark-5 dark:hover:bg-dark-3 ` +
    // Disabled
    `disabled:hover:bg-dark-2 dark:disabled:hover:bg-dark-2`;

// Active styles: background color changes when active
const activeStyle = `active:bg-dark-3 dark:active:bg-dark-4`;

// Variants - Button
export const ButtonVariants = {
    // Default variant: standard background and text color
    default:
        `${commonButton} ${focusStyle} ${centeredButton} ` +
        // Dark text on light background
        `border bg-light dark:bg-dark+2 hover:bg-light-1 dark:hover:bg-dark-1 disabled:hover:bg-light ` +
        // Disabled and active states
        `dark:disabled:hover:bg-dark active:bg-light-2 dark:active:bg-dark-2`,
    // Unstyled variant: no styles
    unstyled: ``,
    // Primary variant
    primary:
        `${commonButton} ${focusStyle} ${centeredButton} ` +
        // Light text on dark background
        `text-light bg-theme-light-primary dark:bg-theme-dark-primary ` +
        // Hover
        `hover:bg-theme-light-primary-hover dark:hover:bg-theme-dark-primary-hover ` +
        // Active
        `active:bg-theme-light-primary-active dark:active:bg-theme-dark-primary-active ` +
        // Focus
        `focus:border-transparent dark:focus:border-transparent ` +
        // Disabled
        `disabled:opacity-100 disabled:bg-theme-light-primary-disabled disabled:dark:bg-theme-dark-primary-disabled ` +
        // Border matches background
        `border border-transparent`,
    // Light variant: light background and border with hover and active states
    light:
        `${commonButton} ${focusStyle} ${centeredButton} ` +
        // Dark text on light background
        `border bg-light-1 dark:bg-light-2 text-dark dark:text-dark hover:bg-light dark:hover:bg-light ` +
        // Disabled states
        `disabled:hover:bg-light-1 dark:disabled:hover:bg-light-2 ` +
        // Active states
        `active:bg-light-2 dark:active:bg-light-3`,
    // Contrast variant: constrasted background
    contrast:
        `${commonButton} ${focusStyle} ${centeredButton} ${hoverStyle} ${activeStyle} ` +
        // Light text on dark background
        `text-white dark:text-light-2 bg-dark-2 dark:bg-dark-2 ` +
        // Border matches background
        `border border-dark-2 dark:border-dark-2`,
    // Ghost variant: transparent with accent color on hover
    ghost:
        `${commonButton} ${focusStyle} ${centeredButton} ` +
        // Rounded and hover
        `rounded-md hover:bg-accent border border-transparent hover:text-accent-foreground`,
    ghostDestructive:
        `${commonButton} ${focusStyle} ${centeredButton} ` +
        // Rounded and hover
        `rounded-md hover:bg-accent hover:text-accent-foreground ` +
        // Color, hover, and active states
        `text-neutral+6 hover:bg-red-500/10 hover:text-red-500 dark:text-light-4 dark:hover:text-red-500 active:border-0`,
    // Destructive variant: styles for negative actions like delete or remove
    destructive:
        `${commonButton} ${focusStyle} ${centeredButton} ` +
        // Border
        `border ` +
        // Light
        `text-light bg-red-600 border-red-700 hover:bg-red-500 hover:border-red-600 ` +
        // Dark
        `dark:bg-red-900 dark:border-red-800 dark:hover:bg-red-800 dark:hover:border-red-700 ` +
        // Disabled and active states
        `disabled:hover:bg-light dark:disabled:hover:bg-dark active:bg-light-2 dark:active:bg-dark-2`,
    // Toggle on
    toggleOn:
        `${commonButton} ${centeredButton} ` +
        // Toggled on
        `rounded-md border border-neutral+6 dark:border-dark-6 bg-light-2 dark:bg-dark-2`,
    // Toggle off
    toggleOff:
        `${commonButton} ${centeredButton} ` +
        // Toggled off
        `rounded-md border border-light-6 dark:border-dark-4`,
    // Menu Item variant: styles for menu items
    menuItem:
        `relative flex items-center justify-start font-normal cursor-default rounded-sm ` +
        // Focus states
        `focus-border-none focus-visible:outline-none ` +
        // Highlighted states
        `data-[highlighted=true]:bg-light-2 data-[highlighted=true]:dark:bg-dark-3 ` +
        // Active states
        `data-[highlighted=true]:active:bg-light-3 data-[highlighted=true]:dark:active:bg-dark-4 ` +
        // Disabled states
        `disabled:opacity-50`,
    formInputCheckbox:
        `${commonButton} ` +
        // Layout and sizing
        `flex items-center justify-center content-center ` +
        // Border
        `rounded-sm border border-light-6 dark:border-light ` +
        // Text and background
        `bg-light text-dark dark:bg-dark+2 dark:text-light ` +
        // Hover
        `hover:bg-light-2 dark:hover:bg-dark-3 ` +
        // Active
        `active:bg-light-3 dark:active:bg-light ` +
        // Disabled
        `disabled:hover:bg-dark-2 dark:disabled:hover:bg-dark-2 ` +
        // Checked
        `dark:data-[state=checked]:bg-light dark:data-[state=checked]:text-dark ` +
        // Indeterminate
        `dark:data-[state=indeterminate]:bg-light dark:data-[state=indeterminate]:text-dark ` +
        // Focus
        `focus-visible:outline-none ring-offset-background focus-visible:ring-offset-2 focus-visible:ring focus-visible:ring-1 ring-light`,
    // Form Input Select variant: styles for buttons which trigger a popover menu for selecting an option
    formInputSelect:
        `${commonButton} ` +
        // Text
        `text-sm ` +
        // Layout and sizing
        ` ` +
        // Border
        `rounded-md border border-light-6 dark:border-dark-3 ` +
        // Light text on dark background
        `bg-light text-dark dark:bg-dark+2 dark:text-light ` +
        // Hover
        `hover:bg-light-2 dark:hover:bg-dark-1 ` +
        // Active
        `active:bg-light-3 dark:active:bg-dark-4 ` +
        // Disabled
        `disabled:hover:bg-dark-2 dark:disabled:hover:bg-dark-2 ` +
        // Focus
        `focus:border-neutral dark:focus:border-light focus-visible:outline-none focus-visible:ring-0`,
    tableHeaderCell:
        `${commonButton} ` +
        // Text
        `text-xs font-normal text-neutral-2 dark:text-neutral+5 hover:-text-dark dark:hover:text-light ` +
        // Text and background
        // `hover:bg-light-1 dark:hover:bg-dark-3 disabled:hover:bg-light ` +
        // Disabled and active states
        // `dark:disabled:hover:bg-dark active:bg-light-2 dark:active:bg-dark-2`,
        ``,
};

// Export - Default
export default ButtonVariants;
