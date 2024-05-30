'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { useSpring, animated, easings } from '@react-spring/web';

// Component - LoadingAnimation
export type LoadingAnimationProperties = {
    className?: string;
    loadingText?: string;
};
export function LoadingAnimation(properties: LoadingAnimationProperties) {
    const [reverse, setReverse] = React.useState(false);
    const [currentColorId, setCurrentColorId] = React.useState(0);
    const [rotate, setRotate] = React.useState(0);
    const colors = ['#222222', '#666666', '#999999'];

    // The spring for animating the bar
    const loadingSpring = useSpring({
        // Start with a circle
        from: {
            borderRadius: '100%',
            scale: 0.82,
            backgroundColor: colors[currentColorId],
        },
        // End with a square
        to: {
            borderRadius: reverse ? '100%' : '0%',
            scale: reverse ? 0.82 : 1,
            backgroundColor: colors[currentColorId + 1 >= colors.length ? 0 : currentColorId + 1],
        },
        // Animate the spring
        config: {
            easing: easings.easeInOutQuart,
            duration: 1500,
        },
        // Rotate the circle
        onRest: () => {
            setReverse(!reverse);
            setCurrentColorId(currentColorId + 1 >= colors.length ? 0 : currentColorId + 1);
            setRotate(rotate + 135);
        },
        delay: 800,
    });

    // Render the component
    return (
        <div className={mergeClassNames('flex items-center justify-center', properties.className)}>
            <animated.div className="h-6 w-6 dark:invert" style={loadingSpring} />
            {properties.loadingText && <div className="ml-2.5">{properties.loadingText}</div>}
        </div>
    );
}

// Export - Default
export default LoadingAnimation;
