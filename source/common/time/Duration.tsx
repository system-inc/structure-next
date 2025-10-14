'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import { millisecondsToDuration } from '@structure/source/utilities/time/Time';

// Component - Duration
export interface DurationProperties {
    children?: React.ReactNode;
    className?: string;
    startTimeInMilliseconds: number;
}
export function Duration(properties: DurationProperties) {
    // State
    const [durationInMilliseconds, setDurationInMilliseconds] = React.useState<number>(0);

    // Effect to update the duration
    React.useEffect(
        function () {
            // Function to update the time since the authentication session started
            const updateDurationInMilliseconds = function () {
                setDurationInMilliseconds(Date.now() - properties.startTimeInMilliseconds);
            };

            // Set an interval to update every second
            const updateDurationInMillisecondsInterval = setInterval(updateDurationInMilliseconds, 1000);

            // Return the cleanup function
            return function () {
                clearInterval(updateDurationInMillisecondsInterval);
            };
        },
        [properties.startTimeInMilliseconds],
    );

    // Render the component
    return (
        <span className={mergeClassNames('', properties.className)}>
            {millisecondsToDuration(durationInMilliseconds)}
            {properties.children}
        </span>
    );
}
