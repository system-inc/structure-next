'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { type MonthCaptionProps as MonthCaptionProperties, useDayPicker } from 'react-day-picker';
import { Button } from '@structure/source/components/buttons/Button';
import {
    InputSelect,
    InputSelectItemProperties,
} from '@structure/source/components/forms-new/fields/select/InputSelect';

// Dependencies - Theme
import { calendarTheme } from '@structure/source/components/time/calendar/CalendarTheme';

// Dependencies - Context
import { useCalendarContext } from '@structure/source/components/time/calendar/CalendarContext';

// Dependencies - Assets
import ChevronLeftIcon from '@structure/assets/icons/interface/ChevronLeftIcon.svg';
import ChevronRightIcon from '@structure/assets/icons/interface/ChevronRightIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import { monthNames } from '@structure/source/utilities/time/Time';

// Component - CalendarMonthCaption
export function CalendarMonthCaption(properties: MonthCaptionProperties) {
    // Extract properties
    const { calendarMonth, displayIndex, ...divProperties } = properties;

    // Hooks
    const dayPicker = useDayPicker();
    const calendarContext = useCalendarContext();

    // Determine if the current month is the first or last in the displayed range
    const isFirst = displayIndex === 0;
    const isLast = displayIndex === (dayPicker.months?.length ?? 1) - 1;

    // Get current month and year from the calendar
    const currentMonth = calendarMonth.date ? calendarMonth.date.getMonth() : 0;
    const currentYear = calendarMonth.date ? calendarMonth.date.getFullYear() : new Date().getFullYear();

    // Generate month select items
    const monthItems: InputSelectItemProperties[] = monthNames.map(function (monthName, index) {
        return {
            value: index.toString(),
            children: monthName,
        };
    });

    // Generate year select items (defaults are guaranteed by CalendarProvider)
    // Expand range to include the currently displayed year if it's outside the configured range
    const minimumYear = Math.min(calendarContext.minimumYear!, currentYear);
    const maximumYear = Math.max(calendarContext.maximumYear!, currentYear);
    const yearItems: InputSelectItemProperties[] = [];
    for(let year = maximumYear; year >= minimumYear; year--) {
        yearItems.push({
            value: year.toString(),
            children: year.toString(),
        });
    }

    // Function to handle month selection
    function handleMonthChange(value: string | undefined) {
        if(value !== undefined) {
            const newMonth = parseInt(value, 10);
            const newDate = new Date(currentYear, newMonth, 1);
            dayPicker.goToMonth(newDate);
        }
    }

    // Function to handle year selection
    function handleYearChange(value: string | undefined) {
        if(value !== undefined) {
            const newYear = parseInt(value, 10);
            const newDate = new Date(newYear, currentMonth, 1);
            dayPicker.goToMonth(newDate);
        }
    }

    // Render the component
    return (
        <div {...divProperties} className={mergeClassNames(calendarTheme.classNames.caption, properties.className)}>
            {/* Left chevron only on the first month */}
            {isFirst && dayPicker.previousMonth && (
                <Button
                    variant="Outline"
                    className={mergeClassNames(
                        calendarTheme.classNames.navigationButton,
                        calendarTheme.classNames.navigationButtonPrevious,
                    )}
                    icon={ChevronLeftIcon}
                    aria-label={dayPicker.labels?.labelPrevious?.(dayPicker.previousMonth)}
                    onClick={function () {
                        if(dayPicker.previousMonth) {
                            dayPicker.goToMonth(dayPicker.previousMonth);
                        }
                    }}
                />
            )}

            {/* Caption label with optional dropdowns */}
            <span className={mergeClassNames(calendarTheme.classNames.captionLabel, 'flex items-center')}>
                {/* Month - either dropdown or plain text */}
                {calendarContext.showMonthDropdown ? (
                    <InputSelect
                        key={currentMonth}
                        triggerButtonVariant="Ghost"
                        className="gap-0 px-1.5 py-1 [&_div.grow]:hidden [&_svg]:ml-0 [&_svg]:hidden"
                        defaultValue={currentMonth.toString()}
                        items={monthItems}
                        onChange={handleMonthChange}
                    />
                ) : (
                    <span>{monthNames[currentMonth]}</span>
                )}

                {/* Year - either dropdown or plain text */}
                {calendarContext.showYearDropdown ? (
                    <InputSelect
                        key={currentYear}
                        triggerButtonVariant="Ghost"
                        className="gap-0 px-1.5 py-1 [&_div.grow]:hidden [&_svg]:ml-0 [&_svg]:hidden"
                        defaultValue={currentYear.toString()}
                        items={yearItems}
                        onChange={handleYearChange}
                    />
                ) : (
                    <span>{currentYear}</span>
                )}
            </span>

            {/* Right chevron only on the last month */}
            {isLast && dayPicker.nextMonth && (
                <Button
                    variant="Outline"
                    className={mergeClassNames(
                        calendarTheme.classNames.navigationButton,
                        calendarTheme.classNames.navigationButtonNext,
                    )}
                    icon={ChevronRightIcon}
                    aria-label={dayPicker.labels?.labelNext?.(dayPicker.nextMonth)}
                    onClick={function () {
                        if(dayPicker.nextMonth) {
                            dayPicker.goToMonth(dayPicker.nextMonth);
                        }
                    }}
                />
            )}
        </div>
    );
}
