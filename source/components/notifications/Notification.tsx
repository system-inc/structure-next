'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { Notice, type NoticeProperties } from '@structure/source/components/notices/Notice';

// Dependencies - Animation
import { motion, PanInfo } from 'motion/react';

// Dependencies - Assets
import CloseIcon from '@structure/assets/icons/navigation/CloseIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Create motion-enabled Button component
const MotionButton = motion.create(Button);

// Component - Notification
// Wraps Notice component with floating notification behavior (dismissal, drag-to-dismiss, close button)
export interface NotificationInterface extends NoticeProperties {
    id: string;
    closeButtonProperties?: React.ComponentPropsWithoutRef<typeof MotionButton>;
    dismissTimeout?: number | boolean;
}
export const Notification = React.forwardRef<HTMLDivElement, NotificationInterface>(function (properties, reference) {
    // State
    const [hovered, setHovered] = React.useState(false);

    // Function to handle removal
    async function handleRemoval(event: unknown) {
        if(properties.closeButtonProperties?.onClick) {
            properties.closeButtonProperties.onClick(event as React.MouseEvent<HTMLElement, MouseEvent>);
        }
    }

    // Funciton to handle drag event
    async function handleDrag(dragState: DragEvent, { offset }: PanInfo) {
        const dragOffsetForDismissal = 200;
        // Handle drag event - Remove notification if offset by 200px in either x-axis direction.
        if(offset.x > dragOffsetForDismissal || offset.x < -dragOffsetForDismissal) {
            handleRemoval(dragState);
        }
    }

    // Render the component
    return (
        <motion.div
            ref={reference}
            style={{ ...properties.style }}
            drag="x"
            dragSnapToOrigin
            onDragEnd={handleDrag}
            className="relative"
            onMouseEnter={function () {
                setHovered(true);
            }}
            onMouseLeave={function () {
                setHovered(false);
            }}
            onFocusCapture={function () {
                setHovered(true);
            }}
            onBlurCapture={function () {
                setHovered(false);
            }}
        >
            {/* Close Button */}
            <MotionButton
                {...properties.closeButtonProperties}
                className="absolute -top-2 -left-2 z-10 inline-flex cursor-pointer items-center justify-center rounded-full border border--0 background--0 p-1 whitespace-nowrap select-none hover:background--1 hover:content--0 focus-visible:ring-0 focus-visible:outline-none"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: hovered ? 1 : 0,
                }}
                data-show={hovered}
                onClick={handleRemoval}
                transition={{
                    type: 'spring',
                    visualDuration: 0.35,
                    bounce: 0.1,
                }}
            >
                <CloseIcon className="h-4 w-4 content--2" />
            </MotionButton>

            {/* Notice Component */}
            <Notice
                variant={properties.variant}
                size={properties.size}
                presentation={properties.presentation || 'Card'}
                title={properties.title}
                icon={properties.icon}
                iconClassName={properties.iconClassName}
                className={mergeClassNames('touch-none', properties.className)}
            >
                {/* Content */}
                {properties.children}

                {/* Dismiss Button */}
                <div className="mt-4">
                    <Button variant="A" onClick={handleRemoval}>
                        Dismiss
                    </Button>
                </div>
            </Notice>
        </motion.div>
    );
});

// Set the display name for debugging purposes
Notification.displayName = 'Notification';
