'use client'; // This component uses client-only features

// Dependencies - Showcase Components
import { CalendarShowcase } from './components/CalendarShowcase';
import { InputDateShowcase } from './components/InputDateShowcase';
import { InputTimeRangeShowcase } from './components/InputTimeRangeShowcase';
import { TimeUtilitiesShowcase } from './components/TimeUtilitiesShowcase';

// Component - OpsDesignTimePage
export function OpsDesignTimePage() {
    return (
        <div className="space-y-16">
            {/* Calendar */}
            <div>
                <h2 className="mb-6 border-b border--0 pb-3 text-lg font-semibold content--0">Calendar</h2>
                <CalendarShowcase />
            </div>

            {/* InputDate */}
            <div>
                <h2 className="mb-6 border-b border--0 pb-3 text-lg font-semibold content--0">InputDate</h2>
                <InputDateShowcase />
            </div>

            {/* InputTimeRange */}
            <div>
                <h2 className="mb-6 border-b border--0 pb-3 text-lg font-semibold content--0">InputTimeRange</h2>
                <InputTimeRangeShowcase />
            </div>

            {/* Time Utilities */}
            <div>
                <h2 className="mb-6 border-b border--0 pb-3 text-lg font-semibold content--0">Time Utilities</h2>
                <TimeUtilitiesShowcase />
            </div>
        </div>
    );
}
