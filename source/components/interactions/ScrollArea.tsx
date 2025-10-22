'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import * as RadixScrollArea from '@radix-ui/react-scroll-area';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Class Names - Scroll Area
export const scrollAreaContainerClassName = 'h-full overflow-hidden';
export const scrollAreaClassName = 'h-full w-full rounded-[inherit]';
export const scrollAreaScrollbarClassName = mergeClassNames(
    // Layout
    'flex touch-none px-[4px] py-[2px] select-none',
    // Hover - Only show the scrollbar on hover when the thumb is visible
    'data-[state=visible]:hover:bg-neutral+6/30 data-[state=visible]:dark:hover:bg-dark-4/30',
    // Group
    'group',
    // Animation - Animate the hover colors
    'duration-500 ease-out',
);
export const scrollAreaVerticalScrollbarClassName =
    'w-[14px] data-[state=hidden]:pointer-events-none data-[state=visible]:pointer-events-auto';
export const scrollAreaHorizontalScrollbarClassName =
    'h-[14px] flex-col data-[state=hidden]:pointer-events-none data-[state=visible]:pointer-events-auto';
export const scrollAreaThumbClassName = mergeClassNames(
    // Layout
    'relative flex-1 rounded before:absolute before:top-1/2 before:left-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:translate-x-[50%] before:translate-y-[50%]',
    // Colors
    'bg-dark/60 hover:bg-dark/75 dark:bg-neutral-6/60 hover:dark:bg-neutral-6/75',
    // Animation
    'transition-opacity duration-300 ease-out',
    // Animate in when the group is visible
    'group-data-[state=visible]:opacity-100',
    // Animate out when the group is hidden
    'group-data-[state=hidden]:opacity-0',
);
export const scrollAreaCornerClassName = '';

// Component - ScrollArea
export interface ScrollAreaProperties {
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
    properties: ScrollAreaProperties,
    reference: React.Ref<HTMLDivElement>,
) {
    // Defaults
    const type = properties.type ?? 'scroll';
    const scrollHideDelay = properties.scrollHideDelay ?? 600;
    const direction =
        properties.direction === 'rightToLeft' ? 'rtl' : properties.direction === 'leftToRight' ? 'ltr' : 'ltr';
    const verticalScrollbar = properties.verticalScrollbar ?? true;
    const horizontalScrollbar = properties.horizontalScrollbar ?? false;

    // Render the component
    return (
        <RadixScrollArea.Root
            type={type}
            scrollHideDelay={scrollHideDelay}
            dir={direction}
            className={mergeClassNames(scrollAreaContainerClassName, properties.containerClassName)}
        >
            <RadixScrollArea.Viewport
                ref={reference}
                className={mergeClassNames(scrollAreaClassName, 'scroll-area-viewport', properties.className)}
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
