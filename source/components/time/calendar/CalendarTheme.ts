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

// Common Class Names - Structural/layout only, no sizing or colors
// Layout
export const calendarCommonRootClassNames = '';
export const calendarCommonMonthsClassNames = 'flex flex-col sm:flex-row';
export const calendarCommonMonthClassNames = '';

// Navigation/Caption
export const calendarCommonCaptionClassName = 'relative flex items-center justify-center';
export const calendarCommonCaptionLabelClassName = 'font-medium';
export const calendarCommonNavigationButtonClassNames = 'absolute';
export const calendarCommonNavigationButtonPreviousClassNames = '';
export const calendarCommonNavigationButtonNextClassNames = '';

// Grid
export const calendarCommonMonthGridClassNames = 'w-full border-collapse';
export const calendarCommonWeekdaysClassNames = 'flex';
export const calendarCommonWeekdayClassNames = 'font-normal';
export const calendarCommonWeekClassNames = 'flex w-full';

// Day cells
export const calendarCommonCellClassNames = 'relative text-center focus-within:relative focus-within:z-20';
export const calendarCommonDayClassNames = 'h-full w-full cursor-pointer';
export const calendarCommonDayButtonClassNames = 'cursor-pointer';

// Selection states (structural only)
export const calendarCommonRangeStartClassNames = '';
export const calendarCommonRangeEndClassNames = '';
export const calendarCommonRangeMiddleClassNames = '';
export const calendarCommonSelectedClassNames = '';

// Other states
export const calendarCommonTodayClassNames = '';
export const calendarCommonOutsideClassNames = 'content--6';
export const calendarCommonDisabledClassNames = '';
export const calendarCommonHiddenClassNames = '';

// Type - Calendar Size Configuration (per-part sizing classes)
export interface CalendarSizeConfiguration {
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

    // Grid
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
}

// Type - Calendar Theme Configuration
// Structure must define all variants/sizes it declares in the interfaces above
// Project extensions are optional (Partial)
export interface CalendarThemeConfiguration {
    // Container-level variant classes
    variants: Partial<Record<CalendarVariant, string>>;

    // Sizes control dimensions for each calendar part
    sizes: Partial<Record<CalendarSize, CalendarSizeConfiguration>>;

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

    // Sizes control dimensions for each calendar part
    sizes: {
        Base: {
            // Layout
            root: mergeClassNames(calendarCommonRootClassNames),
            months: mergeClassNames(calendarCommonMonthsClassNames, 'space-y-4 sm:space-y-0 sm:space-x-4'),
            month: mergeClassNames(calendarCommonMonthClassNames, 'space-y-4'),

            // Navigation/Caption
            caption: mergeClassNames(calendarCommonCaptionClassName, 'pt-1'),
            captionLabel: mergeClassNames(calendarCommonCaptionLabelClassName, 'text-sm'),
            navigationButton: mergeClassNames(calendarCommonNavigationButtonClassNames, 'h-7 w-7 p-0'),
            navigationButtonPrevious: mergeClassNames(calendarCommonNavigationButtonPreviousClassNames, 'left-1'),
            navigationButtonNext: mergeClassNames(calendarCommonNavigationButtonNextClassNames, 'right-1'),

            // Grid
            monthGrid: mergeClassNames(calendarCommonMonthGridClassNames, 'space-y-1'),
            weekdays: mergeClassNames(calendarCommonWeekdaysClassNames),
            weekday: mergeClassNames(calendarCommonWeekdayClassNames, 'w-8 text-xs'),
            week: mergeClassNames(calendarCommonWeekClassNames, 'mt-2'),

            // Day cells
            cell: mergeClassNames(calendarCommonCellClassNames, 'h-8 w-8 p-0 text-sm'),
            day: mergeClassNames(calendarCommonDayClassNames, 'p-0'),
            dayButton: mergeClassNames(calendarCommonDayButtonClassNames, 'h-8 w-8'),

            // Selection states
            rangeStart: mergeClassNames(calendarCommonRangeStartClassNames),
            rangeEnd: mergeClassNames(calendarCommonRangeEndClassNames),
            rangeMiddle: mergeClassNames(calendarCommonRangeMiddleClassNames),
            selected: mergeClassNames(calendarCommonSelectedClassNames),

            // Other states
            today: mergeClassNames(calendarCommonTodayClassNames),
            outside: mergeClassNames(calendarCommonOutsideClassNames),
            disabled: mergeClassNames(calendarCommonDisabledClassNames),
            hidden: mergeClassNames(calendarCommonHiddenClassNames),
        },
    },

    // Configuration
    configuration: {
        defaultVariant: {
            size: 'Base',
        },
    },
};
