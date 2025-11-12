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
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4',
                table: 'w-full border-collapse space-y-1',
                weekdays: 'flex',
                weekday: 'content--3 rounded-md w-8 font-normal text-[0.8rem]',
                week: 'flex w-full mt-2',
                cell: 'relative h-8 w-8 p-0 text-center text-sm focus-within:relative focus-within:z-20',
                day: 'h-full w-full p-0 cursor-pointer',
                day_button: 'h-8 w-8 cursor-pointer font-normal hover:background--5 hover:rounded-md',
                range_start:
                    'rounded-l-md [&_button]:!background-content--0 [&_button]:!content--10 [&_button]:rounded-l-md [&_button]:rounded-r-none hover:[&_button]:!background-content--8 [&_button]:hover:rounded-l-md [&_button]:hover:rounded-r-none [&.rdp-range_end]:!rounded-md',
                range_end:
                    'rounded-r-md [&_button]:!background-content--0 [&_button]:!content--10 [&_button]:rounded-r-md [&_button]:rounded-l-none hover:[&_button]:!background-content--8 [&_button]:hover:rounded-r-md [&_button]:hover:rounded-l-none [&.rdp-range_start]:!rounded-md',
                range_middle:
                    'background--5 [&_button]:!background--5 [&_button]:!content--0 [&_button]:!rounded-none [&_button]:hover:!background--7',
                selected: '',
                today: '[&_button]:background--informative [&_button]:content--0 [&_button]:rounded-md',
                outside: 'content--5 opacity-50',
                disabled: 'content--5 opacity-50',
                hidden: 'invisible',
                day_hidden: 'invisible',
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
