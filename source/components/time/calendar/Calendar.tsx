'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { DayPicker as ReactDayPicker, getDefaultClassNames } from 'react-day-picker';
import { CalendarMonthCaption } from '@structure/source/components/time/calendar/CalendarMonthCaption';
import {
    CalendarProvider,
    CalendarNavigationConfiguration,
} from '@structure/source/components/time/calendar/CalendarContext';

// Dependencies - Theme
import { calendarTheme, CalendarVariant, CalendarSize } from '@structure/source/components/time/calendar/CalendarTheme';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - Calendar
export type CalendarProperties = React.ComponentProps<typeof ReactDayPicker> & {
    variant: CalendarVariant;
    size?: CalendarSize;
    navigationConfiguration?: CalendarNavigationConfiguration;
};
export function Calendar(properties: CalendarProperties) {
    // Extract our custom props from react-day-picker props
    const { variant, size, navigationConfiguration, ...dayPickerProperties } = properties;

    const showOutsideDays =
        dayPickerProperties.showOutsideDays !== undefined ? dayPickerProperties.showOutsideDays : true;

    // Get default class names from react-day-picker (for global.css single-day detection)
    const defaultClassNames = getDefaultClassNames();

    // Get size classes
    const resolvedSize = size ?? calendarTheme.configuration.defaultVariant?.size ?? 'Base';
    const sizeClasses = calendarTheme.sizes[resolvedSize]!;

    // Get variant classes
    const variantClasses = calendarTheme.variantClassNames[variant];

    // Render the component
    return (
        <CalendarProvider navigationConfiguration={navigationConfiguration} size={resolvedSize}>
            <ReactDayPicker
                showOutsideDays={showOutsideDays}
                fixedWeeks={true} // Ensures consistent height by always showing 6 weeks
                hideNavigation={true} // Use our custom navigation caption
                captionLayout="label"
                className={mergeClassNames(sizeClasses.root, dayPickerProperties.className)}
                classNames={{
                    months: mergeClassNames(sizeClasses.months, dayPickerProperties.classNames?.months),
                    month: mergeClassNames(sizeClasses.month, dayPickerProperties.classNames?.month),
                    month_grid: mergeClassNames(sizeClasses.monthGrid, dayPickerProperties.classNames?.month_grid),
                    weekdays: mergeClassNames(sizeClasses.weekdays, dayPickerProperties.classNames?.weekdays),
                    weekday: mergeClassNames(
                        sizeClasses.weekday,
                        variantClasses?.weekday,
                        dayPickerProperties.classNames?.weekday,
                    ),
                    week: mergeClassNames(sizeClasses.week, dayPickerProperties.classNames?.week),
                    cell: mergeClassNames(sizeClasses.cell, dayPickerProperties.classNames?.cell),
                    day: mergeClassNames(sizeClasses.day, dayPickerProperties.classNames?.day),
                    day_button: mergeClassNames(
                        sizeClasses.dayButton,
                        variantClasses?.dayButton,
                        dayPickerProperties.classNames?.day_button,
                    ),
                    range_start: mergeClassNames(
                        defaultClassNames.range_start, // Keep default class for global.css single-day detection
                        sizeClasses.rangeStart,
                        variantClasses?.rangeStart,
                        dayPickerProperties.classNames?.range_start,
                    ),
                    range_end: mergeClassNames(
                        defaultClassNames.range_end, // Keep default class for global.css single-day detection
                        sizeClasses.rangeEnd,
                        variantClasses?.rangeEnd,
                        dayPickerProperties.classNames?.range_end,
                    ),
                    range_middle: mergeClassNames(
                        sizeClasses.rangeMiddle,
                        variantClasses?.rangeMiddle,
                        dayPickerProperties.classNames?.range_middle,
                    ),
                    selected: mergeClassNames(
                        sizeClasses.selected,
                        variantClasses?.selected,
                        dayPickerProperties.classNames?.selected,
                    ),
                    today: mergeClassNames(
                        sizeClasses.today,
                        variantClasses?.today,
                        dayPickerProperties.classNames?.today,
                    ),
                    outside: mergeClassNames(sizeClasses.outside, dayPickerProperties.classNames?.outside),
                    disabled: mergeClassNames(sizeClasses.disabled, dayPickerProperties.classNames?.disabled),
                    hidden: mergeClassNames(sizeClasses.hidden, dayPickerProperties.classNames?.hidden),
                    day_hidden: mergeClassNames(sizeClasses.hidden, dayPickerProperties.classNames?.day_hidden),
                    ...dayPickerProperties.classNames,
                }}
                components={{
                    MonthCaption: CalendarMonthCaption,
                    ...dayPickerProperties.components,
                }}
                {...dayPickerProperties}
            />
        </CalendarProvider>
    );
}
