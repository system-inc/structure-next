'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import * as RadixScrollArea from '@radix-ui/react-scroll-area';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { SpringValue, useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';

// Class Names - Scroll Area
export const scrollAreaContainerClassName = 'h-full overflow-hidden';
export const scrollAreaClassName = 'h-full w-full rounded-[inherit]';
export const scrollAreaScrollbarClassName =
    // Layout
    'flex touch-none select-none px-[4px] py-[2px] ' +
    // Hover - Only show the scrollbar on hover when the thumb is visible
    'data-[state=visible]:hover:bg-neutral+6/30 data-[state=visible]:dark:hover:bg-dark-4/30 ' +
    // Group
    'group ' +
    // Animation - Animate the hover colors
    'duration-500 ease-out transition-colors';
export const scrollAreaVerticalScrollbarClassName =
    'w-[14px] data-[state=hidden]:pointer-events-none data-[state=visible]:pointer-events-auto';
export const scrollAreaHorizontalScrollbarClassName =
    'h-[14px] flex-col data-[state=hidden]:pointer-events-none data-[state=visible]:pointer-events-auto';
export const scrollAreaThumbClassName =
    // Layout
    'relative flex-1 rounded before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:translate-x-[50%] before:translate-y-[50%] ' +
    // Colors
    'bg-dark/60 hover:bg-dark/75 dark:bg-neutral-6/60 hover:dark:bg-neutral-6/75 ' +
    // Animation
    'duration-300 ease-out transition-opacity ' +
    // Animate in when the group is visible
    'group-data-[state=visible]:opacity-100 ' +
    // Animate out when the group is hidden
    'group-data-[state=hidden]:opacity-0';
