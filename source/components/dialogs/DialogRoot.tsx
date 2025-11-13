'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import * as RadixDialog from '@radix-ui/react-dialog';
import { Drawer as VaulDrawer } from 'vaul';
import { Button } from '@structure/source/components/buttons/Button';

// Dependencies - Theme
import { dialogTheme as structureDialogTheme } from './DialogTheme';
import type { DialogVariant, DialogPosition, DialogSize } from './DialogTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeComponentTheme } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Context
import { DialogContext } from './DialogContext';
import { DialogTrigger } from './DialogTrigger';

// Dependencies - Assets
import { XIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { mergeClassNames, createVariantClassNames } from '@structure/source/utilities/style/ClassName';
import { useIsMobile, focusFirstFocusableElement } from '@structure/source/utilities/react/React';

// Component - DialogRoot
export interface DialogRootProperties {
    // Container
    className?: string;
    overlayClassName?: string;

    // Behavior
    trigger?: React.ReactElement; // Convenience prop for trigger
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
    onOpenAutoFocus?: (event: Event) => void;

    // Theme
    variant?: DialogVariant;
    position?: DialogPosition;
    size?: DialogSize;

    // Auto close button
    closeButton?: boolean | React.ReactNode; // Auto X in top right

    // Compound components
    children: React.ReactNode;
}
export function DialogRoot(properties: DialogRootProperties) {
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

    // Function to handle the open state change
    function onOpenChange(newOpen: boolean) {
        properties.onOpenChange?.(newOpen);
        setOpen(newOpen);
    }

    // On mount, set the open state
    React.useEffect(
        function () {
            setOpen(properties.open ?? false);
        },
        [properties.open],
    );

    // Polymorphic DialogClose based on mobile/desktop
    const DialogClose = isMobile ? VaulDrawer.Close : RadixDialog.Close;

    // Render close button (auto close button in top right)
    function renderCloseButton(additionalClassName?: string) {
        if(properties.closeButton === undefined || properties.closeButton !== false) {
            return (
                <DialogClose asChild>
                    {properties.closeButton !== true && properties.closeButton !== undefined ? (
                        properties.closeButton
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

    // Context value for compound components
    const contextValue = {
        open,
        onOpenChange,
        isMobile,
        dialogId,
        dialogTheme,
        variant,
        position,
        size,
        modal: properties.modal,
        onOpenAutoFocus: properties.onOpenAutoFocus,
    };

    // Render the component
    return (
        <DialogContext.Provider value={contextValue}>
            {isMobile ? (
                // Mobile: Vaul Drawer (bottom sheet)
                <VaulDrawer.Root open={open} onOpenChange={onOpenChange} shouldScaleBackground modal>
                    {properties.trigger && <DialogTrigger>{properties.trigger}</DialogTrigger>}
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
                            {properties.children}
                        </VaulDrawer.Content>
                    </VaulDrawer.Portal>
                </VaulDrawer.Root>
            ) : (
                // Desktop: Radix Dialog (centered modal)
                <RadixDialog.Root open={open} onOpenChange={onOpenChange} modal={properties.modal}>
                    {properties.trigger && <DialogTrigger>{properties.trigger}</DialogTrigger>}
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
                            onOpenAutoFocus={function (event) {
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
                            {properties.children}
                        </RadixDialog.Content>
                    </RadixDialog.Portal>
                </RadixDialog.Root>
            )}
        </DialogContext.Provider>
    );
}
