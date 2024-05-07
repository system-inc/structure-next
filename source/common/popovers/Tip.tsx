'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { PopoverInterface, popoverClassName } from '@structure/source/common/popovers/Popover';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Styles';

// Component - Tip
export interface TipInterface extends PopoverInterface {}
export function Tip(properties: TipInterface) {
    // State
    const [open, setOpen] = React.useState(properties.open ?? false);

    // On mount, set the open state
    React.useEffect(() => {
        setOpen(properties.open ?? false);
    }, [properties.open]); // Listen for changes to the open property

    // Defaults
    const side = properties.side ?? 'top';
    const sideOffset = properties.sideOffset ?? 4;
    const align = properties.align ?? 'center';
    const alignOffset = properties.alignOffset ?? 0;
    const collisionPadding = properties.collisionPadding ?? 12;

    // Render the component
    return (
        <RadixTooltip.Root open={open} onOpenChange={setOpen}>
            <RadixTooltip.Trigger
                asChild
                tabIndex={properties.tabIndex ?? 1}
                onKeyDown={function (event) {
                    // console.log('Tip.tsx onKeyDown', event.code);

                    // Open the tip when the user presses the arrow keys, spacebar, or enter
                    if(
                        open == false &&
                        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter'].includes(event.code)
                    ) {
                        event.preventDefault();
                        setOpen(true);
                    }
                }}
            >
                {properties.children}
            </RadixTooltip.Trigger>
            <RadixTooltip.Portal container={properties.portalContainer}>
                <RadixTooltip.Content
                    side={side}
                    sideOffset={sideOffset} // Offset the RadixTooltip from the trigger
                    align={align}
                    alignOffset={alignOffset}
                    collisionPadding={collisionPadding}
                    collisionBoundary={properties.collisionBoundary}
                    tabIndex={properties.tabIndex ?? 1}
                    className={mergeClassNames(
                        // State instant-open is specific to Tip
                        'data-[state=instant-open]:animate-in data-[state=instant-open]:fade-in-0 data-[state=instant-open]:zoom-in-95',
                        // State delayed-open is specific to Tip
                        'data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95',
                        popoverClassName,
                        'z-50',
                        properties.className,
                    )}
                    // Use Radix variables to style the popover content size
                    style={{
                        maxWidth: 'var(--radix-tooltip-content-available-width)',
                        maxHeight: 'var(--radix-tooltip-content-available-height)',
                    }}
                >
                    {properties.content}
                </RadixTooltip.Content>
            </RadixTooltip.Portal>
        </RadixTooltip.Root>
    );
}

// Export - Default
export default Tip;
