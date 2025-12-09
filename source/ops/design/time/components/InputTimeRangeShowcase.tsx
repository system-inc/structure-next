'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { InputTimeRange } from '@structure/source/components/forms/InputTimeRange';

// Dependencies - Utilities
import { subDays, startOfToday, endOfToday, subMonths } from 'date-fns';

// Component - InputTimeRangeShowcase
export function InputTimeRangeShowcase() {
    const [controlledRange, setControlledRange] = React.useState<
        { startTime: Date | undefined; endTime: Date | undefined } | undefined
    >({
        startTime: subDays(startOfToday(), 27),
        endTime: endOfToday(),
    });

    return (
        <div className="space-y-8">
            {/* With Presets */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-base font-semibold content--0">With Time Range Presets</h3>
                    <p className="mt-1 text-sm content--3">Full-featured time range picker with preset options.</p>
                </div>
                <InputTimeRange
                    value={controlledRange}
                    onChange={setControlledRange}
                    showTimeRangePresets={true}
                    rangeFormat="MMM d, yyyy"
                    placeholder="Select time range"
                />
                <p className="text-sm content--2">
                    Range: {controlledRange?.startTime?.toLocaleDateString() || 'None'} -{' '}
                    {controlledRange?.endTime?.toLocaleDateString() || 'None'}
                </p>
            </div>

            {/* Without Presets */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-base font-semibold content--0">Without Presets</h3>
                    <p className="mt-1 text-sm content--3">Simple date range picker without preset sidebar.</p>
                </div>
                <InputTimeRange
                    showTimeRangePresets={false}
                    defaultValue={{
                        startTime: subDays(new Date(), 14),
                        endTime: new Date(),
                    }}
                    rangeFormat="MM/dd/yyyy"
                    placeholder="Pick date range"
                />
            </div>

            {/* Custom Format */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-base font-semibold content--0">Custom Date Format</h3>
                    <p className="mt-1 text-sm content--3">Different date format display.</p>
                </div>
                <InputTimeRange
                    showTimeRangePresets={false}
                    defaultValue={{
                        startTime: subMonths(new Date(), 1),
                        endTime: new Date(),
                    }}
                    rangeFormat="EEE, MMM d"
                    placeholder="Select range"
                />
            </div>

            {/* Disabled State */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-base font-semibold content--0">Disabled State</h3>
                    <p className="mt-1 text-sm content--3">Time range picker in disabled state.</p>
                </div>
                <InputTimeRange
                    defaultValue={{
                        startTime: subDays(new Date(), 7),
                        endTime: new Date(),
                    }}
                    disabled
                    showTimeRangePresets={false}
                />
            </div>
        </div>
    );
}
