'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { DayPicker as ReactDayPicker } from 'react-day-picker';
import { ButtonVariants } from '@structure/source/common/buttons/ButtonVariants';

// Dependencies - Assets
import ChevronLeftIcon from '@structure/assets/icons/interface/ChevronLeftIcon.svg';
import ChevronRightIcon from '@structure/assets/icons/interface/ChevronRightIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - Calendar
export type CalendarProperties = React.ComponentProps<typeof ReactDayPicker>;
export function Calendar(properties: CalendarProperties) {
    const showOutsideDays = properties.showOutsideDays !== undefined ? properties.showOutsideDays : true;

    // Render the component
    return (
        <ReactDayPicker
            showOutsideDays={showOutsideDays}
            className={mergeClassNames('p-3', properties.className)}
            classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4',
                caption: 'flex justify-center pt-1 relative items-center',
                caption_label: 'text-sm font-medium',
                nav: 'space-x-1 flex items-center',
                nav_button: mergeClassNames(
                    ButtonVariants['default'],
                    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                ),
                nav_button_previous: 'absolute left-1',
                nav_button_next: 'absolute right-1',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex',
                head_cell: 'text-muted-foreground rounded-medium w-8 font-normal text-[0.8rem]',
                row: 'flex w-full mt-2',
                cell: mergeClassNames(
                    'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent h-8 w-8',
                    properties.mode === 'range'
                        ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
                        : '[&:has([aria-selected])]:rounded-medium',
                ),
                day: mergeClassNames(ButtonVariants['ghost'], 'h-8 w-8 p-0 font-normal aria-selected:opacity-100'),
                day_range_start: 'day-range-start border border-primary',
                day_range_end: 'day-range-end border border-primary',
                day_selected:
                    'bg-transparent text-inherit hover:bg-transparent hover:text-inherit focus:bg-transparent focus:text-inherit',
                day_today: 'border border-blue text-accent-foreground',
                day_outside: 'text-muted-foreground opacity-50',
                day_disabled: 'text-muted-foreground opacity-50',
                day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
                day_hidden: 'invisible',
                ...properties.classNames,
            }}
            components={{
                IconLeft: () => <ChevronLeftIcon className="h-4 w-4" />,
                IconRight: () => <ChevronRightIcon className="h-4 w-4" />,
            }}
            {...properties}
        />
    );
}
