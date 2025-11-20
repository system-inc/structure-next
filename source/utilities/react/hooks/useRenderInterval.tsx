// Dependencies - React
import React from 'react';

// Hook to trigger re-renders at a specified interval
// Set milliseconds to 0 or pass enabled=false to pause the interval
export function useRenderInterval(milliseconds: number, enabled: boolean = true): number {
    const [tick, setTick] = React.useState(0);

    React.useEffect(
        function () {
            // Don't start interval if disabled or milliseconds is 0
            if(!enabled || milliseconds === 0) {
                return;
            }

            const intervalId = setInterval(function () {
                setTick(function (previous) {
                    return previous + 1;
                });
            }, milliseconds);

            return function () {
                clearInterval(intervalId);
            };
        },
        [milliseconds, enabled],
    );

    return tick;
}
