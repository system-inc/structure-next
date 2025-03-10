'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { ButtonInterface, Button } from '@structure/source/common/buttons/Button';

// Dependencies - Assets
import CloseIcon from '@structure/assets/icons/navigation/CloseIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

// Component - AnimatedButton
const AnimatedButton = animated(Button);

// Component - Notice
export interface NoticeInterface {
    id: string;
    className?: string;
    style?: React.CSSProperties;
    title?: React.ReactNode;
    content?: React.ReactNode;
    closeButtonProperties?: ButtonInterface;
    buttonProperties?: ButtonInterface;
    dismissTimeout?: number | boolean;
}
export const Notice = React.forwardRef<HTMLDivElement, NoticeInterface>(function (properties, reference) {
    // State
    const [hovered, setHovered] = React.useState(true);

    // Springs
    const [noticeSpring, noticeSpringControl] = useSpring(function () {
        return {
            opacity: 1,
            x: 0,
        };
    });
    const buttonSpring = useSpring({
        opacity: hovered ? 1 : 0,
    });

    // Function to handle removal
    const handleRemoval = React.useCallback(
        async function handleRemoval(event: any) {
            if(properties.closeButtonProperties?.onClick) {
                properties.closeButtonProperties.onClick(event);
            }
        },
        [properties.closeButtonProperties],
    );

    // Function to bind the drag
    const bindDrag = useDrag(
        function (state) {
            noticeSpringControl.start({
                x: state.movement[0],
            });
            noticeSpring.opacity.start(1 - Math.abs(state.movement[0]) / 200);

            if(state.movement[0] > 200 || state.movement[0] < -200) {
                if(state._pointerActive === false) {
                    handleRemoval(state.event);
                }
            }
            else {
                if(state._pointerActive === false) {
                    noticeSpringControl.start({
                        x: 0,
                        opacity: 1,
                    });
                }
            }
        },
        {
            axis: 'x',
        },
    );

    // Render the component
    return (
        <animated.div
            ref={reference}
            style={{ ...properties.style, ...noticeSpring }}
            className={mergeClassNames(
                'rounded-medium relative box-border flex h-auto touch-none items-center border bg-light p-7 dark:bg-dark+2',
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
            {...bindDrag()}
        >
            {/* Close Button */}
            <AnimatedButton
                {...properties.closeButtonProperties}
                tabIndex={-1} // Make sure it's -1 to allow programmatic focusing
                variant="unstyled"
                size="unstyled"
                className="absolute -left-2 -top-2 inline-flex select-none items-center justify-center whitespace-nowrap rounded-full border border-light-3 bg-light p-1 hover:bg-light-2 hover:text-dark focus-visible:outline-none focus-visible:ring-0 dark:border-dark-3 dark:bg-dark+2 dark:text-neutral+3 dark:hover:bg-dark-3 dark:hover:text-light"
                style={buttonSpring}
                data-show={hovered}
                onClick={handleRemoval}
            >
                <CloseIcon className="h-4 w-4 text-neutral" />
            </AnimatedButton>

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
        </animated.div>
    );
});

// Set the display name for debugging purposes
Notice.displayName = 'Notice';

// Export - Default
export default Notice;
