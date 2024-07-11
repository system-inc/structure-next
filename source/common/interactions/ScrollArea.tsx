'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import * as RadixScrollArea from '@radix-ui/react-scroll-area';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { SpringValue, useSpring, animated, SpringConfig, easings } from '@react-spring/web';
import { useDrag, useGesture, useScroll } from '@use-gesture/react';
import { clamp } from '@structure/source/utilities/Number';

// Class Names - Scroll Area
export const scrollAreaContainerClassName = 'h-full overflow-hidden';
export const scrollAreaClassName = 'h-full w-full rounded-[inherit]';
export const scrollAreaScrollbarClassName =
    // Layout
    'flex touch-none select-none px-[4px] py-[2px] ' +
    // Hover - Only show the scrollbar on hover when the thumb is visible
    'hover:bg-neutral+6/30 dark:hover:bg-dark-4/30 ' +
    // Group
    'group ' +
    // Animation - Animate the hover colors
    'duration-500 ease-out transition-colors';
export const scrollAreaVerticalScrollbarClassName = 'w-[14px] pointer-events-auto';
export const scrollAreaHorizontalScrollbarClassName = 'h-[14px] flex-col pointer-events-auto';
export const scrollAreaThumbClassName =
    // Layout
    'relative flex-1 rounded-full before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:translate-x-[50%] before:translate-y-[50%] ' +
    // Colors
    'bg-dark/60 hover:bg-dark/75 dark:bg-neutral-6/60 hover:dark:bg-neutral-6/75 ' +
    // Animation
    'duration-300 ease-out transition-opacity ';
export const scrollAreaCornerClassName = '';

const springConfig: SpringConfig = {
    easing: easings.easeOutExpo,
    duration: 800,
};

