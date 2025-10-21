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
    `justify-center rounded-sm ` +
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

// Variants - Button
export const ButtonVariants = {
    // Default variant: standard background and text color
    default:
        `${commonButton} ${focusStyle} ${centeredButton} ` +
        // Border
        `border ` +
        // Light
        `background--c border--d text-dark-2 ` +
        // Dark
        `dark:bg-dark-2 dark:text-light-2 ` +
        // Light - Hover
        `hover:bg-light-2 hover:text-dark-1 ` +
        // Dark - Hover
        `dark:hover:bg-dark-3 dark:hover:border-dark-4 dark:hover:text-light-1 ` +
        // Light - Active (includes when used as open popover trigger)
        `active:bg-light-3 data-[state=open]:bg-light-3 active:text-dark data-[state=open]:text-dark ` +
        // Dark - Active (includes when used as open popover trigger)
        `dark:active:bg-dark-4 dark:data-[state=open]:bg-dark-4 dark:active:text-light dark:data-[state=open]:text-light ` +
        // Light - Focus
        `focus:border-neutral+6  ` +
        // Dark - Focus
        `dark:focus:border-neutral-6 ` +
        // Light - Disabled
        `disabled:hover:background--c ` +
        // Dark - Disabled
        `dark:disabled:hover:bg-dark-1`,
    // Unstyled variant: no styles
    unstyled: ``,
    // Primary variant
    primary:
        `${commonButton} ${focusStyle} ${centeredButton} ` +
        // Light text on dark background
        `text-light bg-theme-light-primary dark:bg-theme-dark-primary ` +
        // Hover
        `hover:bg-theme-light-primary-hover dark:hover:bg-theme-dark-primary-hover ` +
        // Active (includes when used as open popover trigger)
        `active:bg-theme-light-primary-active data-[state=open]:bg-theme-light-primary-active dark:active:bg-theme-dark-primary-active dark:data-[state=open]:bg-theme-dark-primary-active ` +
        // Disabled
        `disabled:opacity-100 disabled:bg-theme-light-primary-disabled disabled:dark:bg-theme-dark-primary-disabled`,
    // Light variant: light background and border with hover and active states
    light:
        `${commonButton} ${focusStyle} ${centeredButton} ` +
        // Dark text on light background
        `border background--c dark:bg-light-2 text-dark dark:text-dark hover:bg-light dark:hover:bg-light ` +
        // Disabled states
        `disabled:hover:background--c dark:disabled:hover:bg-light-2 ` +
        // Active states (includes when used as open popover trigger)
        `active:bg-light-2 data-[state=open]:bg-light-2 dark:active:bg-light-3 dark:data-[state=open]:bg-light-3`,
    // Contrast variant: constrasted background
    contrast:
        `${commonButton} ${focusStyle} ${centeredButton} ${hoverStyle} ` +
        // Light text on dark background
        `text-white dark:text-light-2 bg-dark-2 dark:bg-dark-2 ` +
        // Active (includes when used as open popover trigger)
        `active:bg-dark-3 data-[state=open]:bg-dark-3 dark:active:bg-dark-4 dark:data-[state=open]:bg-dark-4 ` +
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
        `content--c hover:bg-red-500/10 hover:text-red-500 dark:text-light-4 dark:hover:text-red-500 active:border-0`,
    // Destructive variant: styles for negative actions like delete or remove
    destructive:
        `${commonButton} ${focusStyle} ${centeredButton} ` +
        // Border
        `border ` +
        // Light
        `background--c border--d text-red-500 ` +
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
        `disabled:hover:background--c disabled:hover:border--d ` +
        // Dark - Disabled
        `dark:disabled:hover:bg-dark-1 dark:disabled:hover:border-dark-3`,
    // Toggle on
    toggleOn:
        `${commonButton} ${centeredButton} ` +
        // Toggled on
        `rounded-md border border-neutral+6 dark:border-dark-6 bg-light-2 dark:bg-dark-2`,
    // Toggle off
    toggleOff:
        `${commonButton} ${centeredButton} ` +
        // Toggled off
        `rounded-md border border--d dark:border-dark-4`,
    // Menu Item variant: styles for menu items
    menuItem:
        `relative flex items-center justify-start font-normal cursor-default rounded-xs ` +
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
        `rounded-sm border border--d dark:border-light ` +
        // Text and background
        `background--a content--a ` +
        // Hover
        `hover:bg-light-2 dark:hover:bg-dark-3 ` +
        // Active (includes when used as open popover trigger)
        `active:bg-light-3 data-[state=open]:bg-light-3 dark:active:bg-light dark:data-[state=open]:bg-light ` +
        // Disabled
        // `disabled:hover:bg-dark-2 dark:disabled:data-[state=checked]:hover:bg-dark-2 ` +
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
        `rounded-sm border border--d ` +
        // Light text on dark background
        `background--a content--a ` +
        // Hover
        `hover:bg-light-2 dark:hover:bg-dark-1 ` +
        // Active (includes when used as open popover trigger)
        `active:bg-light-3 data-[state=open]:bg-light-3 dark:active:bg-dark-4 dark:data-[state=open]:bg-dark-4 ` +
        // Disabled
        `disabled:hover:bg-dark-2 dark:disabled:hover:bg-dark-2 ` +
        // Focus
        `focus:border-neutral dark:focus:border-light focus-visible:outline-none focus-visible:ring-0`,
    tableHeaderCell:
        `${commonButton} ` +
        // Text
        `text-xs font-normal content--c hover:-text-dark dark:hover:text-light ` +
        // Text and background
        // `hover:background--c dark:hover:bg-dark-3 disabled:hover:bg-light ` +
        // Disabled and active states
        // `dark:disabled:hover:bg-dark active:bg-light-2 dark:active:bg-dark-2`,
        ``,
};
