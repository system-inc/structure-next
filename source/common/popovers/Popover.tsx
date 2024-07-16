'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import * as RadixPopover from '@radix-ui/react-popover';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { wrapForSlot } from '@structure/source/utilities/React';

// Class Names - Popover
export const popoverClassName =
    // Focus
    `outline-none ` +
    // Background and text
    `bg-light text-dark dark:bg-dark+2 dark:text-light ` +
    // Border
    `rounded-md border border-light-4 dark:border-dark-4 ` +
    // Animations
    `data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 ` +
    // Base width and height
    `w-full`;

// Component - Popover
export interface PopoverInterface {
    children?: React.ReactElement; // Must be a ReactElement (e.g., div or span), not a ReactNode
    content: React.ReactNode;
    className?: string;
    side?: 'top' | 'bottom' | 'left' | 'right';
    sideOffset?: number;
    align?: 'start' | 'center' | 'end';
    alignOffset?: number;
    portalContainer?: HTMLElement;
    collisionPadding?: number;
    collisionBoundary?: HTMLElement[];
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onOpenAutoFocus?: (event: Event) => void;
    modal?: boolean;
    delayInMilliseconds?: number;
    anchor?: HTMLElement;
    tabIndex?: number;
}
export function Popover(properties: PopoverInterface) {
    // State
    const [open, setOpen] = React.useState(properties.open ?? false);

    // On mount, set the open state
    React.useEffect(
        function () {
            setOpen(properties.open ?? false);
        },
        [properties.open],
    ); // Listen for changes to the open property

    // Defaults
    const side = properties.side ?? 'top';
    const sideOffset = properties.sideOffset ?? 4;
    const align = properties.align ?? 'center';
    const alignOffset = properties.alignOffset ?? 0;
    const collisionPadding = properties.collisionPadding ?? 12;

    // Function to handle on open change
    function onOpenChange() {
        // Call the onOpenChange callback
        if(properties.onOpenChange) {
            properties.onOpenChange(!open);
        }

        // Update the state
        setOpen(!open);
    }

    // Render the component
    return (
        <RadixPopover.Root open={open} onOpenChange={onOpenChange} modal={properties.modal}>
            {/* Trigger */}
            {properties.children && (
                <RadixPopover.Trigger
                    tabIndex={properties.tabIndex ?? 1}
                    onKeyDown={function (event) {
                        // console.log('Popover.tsx onKeyDown', event.code);

                        // Open the popover when the user presses the arrow keys, spacebar, or enter
                        if(
                            open == false &&
                            ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter'].includes(event.code)
                        ) {
                            event.preventDefault();
                            setOpen(true);
                        }
                    }}
                    asChild
                >
                    {/* If the child is an SVG, wrap it in a span so it can be interacted with */}
                    {wrapForSlot(properties.children, open ? 'group data-state-open' : 'group')}
                </RadixPopover.Trigger>
            )}
            <RadixPopover.Portal container={properties.portalContainer}>
                <RadixPopover.Content
                    side={side}
                    sideOffset={sideOffset}
                    align={align}
                    alignOffset={alignOffset}
                    collisionPadding={collisionPadding}
                    collisionBoundary={properties.collisionBoundary}
                    onOpenAutoFocus={properties.onOpenAutoFocus}
                    tabIndex={properties.tabIndex ?? 1}
                    className={mergeClassNames(
                        popoverClassName,
                        // State open is specific to Popover
                        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                        // Side bottom is specific to Popover
                        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                        // This was previously set to z-50 but the tips were showing through the dialog overlay
                        // This is now set to 40 to ensure the tooltip is below the dialog overlay
                        'z-40',
                        properties.className,
                    )}
                    // Use Radix variables to style the popover content size
                    style={{
                        maxWidth: 'var(--radix-popover-content-available-width)',
                        maxHeight: 'var(--radix-popover-content-available-height)',
                        minWidth: 'var(--radix-popper-anchor-width)',
                        minHeight: 'var(--radix-popper-anchor-height)',
                    }}
                >
                    {properties.content}
                </RadixPopover.Content>
            </RadixPopover.Portal>
        </RadixPopover.Root>
    );
}

// Export - Default
export default Popover;
