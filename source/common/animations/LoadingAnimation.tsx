'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Animation
import { motion, useAnimationControls } from 'motion/react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - LoadingAnimation
export type LoadingAnimationProperties = {
    className?: string;
    loadingText?: string;
};
export function LoadingAnimation(properties: LoadingAnimationProperties) {
    const [reverse, setReverse] = React.useState(false);
    const [currentColorId, setCurrentColorId] = React.useState(0);
    const [rotate, setRotate] = React.useState(0);
    const colors = React.useMemo(function () {
        return ['#222222', '#666666', '#999999'];
    }, []);
    const animationControls = useAnimationControls();

    // Effect to trigger animations
    React.useEffect(
        function () {
            animationControls
                .start({
                    borderRadius: reverse ? '100%' : '0%',
                    scale: reverse ? 0.82 : 1,
                    backgroundColor: colors[currentColorId + 1 >= colors.length ? 0 : currentColorId + 1],
                    rotate: rotate,
                    transition: {
                        duration: 1.5,
                        ease: 'easeInOut',
                        delay: 0.8,
                    },
                })
                .then(function () {
                    setReverse(!reverse);
                    setCurrentColorId(currentColorId + 1 >= colors.length ? 0 : currentColorId + 1);
                    setRotate(rotate + 135);
                });
        },
        [reverse, currentColorId, rotate, animationControls, colors],
    );

    // Render the component
    return (
        <div className={mergeClassNames('flex items-center justify-center', properties.className)}>
            <motion.div
                className="h-6 w-6 dark:invert"
                initial={{
                    borderRadius: '100%',
                    scale: 0.82,
                    backgroundColor: colors[0],
                    rotate: 0,
                }}
                animate={animationControls}
            />
            {properties.loadingText && <div className="ml-2.5">{properties.loadingText}</div>}
        </div>
    );
}
