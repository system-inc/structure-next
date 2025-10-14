'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { ButtonProperties, Button } from '@structure/source/common/buttons/Button';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import { cubicBezier, motion } from 'motion/react';
import { useNotice } from './NoticeProvider';

// Component - AnimatedButton
const MotionButton = motion.create(Button);

// Component - Notice
export interface NoticesClearAllButtonProperties extends ButtonProperties {
    show?: boolean;
    xSpringFunction: (x: number, onRestFunction: () => void) => void;
}
export const NoticesClearAllButton = React.forwardRef<HTMLButtonElement, NoticesClearAllButtonProperties>(
    function (properties, reference) {
        // Hooks
        const notice = useNotice();

        // Render the component
        return (
            <MotionButton
                layout
                ref={reference}
                className={mergeClassNames(
                    'relative overflow-hidden rounded-full p-1 px-2',
                    !properties.show && 'pointer-events-none',
                    properties.className,
                )}
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: properties.show ? 1 : 0,
                }}
                transition={{
                    ease: cubicBezier(0.075, 0.82, 0.165, 1),
                    duration: 0.5,
                    type: 'tween',
                }}
                onClick={() => notice.removeAllNotices()}
                style={{
                    height: 28,
                    width: 75,
                }}
            >
                <div className={'absolute text-xs font-light'}>Clear All</div>
            </MotionButton>
        );
    },
);

// Set the display name for debugging purposes
NoticesClearAllButton.displayName = 'ClearAllNoticesButton';
