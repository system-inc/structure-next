'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import * as RadixTooltip from '@radix-ui/react-tooltip';
import type { PopoverProperties } from '@structure/source/components/popovers/Popover';

// Dependencies - Theme
import { popoverTheme as structurePopoverTheme } from '@structure/source/components/popovers/PopoverTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeComponentTheme } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Utilities
import { mergeClassNames, createVariantClassNames } from '@structure/source/utilities/style/ClassName';
import { wrapForSlot } from '@structure/source/utilities/react/React';

// Component - Tip
export type TipProperties = PopoverProperties;
export function Tip(properties: TipProperties) {
    // Get component theme from context
    const componentTheme = useComponentTheme();

    // Merge the structure theme with project theme (if set by the layout provider)
    const popoverTheme = mergeComponentTheme(structurePopoverTheme, componentTheme?.Popover);

    // Determine variant and size with smart defaults
    // If variant is "Tip" and no size specified, default to "Tip" size
    // Otherwise use configuration defaults
    const variant = properties.variant ?? 'Tip';
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

    // Extract properties
    const externalOpen = properties.open;
    const externalSetOpen = properties.onOpenChange;

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
                {wrapForSlot(properties.trigger)}
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
                        popoverVariantClassNames({
                            variant: variant,
                            size: size,
                        }),
                        // State instant-open is specific to Tip
                        'data-[state=instant-open]:animate-in data-[state=instant-open]:fade-in-0 data-[state=instant-open]:zoom-in-95',
                        // State delayed-open is specific to Tip
                        'data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95',
                        // This was previously set to z-50 but the tips were showing through the dialog overlay
                        // This is now set to 40 to ensure the tooltip is below the dialog overlay
                        'z-40',
                        properties.contentClassName,
                    )}
                    // Use Radix variables to style the popover content size
                    // Note: For Tip size, we let CSS classes control max-width instead of inline styles
                    style={{
                        maxHeight: 'var(--radix-tooltip-content-available-height)',
                    }}
                >
                    {properties.content}
                </RadixTooltip.Content>
            </RadixTooltip.Portal>
        </RadixTooltip.Root>
    );
}
