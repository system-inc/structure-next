'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { InputDate } from '@structure/source/components/forms/InputDate';

// Dependencies - Utilities
import { addDays } from 'date-fns';

// Component - InputDateShowcase
export function InputDateShowcase() {
    const [controlledDate, setControlledDate] = React.useState<Date | undefined>(new Date());
    const [uncontrolledResult, setUncontrolledResult] = React.useState<string>('');

    // Calculate suffix text for date display
    const suffixText = React.useMemo(
        function () {
            if(!controlledDate) return undefined;
            const diffDays = Math.abs(
                Math.round((controlledDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
            );
            const direction = controlledDate > new Date() ? 'from now' : 'ago';
            return `(${diffDays} days ${direction})`;
        },
        [controlledDate],
    );

    return (
        <div className="space-y-8">
            {/* Controlled Mode */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-base font-semibold content--0">Controlled Mode</h3>
                    <p className="mt-1 text-sm content--3">Date picker with controlled value prop.</p>
                </div>
                <InputDate
                    value={controlledDate}
                    onChange={setControlledDate}
                    dateFormat="EEEE, MMMM d, yyyy"
                    placeholder="Select a date"
                />
                <p className="text-sm content--2">
                    Value: {controlledDate ? controlledDate.toLocaleDateString() : 'None'}
                </p>
            </div>

            {/* Uncontrolled Mode */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-base font-semibold content--0">Uncontrolled Mode</h3>
                    <p className="mt-1 text-sm content--3">Date picker with defaultValue and onChange callback.</p>
                </div>
                <InputDate
                    defaultValue={addDays(new Date(), 7)}
                    onChange={function (date) {
                        setUncontrolledResult(date ? date.toLocaleDateString() : 'None');
                    }}
                    dateFormat="MMM d, yyyy"
                    placeholder="Pick a date"
                />
                <p className="text-sm content--2">Last onChange: {uncontrolledResult || 'Not changed yet'}</p>
            </div>

            {/* With Suffix Text */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-base font-semibold content--0">With Suffix Text</h3>
                    <p className="mt-1 text-sm content--3">Date picker showing additional context after the date.</p>
                </div>
                <InputDate
                    value={controlledDate}
                    onChange={setControlledDate}
                    dateFormat="EEEE, MMMM d, yyyy"
                    suffixText={suffixText}
                />
            </div>

            {/* Disabled State */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-base font-semibold content--0">Disabled State</h3>
                    <p className="mt-1 text-sm content--3">Date picker in disabled state.</p>
                </div>
                <InputDate defaultValue={new Date()} disabled placeholder="Cannot select" />
            </div>

            {/* With Calendar Restrictions */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-base font-semibold content--0">Future Dates Only</h3>
                    <p className="mt-1 text-sm content--3">Calendar with past dates disabled.</p>
                </div>
                <InputDate
                    placeholder="Select future date"
                    calendarProperties={{
                        disabled: function (date) {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                        },
                    }}
                />
            </div>

            {/* Keep Open on Select */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-base font-semibold content--0">Keep Open on Select</h3>
                    <p className="mt-1 text-sm content--3">Calendar stays open after selection.</p>
                </div>
                <InputDate placeholder="Select multiple times" closeOnSelect={false} dateFormat="PP" />
            </div>
        </div>
    );
}
