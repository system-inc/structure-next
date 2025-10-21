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
                weekday: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
                week: 'flex w-full mt-2',
                cell: 'relative h-8 w-8 p-0 text-center text-sm focus-within:relative focus-within:z-20',
                day: 'h-full w-full p-0 cursor-pointer',
                day_button: 'h-8 w-8 cursor-pointer font-normal hover:background--b hover:rounded-md',
                range_start:
                    'background--b rounded-l-md [&_button]:!bg-opsis-action-primary [&_button]:!text-opsis-action-general-light [&_button]:rounded-l-md [&_button]:rounded-r-none [&_button]:hover:!bg-opsis-action-primary [&_button]:hover:rounded-l-md [&_button]:hover:rounded-r-none [&.rdp-range_end]:!rounded-md',
                range_end:
                    'background--b rounded-r-md [&_button]:!bg-opsis-action-primary [&_button]:!text-opsis-action-general-light [&_button]:rounded-r-md [&_button]:rounded-l-none [&_button]:hover:!bg-opsis-action-primary [&_button]:hover:rounded-r-md [&_button]:hover:rounded-l-none [&.rdp-range_start]:!rounded-md',
                range_middle:
                    'background--b [&_button]:!background--b [&_button]:!foreground--a [&_button]:!rounded-none [&_button]:hover:!background--b',
                selected: '',
                today: '[&_button]:background--b [&_button]:foreground--a [&_button]:rounded-md',
                outside: 'text-opsis-content-placeholder opacity-50',
                disabled: 'text-opsis-content-placeholder opacity-50',
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
