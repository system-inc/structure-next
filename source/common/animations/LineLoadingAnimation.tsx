'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Utilities
import useMeasure from 'react-use-measure';
import { config, useSpring, animated } from '@react-spring/web';

// Component - LineLoadingAnimation
export type LineLoadingAnimationProperties = {};
export function LineLoadingAnimation(properties: LineLoadingAnimationProperties) {
    // The percentage of the bar that is filled
    const [progressPercentage, setProgressPercentage] = React.useState(0.5);

    // The width of the bar
    const [domElementReference, { width }] = useMeasure();

    // The spring for animating the bar
    const barSpring = useSpring({
        width: progressPercentage * width,
        config: config.molasses,
    });

    // Update the progress percentage when the width or progress percentage changes
    React.useEffect(() => {
        if(!width) return;
        setTimeout(() => {
            // If the progress percentage is less than 99.5%
            if(progressPercentage < 0.995) {
                // Add a small amount to the progress percentage
                const currentProgress = progressPercentage;
                const unfilledPortion = 1 - currentProgress;
                const percentToAdd = unfilledPortion / 8;

                // Update the progress percentage
                setProgressPercentage(currentProgress + percentToAdd);
            }
        }, 800);
    }, [width, progressPercentage]); // Watch for changes in width and progress percentage

    // Render the component
    return (
        <div className="relative flex h-0.5 w-full items-center justify-center">
            <div ref={domElementReference} className="h-full w-full overflow-hidden bg-light-4/10 dark:bg-light/10">
                <animated.div style={barSpring} className="h-full bg-gradient-to-r from-blue/50 to-blue" />
            </div>
        </div>
    );
}

// Export - Default
export default LineLoadingAnimation;
