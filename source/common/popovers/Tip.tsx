'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { PopoverInterface, popoverClassName } from '@structure/source/common/popovers/Popover';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';
import { wrapForSlot } from '@structure/source/utilities/React';

// Component - Tip
export interface TipInterface extends PopoverInterface {}
export function Tip({ open: externalOpen, onOpenChange: externalSetOpen, ...properties }: TipInterface) {
    // State
    const [internalOpen, internalSetOpen] = React.useState(false);

    const [open, setOpen] = React.useMemo(
        function () {
            return externalOpen !== undefined ? [externalOpen, externalSetOpen] : [internalOpen, internalSetOpen];
        },
        [externalOpen, externalSetOpen, internalOpen, internalSetOpen],
    );

    // Defaults
    const side = properties.side ?? 'top';
    const sideOffset = properties.sideOffset ?? 4;
    const align = properties.align ?? 'center';
    const alignOffset = properties.alignOffset ?? 0;
    const collisionPadding = properties.collisionPadding ?? 12;

    // If the content is a string, wrap it in a div
    let content = properties.content;
    if(typeof content === 'string') {
        content = <div className="px-2 py-1.5 text-xs">{properties.content}</div>;
    }

    // Render the component
    return (
        <RadixTooltip.Root open={open} onOpenChange={setOpen} delayDuration={properties.delayInMilliseconds}>
            <RadixTooltip.Trigger
                asChild
                onKeyDown={function (event) {
                    // console.log('Tip.tsx onKeyDown', event.code);

                    // Open the tip when the user presses the arrow keys, spacebar, or enter
                    if(
                        open == false &&
                        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter'].includes(event.code)
                    ) {
                        event.preventDefault();
                        // If the setOpen function is provided, use it
                        if(externalSetOpen) {
                            externalSetOpen(true);
                        }
                    }
                }}
            >
                {/* Wrap SVGs in a span so they can be interacted with */}
                {properties.children && wrapForSlot(properties.children)}
            </RadixTooltip.Trigger>
            <RadixTooltip.Portal container={properties.portalContainer}>
                <RadixTooltip.Content
                    side={side}
                    sideOffset={sideOffset} // Offset the RadixTooltip from the trigger
                    align={align}
                    alignOffset={alignOffset}
                    collisionPadding={collisionPadding}
                    collisionBoundary={properties.collisionBoundary}
                    className={mergeClassNames(
                        // State instant-open is specific to Tip
                        'data-[state=instant-open]:animate-in data-[state=instant-open]:fade-in-0 data-[state=instant-open]:zoom-in-95',
                        // State delayed-open is specific to Tip
                        'data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95',
                        popoverClassName,
                        // This was previously set to z-50 but the tips were showing through the dialog overlay
                        // This is now set to 40 to ensure the tooltip is below the dialog overlay
                        'z-40',
                        properties.className,
                    )}
                    // Use Radix variables to style the popover content size
                    style={{
                        maxWidth: 'var(--radix-tooltip-content-available-width)',
                        maxHeight: 'var(--radix-tooltip-content-available-height)',
                    }}
                >
                    {content}
                </RadixTooltip.Content>
            </RadixTooltip.Portal>
        </RadixTooltip.Root>
    );
}

// Export - Default
export default Tip;