// Component - ScrollArea
export interface ScrollAreaInterface {
    children: React.ReactNode;
    className?: string;
    containerClassName?: string;
    scrollbarClassName?: string;
    verticalScrollbarClassName?: string;
    horizontalScrollbarClassName?: string;
    thumbClassName?: string;
    cornerClassName?: string;
    type?: 'auto' | 'always' | 'scroll' | 'hover';
    scrollHideDelay?: number;
    direction?: 'rightToLeft' | 'leftToRight';
    verticalScrollbar?: boolean;
    horizontalScrollbar?: boolean;
}
export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaInterface>(
    function ScrollArea(properties, reference) {
        const scrollAreaMeasureRef = React.useRef<HTMLDivElement>(null);
        const scrollContainerRef = React.useRef<HTMLDivElement>(null);

        // Defaults
        const type = properties.type ?? 'scroll';
        const scrollHideDelay = properties.scrollHideDelay ?? 600;
        const direction =
            properties.direction === 'rightToLeft' ? 'rtl' : properties.direction === 'leftToRight' ? 'ltr' : 'ltr';
        const verticalScrollbar = properties.verticalScrollbar ?? true;
        const horizontalScrollbar = properties.horizontalScrollbar ?? false;

        // return (
        //     <div
        //         ref={reference}
        //         className={mergeClassNames(
        //             scrollAreaContainerClassName,
        //             properties.containerClassName,
        //             verticalScrollbar && !horizontalScrollbar && 'overflow-y-auto overflow-x-clip',
        //             horizontalScrollbar && !verticalScrollbar && 'overflow-x-auto overflow-y-clip',
        //             'custom-scroll h-full',
        //         )}
        //     >
        //         {properties.children}
        //     </div>
        // );

        // Below is a custom implementation of the ScrollArea component more akin to Radix's, but maybe it would be better to use a more minimal one like the one above

        const dragging = React.useRef(false);
        const hovered = React.useRef(false);

        const [thumbSizeHorizontal, setThumbSizeHorizontal] = React.useState<number>(0);
        const [thumbSizeVertical, setThumbSizeVertical] = React.useState<number>(0);
        const [showVerticalScroll, setShowVerticalScroll] = React.useState<boolean>(false);
        const [showHorizontalScroll, setShowHorizontalScroll] = React.useState<boolean>(false);

        const [trackSpring, trackSpringApi] = useSpring(() => ({
            opacity: 0,
            width: 14,
        }));
        const [thumbSpringVertical, thumbSpringVerticalApi] = useSpring(() => ({
            y: 0,
        }));
        const [thumbSpringHorizontal, thumbSpringHorizontalApi] = useSpring(() => ({
            x: 0,
        }));

        React.useEffect(() => {
            if(scrollAreaMeasureRef.current) {
                const scrollAreaRef = scrollAreaMeasureRef.current;

                // Existing ResizeObserver logic for size changes
                const resizeObserver = new ResizeObserver(() => {
                    updateThumbSizes();
                    updateThumbPositions();
                    updateShowScrollBars();
                });
                resizeObserver.observe(scrollAreaRef);

                // New MutationObserver logic for content changes
                const mutationObserver = new MutationObserver(() => {
                    updateThumbSizes();
                    updateThumbPositions();
                    updateShowScrollBars();
                });
                mutationObserver.observe(scrollAreaRef, { childList: true, subtree: true });

                // Function to update thumb sizes
                const updateThumbSizes = () => {
                    if(scrollAreaMeasureRef.current) {
                        const scrollHeight = scrollAreaMeasureRef.current.scrollHeight;
                        const clientHeight = scrollAreaMeasureRef.current.clientHeight;
                        const scrollWidth = scrollAreaMeasureRef.current.scrollWidth;
                        const clientWidth = scrollAreaMeasureRef.current.clientWidth;

                        if(verticalScrollbar) {
                            // Calculate thumb sizes
                            const thumbSizeVertical = Math.max((clientHeight / scrollHeight) * clientHeight, 44);
                            // console.log(thumbSizeVertical);
                            setThumbSizeVertical(thumbSizeVertical);
                        }

                        if(horizontalScrollbar) {
                            // Calculate thumb sizes
                            const thumbSizeHorizontal = Math.max((clientWidth / scrollWidth) * clientWidth, 44);
                            // console.log(thumbSizeHorizontal);
                            setThumbSizeHorizontal(thumbSizeHorizontal);
                        }
                    }
                };

                const updateShowScrollBars = () => {
                    if(scrollAreaMeasureRef.current) {
                        const scrollHeight = scrollAreaMeasureRef.current.scrollHeight;
                        const clientHeight = scrollAreaMeasureRef.current.clientHeight;
                        const scrollWidth = scrollAreaMeasureRef.current.scrollWidth;
                        const clientWidth = scrollAreaMeasureRef.current.clientWidth;

                        const showVertical = scrollHeight > clientHeight;
                        const showHorizontal = scrollWidth > clientWidth;

                        setShowVerticalScroll(showVertical);
                        setShowHorizontalScroll(showHorizontal);
                    }
                };

                const updateThumbPositions = () => {
                    if(scrollAreaMeasureRef.current) {
                        const scrollHeight = scrollAreaMeasureRef.current.scrollHeight;
                        const clientHeight = scrollAreaMeasureRef.current.clientHeight;
                        const scrollWidth = scrollAreaMeasureRef.current.scrollWidth;
                        const clientWidth = scrollAreaMeasureRef.current.clientWidth;

                        if(verticalScrollbar) {
                            const thumbSizeVertical = Math.max((clientHeight / scrollHeight) * clientHeight, 44);
                            const scrollPosition =
                                scrollAreaMeasureRef.current.scrollTop / (scrollHeight - clientHeight);

                            thumbSpringVerticalApi.start({
                                config: springConfig,
                                y: scrollPosition * (clientHeight - thumbSizeVertical),
                                immediate: true,
                            });
                        }

                        if(horizontalScrollbar) {
                            const thumbSizeHorizontal = Math.max((clientWidth / scrollWidth) * clientWidth, 44);
                            const scrollPosition =
                                scrollAreaMeasureRef.current.scrollLeft / (scrollWidth - clientWidth);

                            thumbSpringHorizontalApi.start({
                                config: springConfig,
                                x: scrollPosition * (clientWidth - thumbSizeHorizontal),
                                immediate: true,
                            });
                        }
                    }
                    // console.log('updateThumbPositions');
                };

                // Initial update
                updateThumbSizes();
                updateShowScrollBars();

                // Cleanup function to disconnect observers
                return () => {
                    resizeObserver.disconnect();
                    mutationObserver.disconnect();
                };
            }
        }, [thumbSpringHorizontalApi, thumbSpringVerticalApi, horizontalScrollbar, verticalScrollbar]);

        const bindDrag = useDrag((state) => {
            dragging.current = state.active;

            if(scrollAreaMeasureRef.current) {
                const scrollWidth = scrollAreaMeasureRef.current.scrollWidth;
                const clientWidth = scrollAreaMeasureRef.current.clientWidth;
                const scrollHeight = scrollAreaMeasureRef.current.scrollHeight;
                const clientHeight = scrollAreaMeasureRef.current.clientHeight;

                if(horizontalScrollbar) {
                    const scrollTo =
                        (scrollAreaMeasureRef.current.scrollLeft -
                            state.delta[0] / (clientWidth - thumbSizeHorizontal - 6)) *
                        (scrollWidth - clientWidth);
                    // console.log(scrollTo);
                    scrollAreaMeasureRef.current.scrollLeft = clamp(scrollTo, 0, scrollWidth - clientWidth);
                }

                if(verticalScrollbar) {
                    const scrollTo =
                        scrollAreaMeasureRef.current.scrollTop + state.delta[1] * (scrollHeight / clientHeight);
                    // console.log(scrollTo);
                    scrollAreaMeasureRef.current.scrollTop = clamp(scrollTo, 0, scrollHeight - clientHeight);
                }
            }
        });

        useScroll(
            (state) => {
                const scrollTop = state.xy[1];
                const scrollLeft = state.xy[0];

                if(scrollAreaMeasureRef.current && state.scrolling) {
                    if(horizontalScrollbar) {
                        const scrollWidth = scrollAreaMeasureRef.current.scrollWidth;
                        const clientWidth = scrollAreaMeasureRef.current.clientWidth;
                        const scrollTo =
                            (scrollLeft / (scrollWidth - clientWidth)) * (clientWidth - thumbSizeHorizontal);

                        thumbSpringHorizontalApi.start({
                            x: scrollTo - 4,
                            immediate: true,
                        });
                    }

                    if(verticalScrollbar) {
                        const scrollHeight = scrollAreaMeasureRef.current.scrollHeight;
                        const clientHeight = scrollAreaMeasureRef.current.clientHeight - 3;
                        const scrollTo =
                            (scrollTop / (scrollHeight - clientHeight)) * (clientHeight - thumbSizeVertical);

                        thumbSpringVerticalApi.start({
                            y: scrollTo,
                            immediate: true,
                        });
                    }

                    // Update track spring
                    trackSpringApi.start({
                        config: springConfig,
                        opacity: 1,
                    });
                }
                else if(!dragging.current && !hovered.current) {
                    // Update track spring
                    trackSpringApi.start({
                        config: springConfig,
                        delay: scrollHideDelay,
                        opacity: 0,
                    });
                }
            },
            {
                target: scrollAreaMeasureRef,
            },
        );

        React.useEffect(() => {
            // Set the initial thumb positions
            const updateThumbPositions = () => {
                if(scrollAreaMeasureRef.current) {
                    const scrollHeight = scrollAreaMeasureRef.current.scrollHeight;
                    const clientHeight = scrollAreaMeasureRef.current.clientHeight;
                    const scrollWidth = scrollAreaMeasureRef.current.scrollWidth;
                    const clientWidth = scrollAreaMeasureRef.current.clientWidth;

                    if(verticalScrollbar) {
                        const thumbSizeVertical = Math.max((clientHeight / scrollHeight) * clientHeight, 44);
                        const scrollPosition = scrollAreaMeasureRef.current.scrollTop / (scrollHeight - clientHeight);

                        thumbSpringVerticalApi.start({
                            config: springConfig,
                            y: scrollPosition * (clientHeight - thumbSizeVertical),
                            immediate: true,
                        });
                    }

                    if(horizontalScrollbar) {
                        const thumbSizeHorizontal = Math.max((clientWidth / scrollWidth) * clientWidth, 44);
                        const scrollPosition = scrollAreaMeasureRef.current.scrollLeft / (scrollWidth - clientWidth);

                        thumbSpringHorizontalApi.start({
                            config: springConfig,
                            x: scrollPosition * (clientWidth - thumbSizeHorizontal),
                            immediate: true,
                        });
                    }
                }
                // console.log('updateThumbPositions');
            };
            updateThumbPositions();
        }, [thumbSpringHorizontalApi, thumbSpringVerticalApi, horizontalScrollbar, verticalScrollbar]);

        const bindMouseEvents = useGesture({
            onMouseEnter: () => {
                hovered.current = true;

                // Clear current springs
                trackSpringApi.stop();

                trackSpringApi.start({
                    config: springConfig,
                    opacity: 1,
                    width: 18,
                });
            },
            onMouseLeave: () => {
                hovered.current = false;

                if(!dragging.current) {
                    trackSpringApi.start({
                        config: springConfig,
                        to: async (next) => {
                            await next({ width: 14 });
                            await next({ opacity: 0 });
                        },
                    });
                }
            },
        });

        return (
            <div
                ref={scrollContainerRef}
                className={mergeClassNames(scrollAreaContainerClassName, properties.containerClassName, 'relative')}
            >
                <div
                    ref={mergeRefs(reference, scrollAreaMeasureRef)}
                    className={mergeClassNames(
                        verticalScrollbar && !horizontalScrollbar && 'overflow-y-auto overflow-x-clip',
                        horizontalScrollbar && !verticalScrollbar && 'overflow-x-auto overflow-y-clip',
                        verticalScrollbar && horizontalScrollbar && 'overflow-auto',
                        'h-full w-full',
                    )}
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {properties.children}
                </div>

                {/* Scroll Bar */}
                {verticalScrollbar && showVerticalScroll && (
                    <ScrollBar
                        orientation="vertical"
                        thumbSize={thumbSizeVertical}
                        scrollAnimation={thumbSpringVertical}
                        trackAnimation={trackSpring}
                        trackGestureBinds={bindMouseEvents}
                        {...bindDrag()}
                    />
                )}
                {horizontalScrollbar && showHorizontalScroll && (
                    <ScrollBar
                        orientation="horizontal"
                        thumbSize={thumbSizeHorizontal}
                        scrollAnimation={thumbSpringHorizontal}
                        trackAnimation={trackSpring}
                        trackGestureBinds={bindMouseEvents}
                        {...bindDrag()}
                    />
                )}
            </div>
        );

        // FIXME: Memory leak exists somewhere in here: Likely RadixScrollArea.Thumb (https://github.com/radix-ui/primitives/issues/1973)
        // Render the component
        return (
            <RadixScrollArea.Root
                type={type}
                scrollHideDelay={scrollHideDelay}
                dir={direction}
                className={mergeClassNames(scrollAreaContainerClassName, properties.containerClassName)}
            >
                <RadixScrollArea.Viewport
                    className={mergeClassNames(scrollAreaClassName, properties.className)}
                    ref={reference}
                    // asChild is causing major issues
                    // If it is enabled, the scroll area works but cannot have a height that
                    // fills the parent container
                    // If it is disabled, the scroll area does not work but can have a height that
                    // fills the parent container
                    // Adding height:100% to the div fixes things, but the viewport component is
                    // adding a div that I can't control here
                    // asChild
                >
                    {properties.children}
                </RadixScrollArea.Viewport>
                {verticalScrollbar && (
                    <RadixScrollArea.Scrollbar
                        forceMount={true}
                        orientation="vertical"
                        className={mergeClassNames(
                            scrollAreaVerticalScrollbarClassName,
                            properties.verticalScrollbarClassName,
                            scrollAreaScrollbarClassName,
                            properties.scrollbarClassName,
                        )}
                    >
                        <RadixScrollArea.Thumb
                            className={mergeClassNames(scrollAreaThumbClassName, properties.thumbClassName)}
                        />
                    </RadixScrollArea.Scrollbar>
                )}
                {horizontalScrollbar && (
                    <RadixScrollArea.Scrollbar
                        forceMount={true}
                        orientation="horizontal"
                        className={mergeClassNames(
                            scrollAreaHorizontalScrollbarClassName,
                            properties.horizontalScrollbarClassName,
                            scrollAreaScrollbarClassName,
                            properties.scrollbarClassName,
                        )}
                    >
                        <RadixScrollArea.Thumb
                            className={mergeClassNames(scrollAreaThumbClassName, properties.thumbClassName)}
                        />
                    </RadixScrollArea.Scrollbar>
                )}
                <RadixScrollArea.Corner
                    className={mergeClassNames(scrollAreaCornerClassName, properties.cornerClassName)}
                />
            </RadixScrollArea.Root>
        );
    },
);

