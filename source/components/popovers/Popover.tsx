'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import * as RadixPopover from '@radix-ui/react-popover';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import { wrapForSlot } from '@structure/source/utilities/react/React';

// Variants - Popover
export const PopoverVariants = {
    // Default variant
    default:
        // Focus
        `outline-none ` +
        // Background and text
        `bg-opsis-background-primary text-opsis-content-primary ` +
        // Border
        `rounded-small border border-light-4 dark:border-dark-4 ` +
        // Base width and height
        `w-full`,
    // Unstyled variant
    unstyled: ``,
};

// Component - Popover
export interface PopoverProperties {
    children?: React.ReactElement; // Must be a ReactElement (e.g., div or span), not a ReactNode
    variant?: keyof typeof PopoverVariants;
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
export function Popover(properties: PopoverProperties) {
    // Defaults
    const variant = properties.variant || 'default';

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

    // Shared content properties
    const contentProperties = {
        side: side,
        sideOffset: sideOffset,
        align: align,
        alignOffset: alignOffset,
        collisionPadding: collisionPadding,
        collisionBoundary: properties.collisionBoundary,
        onOpenAutoFocus: properties.onOpenAutoFocus,
        tabIndex: properties.tabIndex ?? 1,
        className: mergeClassNames(
            PopoverVariants[variant],
            // State open is specific to Popover
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            // Side bottom is specific to Popover
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            // Closed animation
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            // This was previously set to z-50 but the tips were showing through the dialog overlay
            // This is now set to 40 to ensure the tooltip is below the dialog overlay
            'z-40',
            properties.className,
        ),
        style: {
            maxWidth: 'var(--radix-popover-content-available-width)',
            maxHeight: 'var(--radix-popover-content-available-height)',
            minWidth: 'var(--radix-popper-anchor-width)',
            minHeight: 'var(--radix-popper-anchor-height)',
        },
    };

    // Shared content element
    const contentElement = <RadixPopover.Content {...contentProperties}>{properties.content}</RadixPopover.Content>;

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
            {/* Portal is optional - use it to render above other content, but disable for Dialogs to prevent z-index issues */}
            {properties.portalContainer ? (
                <RadixPopover.Portal container={properties.portalContainer}>{contentElement}</RadixPopover.Portal>
            ) : (
                contentElement
            )}
        </RadixPopover.Root>
    );
}
