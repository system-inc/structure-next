'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import * as RadixDialog from '@radix-ui/react-dialog';
import { Button } from '@structure/source/components/buttons/Button';
import { ScrollArea } from '@structure/source/components/interactions/ScrollArea';

// Dependencies - Assets
import CloseIcon from '@structure/assets/icons/navigation/CloseIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';
import { wrapForSlot } from '@structure/source/utilities/react/React';

// Class Names - Dialog Overlay
export const dialogOverlayClassName =
    // Position and z-index
    'fixed inset-0 z-50 ' +
    // Background and backdrop
    'bg-background/60 ' +
    // Animation states
    'data-[state=open]:animate-in data-[state=open]:fade-in-0 ' +
    // Fade animation
    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0';

// Class Names - Dialog Close Button
export const dialogCloseClassName =
    // Position
    'absolute right-4 top-4 ' +
    // Border
    'rounded-extra-small  ' +
    // Hover and focus states
    'cursor-pointer transition-opacity opacity-70 hover:opacity-100 ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ' +
    // Disabled state
    'disabled:pointer-events-none ' +
    // State-specific styles
    'data-[state=open]:bg-accent data-[state=open]:text-muted-foreground';

// Class Names - Dialog Header
export const dialogHeaderClassName =
    // Flex layout with vertical spacing
    'flex flex-col space-y-1.5 ' +
    // Text alignment
    'text-left';

// Class Names - Dialog Footer
export const dialogFooterClassName =
    // Flex layout with spacing
    'flex flex-row justify-end space-x-2';

// Class Names - Dialog Content - Positioned Centered
export const dialogContentPositionCenteredClassName =
    // Position, outline, and z-index
    'outline-none fixed left-[50%] top-[50%] z-50 ' +
    // Flex layout and alignment
    'w-full max-w-[90vw] md:max-w-lg max-h-[95vh] ' +
    // Animation states
    'duration-200 ' +
    // Open animation
    'data-[state=open]:animate-in-centered data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] ' +
    // Close animation
    'data-[state=closed]:animate-out-centered data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]';

// Class Names - Dialog Content - Positioned Top Fixed
export const dialogContentPositionTopFixedClassName =
    // Position, outline, and z-index
    'outline-none fixed left-[50%] top-[10%] z-50 ' +
    // Grid layout and alignment
    'grid w-full max-w-lg translate-x-[-50%] translate-y-[0%] gap-4' +
    // Animation states
    'duration-200 ' +
    // Open animation
    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 ' +
    // Close animation
    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2';

// Variants - Dialog
export const DialogVariants = {
    // Default variant
    default:
        `${dialogContentPositionCenteredClassName} ` +
        // Border, background, and shadow
        `flex flex-col border border-opsis-border-primary bg-background p-6 shadow-lg rounded-lg w-full gap-4`,
    // Unstyled centered variant
    unstyled:
        `${dialogContentPositionCenteredClassName} ` +
        // Unstyled
        ``,
    // Unstyled top fixed variant
    unstyledTopFixed:
        `${dialogContentPositionTopFixedClassName} ` +
        // Unstyled
        ``,
    // Full screen with margin
    fullScreenWithMargin:
        `${dialogContentPositionCenteredClassName} ` +
        `flex flex-col border border-opsis-border-primary bg-background p-6 shadow-lg rounded-lg w-full gap-4 ` +
        `h-full max-h-[calc(100vh-8rem)] w-full max-w-[calc(100vw-8rem)] md:max-h-[calc(100vh-8rem)] md:max-w-[calc(100vw-8rem)] `,
};

