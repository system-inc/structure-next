'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import * as RadixScrollArea from '@radix-ui/react-scroll-area';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Class Names - Scroll Area
//
// ScrollArea Structure:
// ┌─────────────────────────────────────────┐
// │ Root (containerClassName)               │ ← Outer container, controls sizing in parent layout
// │ ┌─────────────────────────────────┬───┐ │
// │ │ Viewport (className)            │ ▲ │ │ ← Scrollable content area
// │ │                                 │ █ │ │
// │ │  [Your content here]            │ █ │ │
// │ │                                 │ ▼ │ │
// │ └─────────────────────────────────┴───┘ │
// └─────────────────────────────────────────┘
//
// Root Defaults (containerClassName):
// - h-full: Fills parent height, required for vertical scrolling to work
// - w-auto: Sizes to content width, works well as flex children without fighting siblings
// - min-h-0: Allows flex child to shrink below content size (required for scrolling in flex containers)
// - overflow-hidden: Clips scrollbars to rounded corners when using rounded-* classes
export const scrollAreaRootClassName = 'h-full w-auto min-h-0 overflow-hidden';

// Viewport Defaults (className):
// - h-full w-full: Fills the Root completely so scrollable area matches container size
// - rounded-[inherit]: Inherits border radius from Root for proper clipping
export const scrollAreaViewportClassName = 'h-full w-full rounded-[inherit]';

// Usage:
// - containerClassName: Size/position the scroll area (e.g., flex-1, shrink-0, max-h-64, rounded-lg)
// - className: Style the scrollable viewport (e.g., padding, background)

// Scrollbar (shared) - track styling for both orientations
export const scrollAreaScrollbarClassName = mergeClassNames(
    // Layout
    'flex touch-none select-none',
    // Hover - Subtle track background on hover (macOS uses ~9% opacity)
    'data-[state=visible]:hover:bg-scrim-100',
    // Group - allows thumb to respond to scrollbar state
    'group',
    // Animation - Animate the hover colors
    'duration-500 ease-out',
);

// Vertical Scrollbar - 14px wide track with padding for 6px thumb
export const scrollAreaVerticalScrollbarClassName =
    'w-3.5 px-1 py-0.5 data-[state=hidden]:pointer-events-none data-[state=visible]:pointer-events-auto';

// Horizontal Scrollbar - 14px tall track with padding for 6px thumb
export const scrollAreaHorizontalScrollbarClassName =
    'h-3.5 py-1 px-0.5 flex-col data-[state=hidden]:pointer-events-none data-[state=visible]:pointer-events-auto';

// Thumb - the draggable scroll handle
export const scrollAreaThumbClassName = mergeClassNames(
    // Layout - flex-1 fills track minus padding, resulting in 6px thumb
    'relative flex-1 rounded',
    // Invisible touch target - minimum 44x44px centered on thumb for accessibility
    'before:absolute before:top-1/2 before:left-1/2 before:h-full before:min-h-11 before:w-full before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2',
    // Colors - macOS native overlay scrollbar uses ~50% opacity, ~60% on hover/active
    'bg-scrim-500 hover:bg-scrim-600',
    // Animation
    'transition-opacity duration-300 ease-out',
    // Animate in when the scrollbar is visible
    'group-data-[state=visible]:opacity-100',
    // Animate out when the scrollbar is hidden
    'group-data-[state=hidden]:opacity-0',
);

// Corner - appears when both scrollbars are visible (currently unstyled)
export const scrollAreaCornerClassName = '';

// Component - ScrollArea
export interface ScrollAreaProperties {
    children: React.ReactNode;
    // Styles the outer Root container - use for sizing/positioning the scroll area in its parent (e.g., h-full, flex-1)
    containerClassName?: string;
    // Styles the inner Viewport - use for styling the scrollable content area (e.g., padding, max-height)
    className?: string;
    scrollbarClassName?: string;
    verticalScrollbarClassName?: string;
    horizontalScrollbarClassName?: string;
    thumbClassName?: string;
    cornerClassName?: string;
    type?: 'Auto' | 'Always' | 'Scroll' | 'Hover';
    scrollHideDelay?: number;
    direction?: 'RightToLeft' | 'LeftToRight';
    verticalScrollbar?: boolean;
    horizontalScrollbar?: boolean;
}
export const ScrollArea = React.forwardRef(function ScrollArea(
    properties: ScrollAreaProperties,
    reference: React.Ref<HTMLDivElement>,
) {
    // Defaults
    const type = (properties.type?.toLowerCase() ?? 'scroll') as 'auto' | 'always' | 'scroll' | 'hover';
    const scrollHideDelay = properties.scrollHideDelay ?? 600;
    const direction = properties.direction === 'RightToLeft' ? 'rtl' : 'ltr';
    const verticalScrollbar = properties.verticalScrollbar ?? true;
    const horizontalScrollbar = properties.horizontalScrollbar ?? false;

    // Render the component
    return (
        <RadixScrollArea.Root
            type={type}
            scrollHideDelay={scrollHideDelay}
            dir={direction}
            className={mergeClassNames(scrollAreaRootClassName, properties.containerClassName)}
        >
            <RadixScrollArea.Viewport
                ref={reference}
                className={mergeClassNames(
                    scrollAreaViewportClassName,
                    // Radix uses display:table on the inner content div to measure dimensions.
                    // When horizontal scrolling is disabled, this causes unwanted width expansion.
                    // Override to display:block to prevent this. See: https://github.com/radix-ui/primitives/issues/2722
                    // When horizontal scrolling is enabled, keep display:table but constrain with min-width:100%
                    horizontalScrollbar ? '[&>div]:min-w-full' : '[&>div]:block!',
                    // Ensure inner content fills height
                    '[&>div]:h-full',
                    properties.className,
                )}
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
                        className={mergeClassNames(
                            scrollAreaThumbClassName,
                            // Override Radix's inline height style to match vertical thumb behavior (6px after padding)
                            'h-auto!',
                            properties.thumbClassName,
                        )}
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
