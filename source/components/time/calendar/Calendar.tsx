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
import { calendarTheme } from '@structure/source/components/time/calendar/CalendarTheme';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - Calendar
export type CalendarProperties = React.ComponentProps<typeof ReactDayPicker> & {
    navigationConfiguration?: CalendarNavigationConfiguration;
};
export function Calendar(properties: CalendarProperties) {
    // Extract our custom props from react-day-picker props
    const { navigationConfiguration, ...dayPickerProperties } = properties;

    const showOutsideDays =
        dayPickerProperties.showOutsideDays !== undefined ? dayPickerProperties.showOutsideDays : true;

    // Get default class names from react-day-picker (for global.css single-day detection)
    const defaultClassNames = getDefaultClassNames();

    // Get variant classes (default to A)
    const variantClasses = calendarTheme.variantClassNames.A;

    // Render the component
    return (
        <CalendarProvider navigationConfiguration={navigationConfiguration}>
            <ReactDayPicker
                showOutsideDays={showOutsideDays}
                fixedWeeks={true} // Ensures consistent height by always showing 6 weeks
                hideNavigation={true} // Use our custom navigation caption
                captionLayout="label"
                className={mergeClassNames(calendarTheme.classNames.root, dayPickerProperties.className)}
                classNames={{
                    months: mergeClassNames(calendarTheme.classNames.months, dayPickerProperties.classNames?.months),
                    month: mergeClassNames(calendarTheme.classNames.month, dayPickerProperties.classNames?.month),
                    month_grid: mergeClassNames(
                        calendarTheme.classNames.monthGrid,
                        dayPickerProperties.classNames?.month_grid,
                    ),
                    weekdays: mergeClassNames(
                        calendarTheme.classNames.weekdays,
                        dayPickerProperties.classNames?.weekdays,
                    ),
                    weekday: mergeClassNames(
                        calendarTheme.classNames.weekday,
                        variantClasses?.weekday,
                        dayPickerProperties.classNames?.weekday,
                    ),
                    week: mergeClassNames(calendarTheme.classNames.week, dayPickerProperties.classNames?.week),
                    cell: mergeClassNames(calendarTheme.classNames.cell, dayPickerProperties.classNames?.cell),
                    day: mergeClassNames(calendarTheme.classNames.day, dayPickerProperties.classNames?.day),
                    day_button: mergeClassNames(
                        calendarTheme.classNames.dayButton,
                        variantClasses?.dayButton,
                        dayPickerProperties.classNames?.day_button,
                    ),
                    range_start: mergeClassNames(
                        defaultClassNames.range_start, // Keep default class for global.css single-day detection
                        calendarTheme.classNames.rangeStart,
                        variantClasses?.rangeStart,
                        dayPickerProperties.classNames?.range_start,
                    ),
                    range_end: mergeClassNames(
                        defaultClassNames.range_end, // Keep default class for global.css single-day detection
                        calendarTheme.classNames.rangeEnd,
                        variantClasses?.rangeEnd,
                        dayPickerProperties.classNames?.range_end,
                    ),
                    range_middle: mergeClassNames(
                        calendarTheme.classNames.rangeMiddle,
                        variantClasses?.rangeMiddle,
                        dayPickerProperties.classNames?.range_middle,
                    ),
                    selected: mergeClassNames(
                        calendarTheme.classNames.selected,
                        variantClasses?.selected,
                        dayPickerProperties.classNames?.selected,
                    ),
                    today: mergeClassNames(
                        calendarTheme.classNames.today,
                        variantClasses?.today,
                        dayPickerProperties.classNames?.today,
                    ),
                    outside: mergeClassNames(calendarTheme.classNames.outside, dayPickerProperties.classNames?.outside),
                    disabled: mergeClassNames(
                        calendarTheme.classNames.disabled,
                        dayPickerProperties.classNames?.disabled,
                    ),
                    hidden: mergeClassNames(calendarTheme.classNames.hidden, dayPickerProperties.classNames?.hidden),
                    day_hidden: mergeClassNames(
                        calendarTheme.classNames.hidden,
                        dayPickerProperties.classNames?.day_hidden,
                    ),
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
