'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { TimeAgo } from '@structure/source/components/time/TimeAgo';
import { Duration } from '@structure/source/components/time/Duration';

// Component - TimeUtilitiesShowcase
export function TimeUtilitiesShowcase() {
    // Use lazy initializers to capture time at mount (not during render)
    const [startTime] = React.useState(function () {
        return Date.now() - 1000 * 60 * 5; // 5 minutes ago
    });
    const [durationStart] = React.useState(function () {
        return Date.now() - 1000 * 60 * 2; // 2 minutes ago
    });
    const [timeReferences] = React.useState(function () {
        const now = Date.now();
        return {
            thirtySecondsAgo: now - 1000 * 30,
            oneHourAgo: now - 1000 * 60 * 60,
            oneDayAgo: now - 1000 * 60 * 60 * 24,
            oneWeekAgo: now - 1000 * 60 * 60 * 24 * 7,
        };
    });

    return (
        <div className="space-y-8">
            {/* TimeAgo */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-base font-semibold content--0">TimeAgo Component</h3>
                    <p className="mt-1 text-sm content--3">Displays relative time that updates automatically.</p>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <span className="w-32 text-sm content--2">Full format:</span>
                        <span className="rounded-md border border--0 px-3 py-1.5 text-sm font-medium">
                            <TimeAgo startTimeInMilliseconds={startTime} />
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="w-32 text-sm content--2">Abbreviated:</span>
                        <span className="rounded-md border border--0 px-3 py-1.5 text-sm font-medium">
                            <TimeAgo startTimeInMilliseconds={startTime} abbreviated />
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="w-32 text-sm content--2">Responsive:</span>
                        <span className="rounded-md border border--0 px-3 py-1.5 text-sm font-medium">
                            <TimeAgo startTimeInMilliseconds={startTime} abbreviatedOnlyAtMobileSize />
                        </span>
                        <span className="text-xs content--3">(abbreviated on mobile)</span>
                    </div>
                </div>
            </div>

            {/* Duration */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-base font-semibold content--0">Duration Component</h3>
                    <p className="mt-1 text-sm content--3">Live updating duration counter.</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="w-32 text-sm content--2">Elapsed:</span>
                    <span className="rounded-md border border--0 px-3 py-1.5 font-mono text-sm font-medium">
                        <Duration startTimeInMilliseconds={durationStart} />
                    </span>
                </div>
            </div>

            {/* Various Time References */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-base font-semibold content--0">Various Time References</h3>
                    <p className="mt-1 text-sm content--3">TimeAgo with different starting points.</p>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <span className="w-40 text-sm content--2">30 seconds ago:</span>
                        <span className="rounded-md border border--0 px-3 py-1.5 text-sm font-medium">
                            <TimeAgo startTimeInMilliseconds={timeReferences.thirtySecondsAgo} />
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="w-40 text-sm content--2">1 hour ago:</span>
                        <span className="rounded-md border border--0 px-3 py-1.5 text-sm font-medium">
                            <TimeAgo startTimeInMilliseconds={timeReferences.oneHourAgo} />
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="w-40 text-sm content--2">1 day ago:</span>
                        <span className="rounded-md border border--0 px-3 py-1.5 text-sm font-medium">
                            <TimeAgo startTimeInMilliseconds={timeReferences.oneDayAgo} />
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="w-40 text-sm content--2">1 week ago:</span>
                        <span className="rounded-md border border--0 px-3 py-1.5 text-sm font-medium">
                            <TimeAgo startTimeInMilliseconds={timeReferences.oneWeekAgo} />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
