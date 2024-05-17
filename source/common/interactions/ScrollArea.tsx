'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import * as RadixScrollArea from '@radix-ui/react-scroll-area';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Styles';

// Class Names - Scroll Area
export const scrollAreaClassName = 'h-full w-full rounded-[inherit]';
export const scrollAreaScrollbarClassName =
    'flex touch-none select-none p-[4px] transition-colors duration-150 ease-out';
export const scrollAreaVerticalScrollbarClassName =
    'w-[14px] transition-colors duration-500 hover:bg-neutral+6/30 dark:hover:bg-dark-4/30';
export const scrollAreaHorizontalScrollbarClassName = 'h-[14px] flex-col';
export const scrollAreaThumbClassName =
    'relative flex-1 rounded bg-dark/60 hover:bg-dark/75 dark:bg-neutral-6/60 hover:dark:bg-neutral-6/75 before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:translate-x-[50%] before:translate-y-[50%]';
export const scrollAreaCornerClassName = '';

// Component - ScrollArea
export interface ScrollAreaInterface {
    children: React.ReactNode;
    className?: string;
    scrollAreaClassName?: string;
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
    // Defaults
    const type = properties.type ?? 'hover';
    const scrollHideDelay = properties.scrollHideDelay ?? 600;
    const direction =
        properties.direction === 'rightToLeft' ? 'rtl' : properties.direction === 'leftToRight' ? 'ltr' : 'ltr';
    const verticalScrollbar = properties.verticalScrollbar ?? true;
    const horizontalScrollbar = properties.horizontalScrollbar ?? false;

    // Render the component
    return (
        <RadixScrollArea.Root
            ref={reference}
            type={type}
            scrollHideDelay={scrollHideDelay}
            dir={direction}
            className={mergeClassNames('relative overflow-scroll', properties.className)}
        >
            <RadixScrollArea.Viewport
                className={mergeClassNames(scrollAreaClassName, properties.scrollAreaClassName)}
                asChild
            >
                {properties.children}
            </RadixScrollArea.Viewport>
            {verticalScrollbar && (
                <RadixScrollArea.Scrollbar
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
