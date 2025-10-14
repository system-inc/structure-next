'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { type MonthCaptionProps as MonthCaptionProperties, useDayPicker } from 'react-day-picker';
import { ButtonVariants } from '@structure/source/common/buttons/ButtonVariants';

// Dependencies - Assets
import ChevronLeftIcon from '@structure/assets/icons/interface/ChevronLeftIcon.svg';
import ChevronRightIcon from '@structure/assets/icons/interface/ChevronRightIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - CalendarEdgeNavigationCaption
export function CalendarEdgeNavigationCaption(properties: MonthCaptionProperties) {
    // Extract properties
    const { calendarMonth, displayIndex, ...divProperties } = properties;

    // Hooks
    const dayPicker = useDayPicker();

    // Determine if the current month is the first or last in the displayed range
    const isFirst = displayIndex === 0;
    const isLast = displayIndex === (dayPicker.months?.length ?? 1) - 1;

    // Render the component
    return (
        <div {...divProperties} className="relative flex items-center justify-center pt-1">
            {/* Left chevron only on the first month */}
            {isFirst && dayPicker.previousMonth && (
                <button
                    type="button"
                    className={mergeClassNames(
                        ButtonVariants['default'],
                        'absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                    )}
                    aria-label={dayPicker.labels?.labelPrevious?.(dayPicker.previousMonth)}
                    onClick={function () {
                        if(dayPicker.previousMonth) {
                            dayPicker.goToMonth(dayPicker.previousMonth);
                        }
                    }}
                >
                    <ChevronLeftIcon className="h-4 w-4" />
                </button>
            )}

            {/* Default caption label content */}
            <span className="text-sm font-medium">
                {calendarMonth.date
                    ? calendarMonth.date.toLocaleString('default', { month: 'long', year: 'numeric' })
                    : ''}
            </span>

            {/* Right chevron only on the last month */}
            {isLast && dayPicker.nextMonth && (
                <button
                    type="button"
                    className={mergeClassNames(
                        ButtonVariants['default'],
                        'absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                    )}
                    aria-label={dayPicker.labels?.labelNext?.(dayPicker.nextMonth)}
                    onClick={function () {
                        if(dayPicker.nextMonth) {
                            dayPicker.goToMonth(dayPicker.nextMonth);
                        }
                    }}
                >
                    <ChevronRightIcon className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
