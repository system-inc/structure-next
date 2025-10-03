'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { ButtonProperties, Button } from '@structure/source/common/buttons/Button';

// Dependencies - Assets
import CloseIcon from '@structure/assets/icons/navigation/CloseIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { motion, PanInfo } from 'motion/react';

const MotionButton = motion.create(Button);

// Component - Notice
export interface NoticeInterface {
    id: string;
    className?: string;
    style?: React.CSSProperties;
    title?: React.ReactNode;
    content?: React.ReactNode;
    closeButtonProperties?: React.ComponentPropsWithoutRef<typeof MotionButton>;
    buttonProperties?: ButtonProperties;
    dismissTimeout?: number | boolean;
}
export const Notice = React.forwardRef<HTMLDivElement, NoticeInterface>(function (properties, reference) {
    // State
    const [hovered, setHovered] = React.useState(true);

    // Function to handle removal
    async function handleRemoval(event: unknown) {
        if(properties.closeButtonProperties?.onClick) {
            properties.closeButtonProperties.onClick(event as React.MouseEvent<HTMLElement, MouseEvent>);
        }
    }

    async function handleDrag(dragState: DragEvent, { offset }: PanInfo) {
        const DRAG_OFFSET_FOR_DISMISSAL = 200;
        // Handle drag event -- Remove notice if offset by 200px in either x-axis direction.
        if(offset.x > DRAG_OFFSET_FOR_DISMISSAL || offset.x < -DRAG_OFFSET_FOR_DISMISSAL) {
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
                'relative box-border flex h-auto touch-none items-center rounded-medium border bg-light p-7 dark:bg-dark+2',
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
                tabIndex={-1} // Make sure it's -1 to allow programmatic focusing
                variant="unstyled"
                size="unstyled"
                className="absolute -left-2 -top-2 inline-flex select-none items-center justify-center whitespace-nowrap rounded-full border border-light-3 bg-light p-1 hover:bg-light-2 hover:text-dark focus-visible:outline-none focus-visible:ring-0 dark:border-dark-3 dark:bg-dark+2 dark:text-neutral+3 dark:hover:bg-dark-3 dark:hover:text-light"
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
                <CloseIcon className="h-4 w-4 text-neutral" />
            </MotionButton>

            <div className="flex w-full items-center justify-between">
                {/* Title and Content */}
                <div className="items-center space-y-1 pr-4">
                    {properties.title && <div className="text-sm font-medium">{properties.title}</div>}
                    {properties.content && <div className="text-sm text-neutral">{properties.content}</div>}
                </div>

                {/* Button */}
                <Button
                    {...properties.buttonProperties} // Spread DOM properties
                    tabIndex={-1} // Make sure it's -1 to allow programmatic focusing
                    onClick={handleRemoval}
                >
                    {properties?.buttonProperties?.children ? properties.buttonProperties.children : 'Dismiss'}
                </Button>
            </div>
        </motion.div>
    );
});

// Set the display name for debugging purposes
Notice.displayName = 'Notice';
