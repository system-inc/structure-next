'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Drawer as VaulDrawer } from 'vaul';

// Dependencies - Theme
import { drawerTheme as structureDrawerTheme } from './DrawerTheme';
import type { DrawerSide, DrawerVariant } from './DrawerTheme';
import { useComponentTheme } from '@structure/source/theme/providers/ComponentThemeProvider';
import { mergeComponentTheme } from '@structure/source/theme/utilities/ThemeUtilities';

// Dependencies - Context
import { DrawerContext, DrawerNestedContext, useIsNestedDrawer } from './DrawerContext';
import { DrawerTrigger } from './DrawerTrigger';
import { DrawerOverlay } from './DrawerOverlay';
import { DrawerPortal } from './DrawerPortal';
import { DrawerHeader } from './DrawerHeader';
import { DrawerBody } from './DrawerBody';
import { DrawerFooter } from './DrawerFooter';

// Dependencies - Utilities
import { mergeClassNames, createVariantClassNames } from '@structure/source/utilities/style/ClassName';
import { focusFirstFocusableElement } from '@structure/source/utilities/react/React';

// Component - DrawerRoot
export interface DrawerRootProperties {
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
    shouldScaleBackground?: boolean;
    onOpenAutoFocus?: (event: Event) => void;
    onCloseAutoFocus?: (event: Event) => void;

    // Theme
    variant?: DrawerVariant;
    side?: DrawerSide;

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
export function DrawerRoot(properties: DrawerRootProperties) {
    // Get component theme from context
    const componentTheme = useComponentTheme();

    // Merge the structure theme with project theme
    const drawerTheme = mergeComponentTheme(structureDrawerTheme, componentTheme?.Drawer);

    // Determine variant and side with defaults from configuration
    const variant = properties.variant ?? drawerTheme.configuration.defaultVariant?.variant;
    const side = properties.side ?? drawerTheme.configuration.defaultVariant?.side ?? 'Bottom';

    // Create drawer variant class names function using the merged theme
    const drawerVariantClassNames = createVariantClassNames(drawerTheme.configuration.baseWrapperClasses, {
        variants: {
            variant: drawerTheme.variants,
            side: drawerTheme.sides,
        },
        defaultVariants: drawerTheme.configuration.defaultVariant,
    });

    // Generate unique ID for accessibility
    const drawerId = React.useId();

    // State
    const [open, setOpen] = React.useState(properties.open ?? false);

    // Function to handle the open state change
    function onOpenChange(newOpen: boolean) {
        properties.onOpenChange?.(newOpen);
        setOpen(newOpen);
    }

    // On mount and when properties.open changes, update internal state
    React.useEffect(
        function () {
            setOpen(properties.open ?? false);
        },
        [properties.open],
    );

    // Check if this drawer is nested
    const isNestedDrawer = useIsNestedDrawer();

    // Select the appropriate Vaul component
    const DrawerRootComponent = isNestedDrawer ? VaulDrawer.NestedRoot : VaulDrawer.Root;

    // Determine the direction for Vaul (lowercase required by Vaul API)
    const direction = (side ?? 'Bottom').toLowerCase() as 'top' | 'bottom' | 'left' | 'right';

    // Context value for compound components
    const contextValue = {
        open,
        onOpenChange,
        drawerId,
        drawerTheme,
        variant,
        side,
        isNested: isNestedDrawer,
        onOpenAutoFocus: properties.onOpenAutoFocus,
    };

    // Render the component
    return (
        <DrawerContext.Provider value={contextValue}>
            {/* Vaul Root - Controls drawer state and animations */}
            <DrawerRootComponent
                direction={direction}
                open={open}
                onOpenChange={onOpenChange}
                shouldScaleBackground={properties.shouldScaleBackground ?? false}
                modal={properties.modal}
            >
                <DrawerNestedContext.Provider value={{ value: isNestedDrawer ? 2 : 1 }}>
                    {/* Optional trigger button */}
                    {properties.trigger && <DrawerTrigger>{properties.trigger}</DrawerTrigger>}

                    {/* Portal - Renders drawer content outside the React tree */}
                    <DrawerPortal>
                        {/* Overlay/backdrop */}
                        <DrawerOverlay
                            className={mergeClassNames(
                                drawerTheme.configuration.overlayClasses,
                                properties.overlayClassName,
                            )}
                        />

                        {/* Drawer Content - IMPORTANT: Called directly, not wrapped in a component
                            Wrapping VaulDrawer.Content in a separate component breaks animations
                            because the wrapper re-renders when state changes, interrupting Vaul's
                            exit animation lifecycle. Vaul needs direct control over this element. */}
                        <VaulDrawer.Content
                            className={mergeClassNames(
                                drawerVariantClassNames({
                                    variant: variant,
                                    side: side,
                                }),
                                properties.className,
                            )}
                            data-drawer-id={drawerId}
                            onOpenAutoFocus={function (event) {
                                // Custom focus handler or default behavior
                                if(properties.onOpenAutoFocus) {
                                    properties.onOpenAutoFocus(event);
                                }
                                else {
                                    // Prevent default to avoid keeping focus on trigger button
                                    // (which gets aria-hidden when drawer opens, causing a11y warnings)
                                    event.preventDefault();
                                    // Focus first focusable element inside drawer instead
                                    focusFirstFocusableElement(`[data-drawer-id="${drawerId}"]`);
                                }
                            }}
                            onCloseAutoFocus={properties.onCloseAutoFocus}
                        >
                            {/* Accessibility - Screen reader only title and description */}
                            <VaulDrawer.Title className="sr-only">{properties.accessibilityTitle}</VaulDrawer.Title>
                            <VaulDrawer.Description className="sr-only">
                                {properties.accessibilityDescription}
                            </VaulDrawer.Description>

                            {/* Optional header section */}
                            {properties.header && (
                                <DrawerHeader closeButton={properties.headerCloseButton}>
                                    {typeof properties.header === 'string' ? (
                                        <div className="font-medium">{properties.header}</div>
                                    ) : (
                                        properties.header
                                    )}
                                </DrawerHeader>
                            )}

                            {/* Optional body section */}
                            {properties.body && <DrawerBody>{properties.body}</DrawerBody>}

                            {/* Custom children (rendered between body and footer) */}
                            {properties.children}

                            {/* Optional footer section - only rendered if there's content or a close button */}
                            {(properties.footer || properties.footerCloseButton) && (
                                <DrawerFooter closeButton={properties.footerCloseButton}>
                                    {properties.footer}
                                </DrawerFooter>
                            )}
                        </VaulDrawer.Content>
                    </DrawerPortal>
                </DrawerNestedContext.Provider>
            </DrawerRootComponent>
        </DrawerContext.Provider>
    );
}
