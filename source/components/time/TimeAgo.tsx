'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import { timeFromNow } from '@structure/source/utilities/time/Time';

// Component - TimeAgo
export interface TimeAgoProperties {
    className?: string;
    startTimeInMilliseconds: number;
    abbreviated?: boolean;
    abbreviatedOnlyAtMobileSize?: boolean;
}
export function TimeAgo(properties: TimeAgoProperties) {
    // State
    const [renderCount, setRenderCount] = React.useState<number>(0);

    // Effect to update the duration
    React.useEffect(
        function () {
            // Function to update
            const updateTimeAgo = function () {
                setRenderCount(function (previousRenderCount) {
                    return previousRenderCount + 1;
                });
            };

            // Set update every second
            setTimeout(updateTimeAgo, 1000);
        },
        [renderCount],
    );

    // console.log('TimeAgo render count:', renderCount);

    // Render the component
    return (
        <span className={mergeClassNames('', properties.className)}>
            {properties.abbreviatedOnlyAtMobileSize ? (
                <>
                    <span className="sm:hidden">{timeFromNow(properties.startTimeInMilliseconds, true)}</span>
                    <span className="hidden sm:inline">{timeFromNow(properties.startTimeInMilliseconds)}</span>
                </>
            ) : (
                timeFromNow(properties.startTimeInMilliseconds, properties.abbreviated)
            )}
        </span>
    );
}