export const scrollAreaCornerClassName = '';

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
export const ScrollArea = React.forwardRef(function ScrollArea(
    properties: ScrollAreaInterface,
    reference: React.Ref<HTMLDivElement>,
) {
    const scrollAreaMeasureRef = React.useRef<HTMLDivElement>(null);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    // Defaults
    const type = properties.type ?? 'scroll';
    const scrollHideDelay = properties.scrollHideDelay ?? 600;
    const direction =
        properties.direction === 'rightToLeft' ? 'rtl' : properties.direction === 'leftToRight' ? 'ltr' : 'ltr';
    const verticalScrollbar = properties.verticalScrollbar ?? true;
    const horizontalScrollbar = properties.horizontalScrollbar ?? false;

    return (
        <div
            ref={reference}
            className={mergeClassNames(
                scrollAreaContainerClassName,
                properties.containerClassName,
                verticalScrollbar && !horizontalScrollbar && 'overflow-y-auto overflow-x-clip',
                horizontalScrollbar && !verticalScrollbar && 'overflow-x-auto overflow-y-clip',
                'custom-scroll h-full',
            )}
        >
            {properties.children}
        </div>
    );

    // Below is a custom implementation of the ScrollArea component more akin to Radix's, but maybe it would be better to use a more minimal one like the one above

    const [thumbSpringVertical, thumbSpringVerticalApi] = useSpring(() => ({
        y: 0,
    }));
    const [thumbSpringHorizontal, thumbSpringHorizontalApi] = useSpring(() => ({
        x: 0,
    }));

    const [thumbSizeHorizontal, setThumbSizeHorizontal] = React.useState<number>(0);
    const [thumbSizeVertical, setThumbSizeVertical] = React.useState<number>(0);

    React.useEffect(() => {
        if(scrollAreaMeasureRef.current) {
            // Existing ResizeObserver logic for size changes
            const resizeObserver = new ResizeObserver(() => {
                updateThumbSizes();
            });
            resizeObserver.observe(scrollAreaMeasureRef.current);

            // New MutationObserver logic for content changes
            const mutationObserver = new MutationObserver(() => {
                updateThumbSizes();
            });
            mutationObserver.observe(scrollAreaMeasureRef.current, { childList: true, subtree: true });

            // Function to update thumb sizes
            const updateThumbSizes = () => {
                if(scrollAreaMeasureRef.current) {
                    const scrollHeight = scrollAreaMeasureRef.current.scrollHeight;
                    const clientHeight = scrollAreaMeasureRef.current.clientHeight;
                    const scrollWidth = scrollAreaMeasureRef.current.scrollWidth;
                    const clientWidth = scrollAreaMeasureRef.current.clientWidth;

                    const thumbSizeHorizontal = (clientWidth / scrollWidth) * clientWidth - 6;
                    setThumbSizeHorizontal(thumbSizeHorizontal);

                    const thumbSizeVertical = (clientHeight / scrollHeight) * clientHeight - 6;
                    setThumbSizeVertical(thumbSizeVertical);
                }
            };

            // Cleanup function to disconnect observers
            return () => {
                resizeObserver.disconnect();
                mutationObserver.disconnect();
            };
        }
    }, []);

    const bindDrag = useDrag((state) => {
        if(scrollAreaMeasureRef.current) {
            const scrollWidth = scrollAreaMeasureRef.current.scrollWidth;
            const clientWidth = scrollAreaMeasureRef.current.clientWidth;
            const scrollHeight = scrollAreaMeasureRef.current.scrollHeight;
            const clientHeight = scrollAreaMeasureRef.current.clientHeight;

            if(horizontalScrollbar) {
                const scrollTo =
                    (state.offset[0] / (clientWidth - thumbSizeHorizontal - 6)) * (scrollWidth - clientWidth);
                scrollAreaMeasureRef.current.scrollLeft = scrollTo;
            }

            if(verticalScrollbar) {
                const scrollTo =
                    (state.offset[1] / (clientHeight - thumbSizeVertical - 6)) * (scrollHeight - clientHeight);
                scrollAreaMeasureRef.current.scrollTop = scrollTo;
            }
        }
    });

    function handleScroll(event: React.UIEvent<HTMLDivElement>) {
        if(scrollAreaMeasureRef.current) {
            if(horizontalScrollbar) {
                const scrollWidth = scrollAreaMeasureRef.current.scrollWidth;
                const clientWidth = scrollAreaMeasureRef.current.clientWidth;
                const scrollTo =
                    (event.currentTarget.scrollLeft / (scrollWidth - clientWidth)) *
                    (clientWidth - thumbSizeHorizontal - 6);

                thumbSpringHorizontalApi.start({
                    x: scrollTo,
                    immediate: true,
                    onStart: () => {
                        if(scrollContainerRef.current) {
                            scrollContainerRef.current.dataset['state'] = 'visible';
                        }
                    },
                    onRest: () => {
                        if(scrollContainerRef.current) {
                            const timeout = setTimeout(() => {
                                if(scrollContainerRef.current) {
                                    scrollContainerRef.current.dataset['state'] = 'hidden';
                                }
                            });
                            return () => clearTimeout(timeout);
                        }
                    },
                });
            }

            if(verticalScrollbar) {
                const scrollHeight = scrollAreaMeasureRef.current.scrollHeight;
                const clientHeight = scrollAreaMeasureRef.current.clientHeight;
                const scrollTo =
                    (event.currentTarget.scrollTop / (scrollHeight - clientHeight)) *
                    (clientHeight - thumbSizeVertical - 6);

                thumbSpringVerticalApi.start({
                    y: scrollTo,
                    immediate: true,
                    onStart: () => {
                        if(scrollContainerRef.current) {
                            scrollContainerRef.current.dataset['state'] = 'visible';
                        }
                    },
                    onRest: () => {
                        if(scrollContainerRef.current) {
                            const timeout = setTimeout(() => {
                                if(scrollContainerRef.current) {
                                    scrollContainerRef.current.dataset['state'] = 'hidden';
                                }
                            });
                            return () => clearTimeout(timeout);
                        }
                    },
                });
            }
        }
    }

    return (
        <div
            ref={scrollContainerRef}
            className={mergeClassNames(scrollAreaContainerClassName, properties.containerClassName, 'relative')}
        >
            <div
                ref={mergeRefs(reference, scrollAreaMeasureRef)}
                onScroll={handleScroll}
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
            {verticalScrollbar && (
                <ScrollBar
                    orientation="vertical"
                    thumbSize={thumbSizeVertical}
                    scrollAnimation={thumbSpringVertical}
                    {...bindDrag()}
                />
            )}
            {horizontalScrollbar && (
                <ScrollBar
                    orientation="horizontal"
                    thumbSize={thumbSizeHorizontal}
                    scrollAnimation={thumbSpringHorizontal}
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
});

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
    ...properties
}: {
    orientation: 'vertical' | 'horizontal';
    thumbSize: number;
    scrollAnimation: {
        x?: SpringValue<number>;
        y?: SpringValue<number>;
    };
} & React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={mergeClassNames(
                scrollAreaScrollbarClassName,
                orientation === 'vertical'
                    ? scrollAreaVerticalScrollbarClassName
                    : scrollAreaHorizontalScrollbarClassName,
                'absolute',
                orientation === 'vertical' ? 'inset-y-0 right-0' : 'inset-x-0 bottom-0',
            )}
        >
            <animated.div
                className={mergeClassNames(scrollAreaThumbClassName)}
                style={{
                    ...scrollAnimation,
                    [orientation === 'vertical' ? 'height' : 'width']: thumbSize,
                }}
                {...properties}
            />
        </div>
    );
}
