'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import * as RadixDialog from '@radix-ui/react-dialog';
import { Drawer as VaulDrawer } from 'vaul';
import { Button } from '@structure/source/components/buttons/Button';
import { ScrollArea } from '@structure/source/components/interactions/ScrollArea';

// Dependencies - Theme
import { dialogTheme as structureDialogTheme } from './DialogTheme';
import type { DialogVariant, DialogPosition, DialogSize } from './DialogTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeComponentTheme } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Assets
import { XIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { mergeClassNames, createVariantClassNames } from '@structure/source/utilities/style/ClassName';
import { wrapForSlot, useIsMobile, focusFirstFocusableElement } from '@structure/source/utilities/react/React';

// Component - Dialog
export interface DialogProperties {
    className?: string; // The class names for the dialog
    overlayClassName?: string; // The class names for the overlay
    children?: never; // Do not use children, use trigger property instead
    trigger?: React.ReactElement; // The element that opens the dialog
    variant?: DialogVariant;
    position?: DialogPosition;
    size?: DialogSize;
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
    modal?: boolean; // Whether the dialog is a modal
    open?: boolean; // Whether the dialog is open
    onOpenChange?: (open: boolean) => void; // The callback for when the open state changes
    onOpenAutoFocus?: (event: Event) => void; // The callback for when the dialog opens
}
export function Dialog(properties: DialogProperties) {
    // Get component theme from context
    const componentTheme = useComponentTheme();

    // Merge the structure theme with project theme
    const dialogTheme = mergeComponentTheme(structureDialogTheme, componentTheme?.Dialog);

    // Determine variant, position, and size with defaults from configuration
    const variant = properties.variant ?? dialogTheme.configuration?.defaultVariant?.variant;
    const position = properties.position ?? dialogTheme.configuration?.defaultVariant?.position ?? 'Centered';
    const size = properties.size ?? dialogTheme.configuration?.defaultVariant?.size ?? 'Base';

    // Create dialog variant class names function using the merged theme
    const dialogVariantClassNames = createVariantClassNames(dialogTheme.configuration.baseClasses, {
        variants: {
            variant: dialogTheme.variants,
            position: dialogTheme.positions,
            size: dialogTheme.sizes,
        },
        defaultVariants: dialogTheme.configuration.defaultVariant,
    });

    // Detect mobile viewport
    const isMobile = useIsMobile();

    // Generate unique ID for accessibility
    const dialogId = React.useId();

    // State
    const [open, setOpen] = React.useState(properties.open ?? false);

    // Defaults
    const accessibilityDescription = properties.accessibilityDescription || '';

    // Function to handle the open state change
    function onOpenChange() {
        // Call the onOpenChange callback
        properties.onOpenChange?.(!open);

        // Update the state
        setOpen(!open);
    }

    // On mount, set the open state
    React.useEffect(
        function () {
            setOpen(properties.open ?? false);
        },
        [properties.open],
    );

    // Polymorphic components that adapt to mobile/desktop
    const DialogClose = isMobile ? VaulDrawer.Close : RadixDialog.Close;
    const DialogTitle = isMobile ? VaulDrawer.Title : RadixDialog.Title;
    const DialogDescription = isMobile ? VaulDrawer.Description : RadixDialog.Description;

    // Shared close button rendering
    function renderCloseButton(additionalClassName?: string) {
        if(properties.closeControl === undefined || properties.closeControl !== false) {
            return (
                <DialogClose asChild>
                    {properties.closeControl !== true && properties.closeControl !== undefined ? (
                        properties.closeControl
                    ) : (
                        <Button
                            variant="Ghost"
                            size="IconSmall"
                            icon={XIcon}
                            className={mergeClassNames(dialogTheme.configuration.closeClasses, additionalClassName)}
                            aria-label="Close"
                        />
                    )}
                </DialogClose>
            );
        }
        return null;
    }

    // Shared header rendering
    function renderHeader(additionalClassName?: string) {
        if(!properties.header) {
            return null;
        }

        return (
            <div
                className={mergeClassNames(
                    dialogTheme.configuration.headerClasses,
                    properties.headerClassName,
                    additionalClassName,
                )}
            >
                {typeof properties.header === 'string' ? (
                    <DialogTitle asChild>
                        <div className="font-medium">{properties.header}</div>
                    </DialogTitle>
                ) : (
                    <DialogTitle asChild>{properties.header}</DialogTitle>
                )}
            </div>
        );
    }

    // Shared accessibility elements
    function renderAccessibility() {
        return (
            <>
                {properties.accessibilityTitle && (
                    <DialogTitle className="hidden" aria-describedby={properties.accessibilityTitle}></DialogTitle>
                )}
                <DialogDescription className="hidden" aria-describedby={accessibilityDescription}></DialogDescription>
            </>
        );
    }

    // Shared content rendering
    function renderContent(mobileClassName?: string) {
        if(!properties.content) {
            return null;
        }

        if(isMobile) {
            return <div className={mobileClassName}>{properties.content}</div>;
        }

        return (
            <ScrollArea
                className={mergeClassNames('max-h-[75vh]', properties.contentScrollAreaClassName)}
                horizontalScrollbar={true}
            >
                {properties.content}
            </ScrollArea>
        );
    }

    // Shared footer rendering
    function renderFooter(additionalClassName?: string) {
        if(!properties.footer && !properties.footerCloseButton) {
            return null;
        }

        return (
            <div
                className={mergeClassNames(
                    dialogTheme.configuration.footerClasses,
                    properties.footerClassName,
                    additionalClassName,
                )}
            >
                {properties.footer}

                {properties.footerCloseButton !== undefined && properties.footerCloseButton !== false && (
                    <DialogClose asChild>
                        {properties.footerCloseButton !== true && properties.footerCloseButton !== undefined ? (
                            properties.footerCloseButton
                        ) : (
                            <Button variant="A">Dismiss</Button>
                        )}
                    </DialogClose>
                )}
            </div>
        );
    }

    // Render the component
    return (
        <>
            {isMobile ? (
                // Mobile: Vaul Drawer (bottom sheet)
                <VaulDrawer.Root open={open} onOpenChange={onOpenChange} shouldScaleBackground modal>
                    {properties.trigger && <VaulDrawer.Trigger asChild>{properties.trigger}</VaulDrawer.Trigger>}
                    <VaulDrawer.Portal>
                        <VaulDrawer.Overlay
                            className={mergeClassNames(
                                dialogTheme.configuration.overlayClasses,
                                properties.overlayClassName,
                            )}
                        />
                        <VaulDrawer.Content
                            className={mergeClassNames(
                                'fixed inset-x-0 bottom-0 z-50 flex h-auto max-h-[80vh] w-full flex-col rounded-t-3xl border-t border--0 background--0',
                                properties.className,
                            )}
                            onOpenAutoFocus={function (event) {
                                if(properties.onOpenAutoFocus) {
                                    properties.onOpenAutoFocus(event);
                                }
                                else {
                                    event.preventDefault();
                                    focusFirstFocusableElement(`[data-drawer-id="${dialogId}"]`);
                                }
                            }}
                            data-drawer-id={dialogId}
                        >
                            {renderCloseButton('absolute top-4 right-4 z-10')}
                            {renderHeader('shrink-0 px-6 pt-6 pb-4')}
                            {renderAccessibility()}
                            {renderContent('grow overflow-y-auto px-6')}
                            {renderFooter('shrink-0 px-6 pt-4 pb-6')}
                        </VaulDrawer.Content>
                    </VaulDrawer.Portal>
                </VaulDrawer.Root>
            ) : (
                // Desktop: Radix Dialog (centered modal)
                <RadixDialog.Root open={open} onOpenChange={onOpenChange} modal={properties.modal}>
                    {properties.trigger && (
                        <RadixDialog.Trigger asChild>
                            {wrapForSlot(properties.trigger, open ? 'data-state-open' : '')}
                        </RadixDialog.Trigger>
                    )}
                    <RadixDialog.Portal>
                        <RadixDialog.Overlay
                            className={mergeClassNames(
                                dialogTheme.configuration.overlayClasses,
                                properties.overlayClassName,
                            )}
                        />
                        <RadixDialog.Content
                            className={mergeClassNames(
                                dialogVariantClassNames({
                                    variant: variant,
                                    position: position,
                                    size: size,
                                }),
                                properties.className,
                            )}
                            onOpenAutoFocus={(event) => {
                                if(properties.onOpenAutoFocus) {
                                    properties.onOpenAutoFocus(event);
                                }
                                else {
                                    event.preventDefault();
                                    focusFirstFocusableElement(`[data-dialog-id="${dialogId}"]`);
                                }
                            }}
                            data-dialog-id={dialogId}
                        >
                            {renderCloseButton()}
                            {renderHeader()}
                            {renderAccessibility()}
                            {renderContent()}
                            {renderFooter()}
                        </RadixDialog.Content>
                    </RadixDialog.Portal>
                </RadixDialog.Root>
            )}
        </>
    );
}
