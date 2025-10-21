'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';

// Dependencies - Assets
import CloseIcon from '@structure/assets/icons/navigation/CloseIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
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
    dismissTimeout?: number | boolean;
}
export const Notice = React.forwardRef<HTMLDivElement, NoticeInterface>(function (properties, reference) {
    // State
    const [hovered, setHovered] = React.useState(false);

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
                'relative box-border flex h-auto touch-none items-center rounded-md border border--a background--a p-7',
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
                className="hover:bg-opsis-background-secondary absolute -top-2 -left-2 inline-flex cursor-pointer items-center justify-center rounded-full border border--a background--a p-1 whitespace-nowrap select-none hover:foreground--a focus-visible:ring-0 focus-visible:outline-none"
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
                <CloseIcon className="text-neutral h-4 w-4" />
            </MotionButton>

            <div className="flex w-full items-center justify-between">
                {/* Title and Content */}
                <div className="items-center space-y-1 pr-4">
                    {properties.title && <div className="text-sm font-medium">{properties.title}</div>}
                    {properties.content && <div className="text-neutral text-sm">{properties.content}</div>}
                </div>

                {/* Button */}
                <Button tabIndex={-1} variant="A" onClick={handleRemoval}>
                    Dismiss
                </Button>
            </div>
        </motion.div>
    );
});

// Set the display name for debugging purposes
Notice.displayName = 'Notice';
