'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import * as RadixPopover from '@radix-ui/react-popover';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import { wrapForSlot } from '@structure/source/utilities/react/React';

// Dependencies - Theme
import { popoverTheme as structurePopoverTheme } from '@structure/source/components/popovers/PopoverTheme';
import type { PopoverVariant } from '@structure/source/components/popovers/PopoverTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeComponentTheme } from '@structure/source/theme/utilities/ThemeUtilities';

// Component - Popover
export interface PopoverProperties {
    children?: never; // Do not use children, use trigger property instead
    variant?: PopoverVariant;
    trigger: React.ReactElement; // The element that opens the popover
    content: React.ReactNode; // What appears in the popover
    contentClassName?: string; // Styles the popover content box
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
    // Get component theme from context
    const componentTheme = useComponentTheme();

    // Merge the structure theme with project theme (if set by the layout provider)
    const popoverTheme = mergeComponentTheme(structurePopoverTheme, componentTheme?.Popover);

    // Defaults
    const variant = properties.variant ?? popoverTheme.configuration?.defaultVariant?.variant;

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
        properties.onOpenChange?.(!open);

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
        className: mergeClassNames(
            popoverTheme.configuration.baseClasses,
            variant ? popoverTheme.variants[variant] : '',
            // State open is specific to Popover
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            // Side bottom is specific to Popover
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            // Closed animation
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            // This was previously set to z-50 but the tips were showing through the dialog overlay
            // This is now set to 40 to ensure the tooltip is below the dialog overlay
            'z-40',
            properties.contentClassName,
        ),
        style: {
            // For Tip variant, we let CSS classes control max-width instead of inline styles
            // For other variants (like Primary), use Radix variables
            ...(variant !== 'Tip' && {
                maxWidth: 'var(--radix-popover-content-available-width)',
                minWidth: 'var(--radix-popper-anchor-width)',
                minHeight: 'var(--radix-popper-anchor-height)',
            }),
            maxHeight: 'var(--radix-popover-content-available-height)',
        },
    };

    // Shared content element
    const contentElement = <RadixPopover.Content {...contentProperties}>{properties.content}</RadixPopover.Content>;

    // Render the component
    return (
        <RadixPopover.Root open={open} onOpenChange={onOpenChange} modal={properties.modal}>
            {/* Trigger */}
            <RadixPopover.Trigger
                tabIndex={properties.tabIndex}
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
                {wrapForSlot(properties.trigger, open ? 'group data-state-open' : 'group')}
            </RadixPopover.Trigger>
            {/* Portal is optional - use it to render above other content, but disable for Dialogs to prevent z-index issues */}
            {properties.portalContainer ? (
                <RadixPopover.Portal container={properties.portalContainer}>{contentElement}</RadixPopover.Portal>
            ) : (
                contentElement
            )}
        </RadixPopover.Root>
    );
}