// Set displayName for debugging purposes
ScrollArea.displayName = 'ScrollArea';

// Export - Default
export default ScrollArea;

/**
 * TEMPORARY Components
 */

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]): (instance: T | null) => void {
    return (element: T | null) => {
        refs.forEach((ref) => {
            if(typeof ref === 'function') {
                ref(element);
            }
            else if(ref) {
                (ref as React.MutableRefObject<T | null>).current = element;
            }
        });
    };
}

function ScrollBar({
    orientation,
    thumbSize,
    scrollAnimation,
    trackAnimation,
    trackGestureBinds,
    ...properties
}: {
    orientation: 'vertical' | 'horizontal';
    thumbSize: number;
    scrollAnimation: {
        x?: SpringValue<number>;
        y?: SpringValue<number>;
    };
    trackAnimation: {
        opacity: SpringValue<number>;
        width: SpringValue<number>;
    };
    trackGestureBinds?: ReturnType<typeof useGesture>;
} & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <animated.div
            className={mergeClassNames(
                scrollAreaScrollbarClassName,
                orientation === 'vertical'
                    ? scrollAreaVerticalScrollbarClassName
                    : scrollAreaHorizontalScrollbarClassName,
                'absolute',
                orientation === 'vertical' ? 'inset-y-0 right-0' : 'inset-x-0 bottom-0',
            )}
            style={trackAnimation}
            {...trackGestureBinds()}
        >
            <animated.div
                className={mergeClassNames(scrollAreaThumbClassName, 'touch-none')}
                style={{
                    ...scrollAnimation,
                    [orientation === 'vertical' ? 'height' : 'width']: thumbSize,
                }}
                {...properties}
            />
        </animated.div>
    );
}
