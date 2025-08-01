'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Animation
import { motion, useAnimationControls } from 'motion/react';

// Dependencies - Utilities
import useMeasure from 'react-use-measure';

// Component - LineLoadingAnimation
export function LineLoadingAnimation() {
    // The percentage of the bar that is filled
    const [progressPercentage, setProgressPercentage] = React.useState(0.5);

    // The width of the bar
    const [domElementReference, { width }] = useMeasure();

    // Animation controls
    const animationControls = useAnimationControls();

    // Update animation when progress or width changes
    React.useEffect(
        function () {
            if (width) {
                animationControls.start({
                    width: progressPercentage * width,
                    transition: {
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1], // easeOutExpo equivalent
                    },
                });
            }
        },
        [progressPercentage, width, animationControls],
    );

    // Update the progress percentage when the width or progress percentage changes
    React.useEffect(
        function effectFunction() {
            if(!width) return;
            setTimeout(function timeoutFunction() {
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
        },
        [width, progressPercentage],
    ); // Watch for changes in width and progress percentage

    // Render the component
    return (
        <div className="relative flex h-0.5 w-full items-center justify-center">
            <div ref={domElementReference} className="h-full w-full overflow-hidden bg-light-4/10 dark:bg-light/10">
                <motion.div 
                    className="h-full bg-gradient-to-r from-blue/50 to-blue"
                    initial={{ width: 0 }}
                    animate={animationControls}
                />
            </div>
        </div>
    );
}
