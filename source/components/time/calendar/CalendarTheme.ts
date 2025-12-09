/**
 * Structure Calendar Theme
 *
 * Default calendar theme for the structure library. Provides portable, framework-agnostic
 * calendar styling that works out-of-the-box in any project.
 *
 * Projects can override/extend this theme via ProjectSettings.theme.components.Calendar
 */

// Dependencies - Utilities
// Use relative path to avoid Tailwind CSS resolution issues
import { mergeClassNames } from '../../../utilities/style/ClassName';

// Calendar Variants Interface - Source of truth for all calendar variants
// Structure defines its base variants here, and projects can augment to add custom variants
// Example in project code:
//   declare module '@structure/source/components/time/calendar/CalendarTheme' {
//     interface CalendarVariants {
//       CustomVariant: 'CustomVariant';
//     }
//   }
export interface CalendarVariants {
    A: 'A';
}

// Type - Calendar Variant (derived from CalendarVariants interface)
// Automatically includes both structure variants and any project-added variants
export type CalendarVariant = keyof CalendarVariants;

// Calendar Sizes Interface - Source of truth for all calendar sizes
// Structure defines its base sizes here, and projects can augment to add custom sizes
// Example in project code:
//   declare module '@structure/source/components/time/calendar/CalendarTheme' {
//     interface CalendarSizes {
//       Large: 'Large';
//     }
//   }
export interface CalendarSizes {
    Base: 'Base';
}

// Type - Calendar Size (derived from CalendarSizes interface)
// Automatically includes both structure sizes and any project-added sizes
export type CalendarSize = keyof CalendarSizes;

// Type - Calendar Theme Configuration
// Structure must define all variants/sizes it declares in the interfaces above
// Project extensions are optional (Partial)
export interface CalendarThemeConfiguration {
    // Container-level variant classes
    variants: Partial<Record<CalendarVariant, string>>;

    // Sizes control dimensions
    sizes: Partial<Record<CalendarSize, string>>;

    // Base class names for calendar parts (structural/layout only - no colors)
    classNames: {
        // Layout
        root: string;
        months: string;
        month: string;

        // Navigation/Caption
        caption: string;
        captionLabel: string;
        navigationButton: string;
        navigationButtonPrevious: string;
        navigationButtonNext: string;

        // Grid structure
        monthGrid: string;
        weekdays: string;
        weekday: string;
        week: string;

        // Day cells
        cell: string;
        day: string;
        dayButton: string;

        // Selection states
        rangeStart: string;
        rangeEnd: string;
        rangeMiddle: string;
        selected: string;

        // Other states
        today: string;
        outside: string;
        disabled: string;
        hidden: string;
    };

    // Per-part variant classes (colors and visual styling)
    variantClassNames: Partial<
        Record<
            CalendarVariant,
            {
                weekday: string;
                dayButton: string;
                selected: string;
                rangeStart: string;
                rangeEnd: string;
                rangeMiddle: string;
                today: string;
            }
        >
    >;

    configuration: {
        defaultVariant?: {
            variant?: CalendarVariant;
            size?: CalendarSize;
        };
    };
}

// Calendar Theme - Structure Default
export const calendarTheme: CalendarThemeConfiguration = {
    // Base class names for all calendar parts (structural/layout only - no colors or rounding)
    classNames: {
        // Layout
        root: mergeClassNames(''),
        months: mergeClassNames('flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'),
        month: mergeClassNames('space-y-4'),

        // Navigation/Caption
        caption: mergeClassNames('relative flex items-center justify-center pt-1'),
        captionLabel: mergeClassNames('text-sm font-medium'),
        navigationButton: mergeClassNames('absolute h-7 w-7 p-0'),
        navigationButtonPrevious: mergeClassNames('left-1'),
        navigationButtonNext: mergeClassNames('right-1'),

        // Grid
        monthGrid: mergeClassNames('w-full border-collapse space-y-1'),
        weekdays: mergeClassNames('flex'),
        weekday: mergeClassNames('w-8 text-xs font-normal'),
        week: mergeClassNames('mt-2 flex w-full'),

        // Day cells
        cell: mergeClassNames('relative h-8 w-8 p-0 text-center text-sm focus-within:relative focus-within:z-20'),
        day: mergeClassNames('h-full w-full cursor-pointer p-0'),
        dayButton: mergeClassNames('h-8 w-8 cursor-pointer'),

        // Selection states (structural only)
        rangeStart: mergeClassNames(''),
        rangeEnd: mergeClassNames(''),
        rangeMiddle: mergeClassNames(''),
        selected: mergeClassNames(''),

        // Other states
        today: mergeClassNames(''),
        outside: mergeClassNames('invisible'),
        disabled: mergeClassNames(''),
        hidden: mergeClassNames(''),
    },

    // Container-level variant classes
    variants: {
        A: mergeClassNames(''),
    },

    // Per-part variant classes (colors, rounding, and visual styling)
    variantClassNames: {
        A: {
            weekday: mergeClassNames('rounded-md content--3'),
            dayButton: mergeClassNames(
                'hover:rounded-md hover:background--1',
                // Note: Single day range selection handled in global.css
            ),
            selected: mergeClassNames(
                '[&_button]:rounded-md [&_button]:border [&_button]:border--5 [&_button]:background--0! [&_button]:hover:background--0',
            ),
            rangeStart: mergeClassNames(
                // Rounding: left corners rounded, right corners square (including hover)
                '[&_button]:rounded-l-md [&_button]:rounded-r-none',
                '[&_button]:hover:rounded-l-md [&_button]:hover:rounded-r-none',
                // Border: top, bottom, left only (no right border to connect with middle)
                '[&_button]:border-t [&_button]:border-r-0 [&_button]:border-b [&_button]:border-l [&_button]:border--5',
                '[&_button]:background--2! [&_button]:hover:background--2',
                // Single day selection handled via dayButton parent selector
            ),
            rangeEnd: mergeClassNames(
                // Rounding: right corners rounded, left corners square (including hover)
                '[&_button]:rounded-l-none [&_button]:rounded-r-md',
                '[&_button]:hover:rounded-l-none [&_button]:hover:rounded-r-md',
                // Border: top, bottom, right only (no left border to connect with middle)
                '[&_button]:border-t [&_button]:border-r [&_button]:border-b [&_button]:border-l-0 [&_button]:border--5',
                '[&_button]:background--2! [&_button]:hover:background--2',
                // Single day selection handled via dayButton parent selector
            ),
            rangeMiddle: mergeClassNames(
                // No rounding on middle days
                '[&_button]:rounded-none!',
                // Border: top and bottom only (no left/right to create continuous band)
                '[&_button]:border-t [&_button]:border-r-0 [&_button]:border-b [&_button]:border-l-0 [&_button]:border--5',
                '[&_button]:background--0! [&_button]:hover:background--0',
            ),
            today: mergeClassNames('[&_button]:rounded-md [&_button]:background--2 [&_button]:content--0'),
        },
    },

    // Sizes control dimensions
    sizes: {
        Base: mergeClassNames(''),
    },

    // Configuration
    configuration: {
        defaultVariant: {
            variant: 'A',
            size: 'Base',
        },
    },
};
