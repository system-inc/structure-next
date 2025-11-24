'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import * as RadixPopover from '@radix-ui/react-popover';

// Dependencies - Utilities
import { mergeClassNames, createVariantClassNames } from '@structure/source/utilities/style/ClassName';
import { wrapForSlot } from '@structure/source/utilities/react/React';

// Dependencies - Theme
import { popoverTheme as structurePopoverTheme } from '@structure/source/components/popovers/PopoverTheme';
import type { PopoverVariant, PopoverSize } from '@structure/source/components/popovers/PopoverTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeTheme } from '@structure/source/theme/utilities/ThemeUtilities';

// Component - Popover
export interface PopoverProperties {
    children?: never; // Do not use children, use trigger property instead
    variant?: PopoverVariant;
    size?: PopoverSize;
    trigger: React.ReactElement; // The element that opens the popover
    content: React.ReactNode; // What appears in the popover
    contentClassName?: string; // Styles the popover content box
    side?: 'Top' | 'Bottom' | 'Left' | 'Right';
    sideOffset?: number;
    align?: 'Start' | 'Center' | 'End';
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
    const popoverTheme = mergeTheme(structurePopoverTheme, componentTheme?.Popover);

    // Determine variant and size with smart defaults
    // If variant is "Tip" and no size specified, default to "Tip" size
    // Otherwise use configuration defaults
    const variant = properties.variant ?? popoverTheme.configuration?.defaultVariant?.variant;
    const size =
        properties.size ?? (variant === 'Tip' ? 'Tip' : popoverTheme.configuration?.defaultVariant?.size ?? 'Base');

    // Create popover variant class names function using the merged theme
    const popoverVariantClassNames = createVariantClassNames(popoverTheme.configuration.baseClasses, {
        variants: {
            variant: popoverTheme.variants,
            size: popoverTheme.sizes,
        },
        defaultVariants: popoverTheme.configuration.defaultVariant,
    });

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
    const side = properties.side ?? 'Top';
    const sideOffset = properties.sideOffset ?? 4;
    const align = properties.align ?? 'Center';
    const alignOffset = properties.alignOffset ?? 0;
    const collisionPadding = properties.collisionPadding ?? 12;

    // Function to handle on open change
    function onOpenChange(openState: boolean) {
        // Call the onOpenChange callback with the new state
        properties.onOpenChange?.(openState);

        // Update the state with the value from Radix
        setOpen(openState);
    }

    // Shared content properties
    const contentProperties = {
        side: side.toLowerCase() as 'top' | 'bottom' | 'left' | 'right',
        sideOffset: sideOffset,
        align: align.toLowerCase() as 'start' | 'center' | 'end',
        alignOffset: alignOffset,
        collisionPadding: collisionPadding,
        collisionBoundary: properties.collisionBoundary,
        onOpenAutoFocus: properties.onOpenAutoFocus,
        className: mergeClassNames(
            popoverVariantClassNames({
                variant: variant,
                size: size,
            }),
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
            // For Tip size, we let CSS classes control max-width instead of inline styles
            // For Base size (full-width popovers), use Radix variables to match trigger dimensions
            ...(size !== 'Tip' && {
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

                    // Open the popover when the user presses the arrow keys or spacebar
                    // Don't prevent Enter - let it propagate to allow menu item activation
                    if(
                        open == false &&
                        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)
                    ) {
                        event.preventDefault();
                        // console.log('Popover.tsx: Calling onOpenChange(true) for arrow/space');
                        onOpenChange(true);
                    }
                    // Enter key opens the menu but doesn't prevent default
                    // This allows the Enter key to propagate to the Menu component
                    else if(open == false && event.code === 'Enter') {
                        // console.log('Popover.tsx: Calling onOpenChange(true) for Enter');
                        onOpenChange(true);
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