// Component - Dialog
export interface DialogProperties {
    variant?: keyof typeof DialogVariants;
    children?: React.ReactElement; // The trigger
    overlayClassName?: string; // The class names for the overlay
    className?: string; // The class names for the dialog
    closeControl?: React.ReactNode | boolean; // The close button
    header?: React.ReactNode; // The header
    headerClassName?: string; // The class names for the header
    accessibilityTitle?: string; // The accessibility description
    content?: React.ReactNode; // The content
    contentScrollAreaClassName?: string; // The class names for the content scroll area
    accessibilityDescription?: string; // The accessibility description
    footer?: React.ReactNode; // The footer
    footerClassName?: string; // The class names for the footer
    footerCloseButton?: React.ReactNode | boolean; // The close button for the footer
    open?: boolean; // Whether the dialog is open
    onOpenChange?: (open: boolean) => void; // The callback for when the open state changes
    onOpenAutoFocus?: (event: Event) => void; // The callback for when the dialog opens
    modal?: boolean; // Whether the dialog is a modal
}
export function Dialog(properties: DialogProperties) {
    // State
    const [open, setOpen] = React.useState(properties.open ?? false);

    // Defaults
    const variant = properties.variant || 'default';
    const accessibilityDescription = properties.accessibilityDescription || '';

    // On mount, set the open state
    React.useEffect(
        function () {
            setOpen(properties.open ?? false);
        },
        [properties.open],
    ); // Listen for changes to the open property

    // Function to handle the open state change
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
        <RadixDialog.Root open={open} onOpenChange={onOpenChange} modal={properties.modal}>
            {/* Trigger */}
            {properties.children && (
                <RadixDialog.Trigger asChild>
                    {/* If the child is an SVG, wrap it in a span so it can be interacted with */}
                    {wrapForSlot(properties.children, open ? 'data-state-open' : '')}
                </RadixDialog.Trigger>
            )}
            <RadixDialog.Portal>
                <RadixDialog.Overlay className={mergeClassNames(dialogOverlayClassName, properties.overlayClassName)} />
                <RadixDialog.Content
                    onOpenAutoFocus={properties.onOpenAutoFocus}
                    className={mergeClassNames(DialogVariants[variant], properties.className)}
                >
                    {/* Close */}
                    {(properties.closeControl === undefined || properties.closeControl !== false) && (
                        // If the closeControl property is not a boolean, use it directly
                        // If the closeControl property is true or undefined, render a default close button
                        // If the closeControl property is false, don't render anything
                        <RadixDialog.Close asChild>
                            {properties.closeControl !== true && properties.closeControl !== undefined ? (
                                properties.closeControl
                            ) : (
                                <div className={mergeClassNames(dialogCloseClassName)} aria-label="Close">
                                    <CloseIcon className="h-4 w-4" />
                                </div>
                            )}
                        </RadixDialog.Close>
                    )}

                    {/* Header */}
                    {properties.header && (
                        <div
                            className={mergeClassNames(
                                dialogHeaderClassName,
                                properties.headerClassName,
                                // 'border border-red-500',
                            )}
                        >
                            {
                                // If the header is a string, render it with a default style
                                typeof properties.header === 'string' ? (
                                    <RadixDialog.Title asChild>
                                        <div className="font-medium">{properties.header}</div>
                                    </RadixDialog.Title>
                                ) : (
                                    // Otherwise, render the header as a child
                                    <RadixDialog.Title asChild>{properties.header}</RadixDialog.Title>
                                )
                            }
                        </div>
                    )}

                    {/* Accessibility Title */}
                    {properties.accessibilityTitle && (
                        <RadixDialog.Title
                            className="hidden"
                            aria-describedby={properties.accessibilityTitle}
                        ></RadixDialog.Title>
                    )}

                    {/* Accessibility Description */}
                    <RadixDialog.Description
                        className="hidden"
                        aria-describedby={accessibilityDescription}
                    ></RadixDialog.Description>

                    {/* Content */}
                    {/* We wrap the content in a scroll area to standardize all scrollbars in dialogs */}
                    {properties.content && (
                        <ScrollArea
                            className={mergeClassNames('max-h-[75vh]', properties.contentScrollAreaClassName)}
                            horizontalScrollbar={true}
                        >
                            {properties.content}
                        </ScrollArea>
                    )}

                    {/* Footer */}
                    {(properties.footer || properties.footerCloseButton) && (
                        <div
                            className={mergeClassNames(
                                dialogFooterClassName,
                                properties.footerClassName,
                                // 'border border-red-500',
                            )}
                        >
                            {properties.footer}

                            {/* Close Button */}
                            {properties.footerCloseButton !== undefined && properties.footerCloseButton !== false && (
                                // If the footerCloseButton property is not a boolean, use it directly
                                // If the footerCloseButton property is true render a default close button <Button>Dismiss</Button>
                                // If the footerCloseButton property is false, don't render anything
                                <RadixDialog.Close asChild>
                                    {properties.footerCloseButton !== true &&
                                    properties.footerCloseButton !== undefined ? (
                                        properties.footerCloseButton
                                    ) : (
                                        <Button>Dismiss</Button>
                                    )}
                                </RadixDialog.Close>
                            )}
                        </div>
                    )}
                </RadixDialog.Content>
            </RadixDialog.Portal>
        </RadixDialog.Root>
    );
}
