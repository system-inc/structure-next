'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Drawer as VaulDrawer } from 'vaul';
import { Button } from '@structure/source/components/buttons/Button';

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
import { DrawerClose } from './DrawerClose';
import { DrawerPortal } from './DrawerPortal';

// Dependencies - Assets
import { XIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - DrawerRoot
export interface DrawerRootProperties {
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

    // Accessibility
    accessibilityDescription?: string; // Description for screen readers

    // Theme
    variant?: DrawerVariant;
    side?: DrawerSide;

    // Auto close button
    closeButton?: boolean | React.ReactNode; // Auto X in top right

    // Compound components
    children?: React.ReactNode;
}
export function DrawerRoot(properties: DrawerRootProperties) {
    // Get component theme from context
    const componentTheme = useComponentTheme();

    // Merge the structure theme with project theme
    const drawerTheme = mergeComponentTheme(structureDrawerTheme, componentTheme?.Drawer);

    // Determine variant and side with defaults from configuration
    const variant = properties.variant ?? drawerTheme.configuration.defaultVariant?.variant;
    const side = properties.side ?? drawerTheme.configuration.defaultVariant?.side ?? 'Bottom';

    // Get the theme classes for this side and variant
    const sideTheme = drawerTheme.sides[side];
    const variantClasses = variant ? drawerTheme.variants[variant] : '';

    // Combine base wrapper classes with variant and side-specific wrapper classes
    const contentClassNames = mergeClassNames(
        drawerTheme.configuration.baseWrapperClasses,
        variantClasses,
        sideTheme.wrapperClasses,
        properties.className,
    );

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

    // Render close button (auto close button in top right)
    function renderCloseButton(additionalClassName?: string) {
        if(properties.closeButton !== false) {
            // Determine the close button element
            const closeButtonElement =
                properties.closeButton !== true &&
                properties.closeButton !== undefined &&
                React.isValidElement(properties.closeButton) ? (
                    properties.closeButton
                ) : (
                    <Button
                        variant="Ghost"
                        size="IconSmall"
                        icon={XIcon}
                        className={mergeClassNames('absolute top-4 right-4 z-10', additionalClassName)}
                        aria-label="Close"
                    />
                );

            return <DrawerClose>{closeButtonElement}</DrawerClose>;
        }
        return null;
    }

    // Context value for compound components
    const contextValue = {
        open,
        onOpenChange,
        drawerId,
        drawerTheme,
        variant,
        side,
        isNested: isNestedDrawer,
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
                            className={contentClassNames}
                            accessibilityDescription={properties.accessibilityDescription ?? ''}
                            onOpenAutoFocus={properties.onOpenAutoFocus}
                            onCloseAutoFocus={properties.onCloseAutoFocus}
                        >
                            {renderCloseButton()}
                            {properties.children}
                        </DrawerContent>
                    </DrawerPortal>
                </DrawerNestedContext.Provider>
            </DrawerRootComponent>
        </DrawerContext.Provider>
    );
}
