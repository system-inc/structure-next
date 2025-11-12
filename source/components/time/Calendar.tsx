'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { DayPicker as ReactDayPicker } from 'react-day-picker';
import { CalendarEdgeNavigationCaption } from '@structure/source/components/time/CalendarEdgeNavigationCaption';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - Calendar
export type CalendarProperties = React.ComponentProps<typeof ReactDayPicker>;
export function Calendar(properties: CalendarProperties) {
    const showOutsideDays = properties.showOutsideDays !== undefined ? properties.showOutsideDays : true;

    // Render the component
    return (
        <ReactDayPicker
            showOutsideDays={showOutsideDays}
            hideNavigation
            captionLayout="label"
            className={mergeClassNames('p-3', properties.className)}
            classNames={{
                months: mergeClassNames('flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'),
                month: mergeClassNames('space-y-4'),
                table: mergeClassNames('w-full border-collapse space-y-1'),
                weekdays: mergeClassNames('flex'),
                weekday: mergeClassNames('w-8 rounded-md text-[0.8rem] font-normal content--3'),
                week: mergeClassNames('mt-2 flex w-full'),
                cell: mergeClassNames(
                    'relative h-8 w-8 p-0 text-center text-sm focus-within:relative focus-within:z-20',
                ),
                day: mergeClassNames('h-full w-full cursor-pointer p-0'),
                day_button: mergeClassNames(
                    'h-8 w-8 cursor-pointer hover:rounded-md hover:background-content--0 hover:content--10',
                ),
                range_start: mergeClassNames(
                    'rounded-l-md [&_button]:rounded-l-md [&_button]:rounded-r-none [&_button]:hover:rounded-l-md [&_button]:hover:rounded-r-none [&.rdp-range_end]:rounded-md!',
                    '[&_button]:background-content--0! hover:[&_button]:background-content--0!',
                    '[&_button]:content--10!',
                ),
                range_end: mergeClassNames(
                    'rounded-r-md [&_button]:rounded-l-none [&_button]:rounded-r-md [&_button]:hover:rounded-l-none [&_button]:hover:rounded-r-md [&.rdp-range_start]:rounded-md!',
                    '[&_button]:background-content--0! hover:[&_button]:background-content--0!',
                    '[&_button]:content--10!',
                ),
                range_middle: mergeClassNames(
                    '[&_button]:rounded-none! [&_button]:background--5! [&_button]:hover:background-content--0!',
                ),
                selected: mergeClassNames(''),
                today: mergeClassNames(
                    '[&_button]:rounded-md [&_button]:background-content--0! [&_button]:content--10',
                ),
                outside: mergeClassNames(''),
                disabled: mergeClassNames(''),
                hidden: mergeClassNames(''),
                day_hidden: mergeClassNames(''),
                ...properties.classNames,
            }}
            components={{
                MonthCaption: CalendarEdgeNavigationCaption,
                ...properties.components,
            }}
            {...properties}
        />
    );
}
