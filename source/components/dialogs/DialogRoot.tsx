'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import * as RadixDialog from '@radix-ui/react-dialog';
import { Drawer } from '@structure/source/components/drawers/Drawer';

// Dependencies - Theme
import { dialogTheme as structureDialogTheme } from './DialogTheme';
import type { DialogVariant, DialogPosition, DialogSize } from './DialogTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeComponentTheme } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Context
import { DialogContext } from './DialogContext';
import { DialogTrigger } from './DialogTrigger';
import { DialogHeader } from './DialogHeader';
import { DialogBody } from './DialogBody';
import { DialogFooter } from './DialogFooter';

// Dependencies - Utilities
import { mergeClassNames, createVariantClassNames } from '@structure/source/utilities/style/ClassName';
import { useIsMobile } from '@structure/source/utilities/react/hooks/useIsMobile';
import { focusFirstFocusableElement } from '@structure/source/utilities/react/React';

// Component - DialogRoot
export interface DialogRootProperties {
    // Accessibility (REQUIRED)
    accessibilityTitle: string;
    accessibilityDescription: string;

    // Container
    className?: string;
    overlayClassName?: string;

    // Behavior
    trigger?: React.ReactElement; // Convenience prop for trigger
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
    onOpenAutoFocus?: (event: Event) => void;
    isResponsive?: boolean; // Default true - switches to Drawer on mobile

    // Theme
    variant?: DialogVariant;
    position?: DialogPosition;
    size?: DialogSize;

    // Convenience structure (optional)
    header?: React.ReactNode; // If string, wrapped in <div className="font-medium">
    body?: React.ReactNode;
    footer?: React.ReactNode;

    // Close buttons (default true)
    headerCloseButton?: boolean | React.ReactElement;
    footerCloseButton?: boolean | React.ReactElement;

    // Compound components
    children?: React.ReactNode; // Rendered between body and footer
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

    // Determine if we should use mobile drawer (responsive mode enabled + mobile viewport)
    const shouldUseMobileDrawer = (properties.isResponsive ?? true) && isMobile;

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

    // Context value for compound components
    const contextValue = {
        open,
        onOpenChange,
        isMobile: shouldUseMobileDrawer,
        isResponsive: properties.isResponsive ?? true,
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
        <DialogContext.Provider value={contextValue} key={shouldUseMobileDrawer ? 'mobile-drawer' : 'desktop-dialog'}>
            {shouldUseMobileDrawer ? (
                // Mobile: Drawer (bottom sheet) - use Drawer's convenience API
                <Drawer
                    open={open}
                    onOpenChange={onOpenChange}
                    shouldScaleBackground
                    modal={properties.modal}
                    variant={variant}
                    accessibilityTitle={properties.accessibilityTitle}
                    accessibilityDescription={properties.accessibilityDescription}
                    trigger={properties.trigger}
                    className={properties.className}
                    overlayClassName={properties.overlayClassName}
                    header={properties.header}
                    body={properties.body}
                    footer={properties.footer}
                    headerCloseButton={properties.headerCloseButton}
                    footerCloseButton={properties.footerCloseButton}
                    onOpenAutoFocus={properties.onOpenAutoFocus}
                >
                    {properties.children}
                </Drawer>
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
                            <RadixDialog.Title className="sr-only">{properties.accessibilityTitle}</RadixDialog.Title>
                            <RadixDialog.Description className="sr-only">
                                {properties.accessibilityDescription}
                            </RadixDialog.Description>
                            {properties.header && (
                                <DialogHeader closeButton={properties.headerCloseButton}>
                                    {typeof properties.header === 'string' ? (
                                        <div className="font-medium">{properties.header}</div>
                                    ) : (
                                        properties.header
                                    )}
                                </DialogHeader>
                            )}
                            {properties.body && <DialogBody>{properties.body}</DialogBody>}
                            {properties.children}
                            {(properties.footer !== undefined ||
                                properties.footerCloseButton ||
                                !properties.children) && (
                                <DialogFooter
                                    closeButton={
                                        properties.footerCloseButton ??
                                        (properties.footer === undefined && !properties.children ? true : false)
                                    }
                                >
                                    {properties.footer}
                                </DialogFooter>
                            )}
                        </RadixDialog.Content>
                    </RadixDialog.Portal>
                </RadixDialog.Root>
            )}
        </DialogContext.Provider>
    );
}
