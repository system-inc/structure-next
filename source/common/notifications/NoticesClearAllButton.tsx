'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { ButtonInterface, Button } from '@structure/source/common/buttons/Button';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { animated, easings, useSpring } from '@react-spring/web';
import { useNotice } from './NoticeProvider';

// Component - AnimatedButton
const AnimatedButton = animated(Button);

// Component - Notice
export interface NoticesClearAllButtonInterface extends ButtonInterface {
    show?: boolean;
    xSpringFunction: (x: number, onRestFunction: () => void) => void;
}
export const NoticesClearAllButton = React.forwardRef<HTMLButtonElement, NoticesClearAllButtonInterface>(
    function (properties, reference) {
        // Hooks
        const { removeAllNotices } = useNotice();

        // Springs
        const buttonSpring = useSpring({
            opacity: properties.show ? 1 : 0,
            height: 28,
            width: 75,
            config: {
                easing: easings.easeOutExpo,
                duration: 500,
            },
        });

        // Function to handle the click
        const handleClick = React.useCallback(
            async function () {
                buttonSpring.opacity.start(0);

                properties.xSpringFunction(200, () => {
                    removeAllNotices();
                });
            },
            [removeAllNotices, properties, buttonSpring],
        );

        // Render the component
        return (
            <AnimatedButton
                ref={reference}
                className={mergeClassNames(
                    'relative overflow-hidden rounded-full p-1 px-2',
                    !properties.show && 'pointer-events-none',
                    properties.className,
                )}
                onClick={handleClick}
                style={buttonSpring}
            >
                <div className={'absolute text-xs font-light'}>Clear All</div>
            </AnimatedButton>
        );
    },
);

// Set the display name for debugging purposes
NoticesClearAllButton.displayName = 'ClearAllNoticesButton';

// Export - Default
export default NoticesClearAllButton;
