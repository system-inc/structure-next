'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { timeAgo } from '@structure/source/utilities/Time';

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
                    <span className="sm:hidden">{timeAgo(properties.startTimeInMilliseconds, true)}</span>
                    <span className="hidden sm:inline">{timeAgo(properties.startTimeInMilliseconds)}</span>
                </>
            ) : (
                timeAgo(properties.startTimeInMilliseconds, properties.abbreviated)
            )}
        </span>
    );
}

// Export - Default
export default TimeAgo;
