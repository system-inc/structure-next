'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useNotifications } from './NotificationsProvider';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';

// Dependencies - Animation
import { cubicBezier, motion } from 'motion/react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - AnimatedButton
const MotionButton = motion.create(Button);

// Component - NotificationsClearAllButton
export interface NotificationsClearAllButtonProperties {
    className?: string;
    show?: boolean;
    xSpringFunction: (x: number, onRestFunction: () => void) => void;
}
export const NotificationsClearAllButton = React.forwardRef<HTMLButtonElement, NotificationsClearAllButtonProperties>(
    function (properties, reference) {
        // Hooks
        const notifications = useNotifications();

        // Render the component
        return (
            <MotionButton
                ref={reference}
                layout
                variant="A"
                className={mergeClassNames(!properties.show && 'pointer-events-none', properties.className)}
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
                onClick={() => notifications.removeAllNotifications()}
            >
                Clear All
            </MotionButton>
        );
    },
);

// Set the display name on the component for debugging
NotificationsClearAllButton.displayName = 'NotificationsClearAllButton';
