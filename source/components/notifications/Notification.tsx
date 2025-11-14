'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';

// Dependencies - Animation
import { motion, PanInfo } from 'motion/react';

// Dependencies - Assets
import CloseIcon from '@structure/assets/icons/navigation/CloseIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Create motion-enabled Button component
const MotionButton = motion.create(Button);

// Component - Notification
export interface NotificationInterface {
    id: string;
    className?: string;
    style?: React.CSSProperties;
    title?: React.ReactNode;
    content?: React.ReactNode;
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
            className={mergeClassNames(
                'relative box-border flex h-auto touch-none items-center rounded-md border border--0 background--0 p-7',
                properties.className,
            )}
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
                className="absolute -top-2 -left-2 inline-flex cursor-pointer items-center justify-center rounded-full border border--0 background--0 p-1 whitespace-nowrap select-none hover:background--1 hover:content--0 focus-visible:ring-0 focus-visible:outline-none"
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

            <div className="flex w-full items-center justify-between">
                {/* Title and Content */}
                <div className="items-center space-y-1 pr-4">
                    {properties.title && <div className="text-sm font-medium">{properties.title}</div>}
                    {properties.content && <div className="text-sm content--2">{properties.content}</div>}
                </div>

                {/* Button */}
                <Button variant="A" onClick={handleRemoval}>
                    Dismiss
                </Button>
            </div>
        </motion.div>
    );
});

// Set the display name for debugging purposes
Notification.displayName = 'Notification';
