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
import { DrawerContent } from './DrawerContent';
import { DrawerPortal } from './DrawerPortal';
import { DrawerHeader } from './DrawerHeader';
import { DrawerBody } from './DrawerBody';
import { DrawerFooter } from './DrawerFooter';

// Dependencies - Utilities
import { mergeClassNames, createVariantClassNames } from '@structure/source/utilities/style/ClassName';

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
            <DrawerRootComponent
                direction={direction}
                open={open}
                onOpenChange={onOpenChange}
                shouldScaleBackground={properties.shouldScaleBackground ?? false}
                modal={properties.modal}
            >
                <DrawerNestedContext.Provider value={{ value: isNestedDrawer ? 2 : 1 }}>
                    {properties.trigger && <DrawerTrigger>{properties.trigger}</DrawerTrigger>}
                    <DrawerPortal>
                        <DrawerOverlay
                            className={mergeClassNames(
                                drawerTheme.configuration.overlayClasses,
                                properties.overlayClassName,
                            )}
                        />
                        <DrawerContent
                            className={mergeClassNames(
                                drawerVariantClassNames({
                                    variant: variant,
                                    side: side,
                                }),
                                properties.className,
                            )}
                            accessibilityTitle={properties.accessibilityTitle}
                            accessibilityDescription={properties.accessibilityDescription}
                            onOpenAutoFocus={properties.onOpenAutoFocus}
                            onCloseAutoFocus={properties.onCloseAutoFocus}
                        >
                            {properties.header && (
                                <DrawerHeader closeButton={properties.headerCloseButton}>
                                    {typeof properties.header === 'string' ? (
                                        <div className="font-medium">{properties.header}</div>
                                    ) : (
                                        properties.header
                                    )}
                                </DrawerHeader>
                            )}
                            {properties.body && <DrawerBody>{properties.body}</DrawerBody>}
                            {properties.children}
                            {(properties.footer !== undefined || !properties.children) && (
                                <DrawerFooter closeButton={properties.footerCloseButton}>
                                    {properties.footer}
                                </DrawerFooter>
                            )}
                        </DrawerContent>
                    </DrawerPortal>
                </DrawerNestedContext.Provider>
            </DrawerRootComponent>
        </DrawerContext.Provider>
    );
}
