'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Calendar } from '@structure/source/components/time/calendar/Calendar';

// Dependencies - Utilities
import { subDays } from 'date-fns';

// Component - CalendarShowcase
export function CalendarShowcase() {
    const [singleDate, setSingleDate] = React.useState<Date | undefined>(new Date());
    const [dateRange, setDateRange] = React.useState<{ from: Date | undefined; to?: Date }>({
        from: subDays(new Date(), 7),
        to: new Date(),
    });

    return (
        <div className="space-y-8">
            {/* Single Date Selection */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-base font-semibold content--0">Single Date Selection</h3>
                    <p className="mt-1 text-sm content--3">Select a single date from the calendar.</p>
                </div>
                <Calendar
                    mode="single"
                    selected={singleDate}
                    onSelect={setSingleDate}
                    showOutsideDays={true}
                    className="inline-block rounded-lg border border--0 p-4"
                />
                <p className="text-sm content--2">Selected: {singleDate ? singleDate.toLocaleDateString() : 'None'}</p>
            </div>

            {/* Date Range Selection */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-base font-semibold content--0">Date Range Selection</h3>
                    <p className="mt-1 text-sm content--3">Select a range of dates.</p>
                </div>
                <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={function (range) {
                        setDateRange(range || { from: undefined });
                    }}
                    numberOfMonths={2}
                    showOutsideDays={true}
                    className="inline-block rounded-lg border border--0 p-4"
                />
                <p className="text-sm content--2">
                    Selected: {dateRange.from ? dateRange.from.toLocaleDateString() : 'None'} -{' '}
                    {dateRange.to ? dateRange.to.toLocaleDateString() : 'None'}
                </p>
            </div>
        </div>
    );
}
