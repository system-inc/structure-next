'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlPath } from '@structure/source/router/Navigation';

// Dependencies - Types
import {
    AccountNavigationLinkInterface,
    AccountNavigationFilterFunction,
} from '@structure/source/modules/account/components/navigation/types/AccountNavigationTypes';

// Dependencies - Hooks
import { useIsMobile } from '@structure/source/utilities/react/hooks/useIsMobile';

// Dependencies - Main Components
import {
    ResponsivePopoverDrawerProperties,
    ResponsivePopoverDrawer,
} from '@structure/source/components/popovers/responsive/ResponsivePopoverDrawer';
import {
    AccountNavigationResponsivePopoverDrawerTriggerButton,
    AccountNavigationResponsivePopoverDrawerTriggerButtonProperties,
} from './AccountNavigationResponsivePopoverDrawerTriggerButton';
import { AccountNavigation } from './AccountNavigation';

// Component - AccountNavigationResponsivePopoverDrawer
export interface AccountNavigationResponsivePopoverDrawerProperties {
    variant?: ResponsivePopoverDrawerProperties['variant'];
    triggerClassName?: string;
    triggerVariant?: AccountNavigationResponsivePopoverDrawerTriggerButtonProperties['variant'];
    signedOutHeader?: React.ReactNode;
    accountNavigationLinks?: AccountNavigationLinkInterface[];
    shouldShowAccountNavigationLink?: AccountNavigationFilterFunction;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}
export function AccountNavigationResponsivePopoverDrawer(
    properties: AccountNavigationResponsivePopoverDrawerProperties,
) {
    // Hooks
    const urlPath = useUrlPath();
    const isMobile = useIsMobile();

    // State
    const [open, setOpen] = React.useState(properties.open ?? false);

    // Use property if provided, otherwise use state
    const isOpen = properties.open !== undefined ? properties.open : open;

    // Function to handle open state change
    function handleOpenChange(value: boolean) {
        setOpen(value);
        properties.onOpenChange?.(value);
    }

    // Function to close the menu
    function close() {
        handleOpenChange(false);
    }

    // Effect to close when the urlPath changes
    React.useEffect(
        function () {
            setOpen(false);
        },
        [urlPath],
    );

    // Render the component
    return (
        <ResponsivePopoverDrawer
            variant={properties.variant ?? (isMobile ? 'A' : 'C')}
            accessibilityTitle="Account Menu"
            accessibilityDescription="Access your account settings, profile, and navigation."
            trigger={
                <AccountNavigationResponsivePopoverDrawerTriggerButton
                    className={properties.triggerClassName}
                    variant={properties.triggerVariant}
                />
            }
            content={
                <AccountNavigation
                    close={close}
                    navigationLinks={properties.accountNavigationLinks || []}
                    shouldShowNavigationLink={properties.shouldShowAccountNavigationLink || (() => true)}
                    signedOutHeader={properties.signedOutHeader}
                />
            }
            popoverProperties={{
                align: 'End',
                contentClassName: 'w-68',
            }}
            drawerProperties={{
                side: 'Right',
                className: '',
            }}
            open={isOpen}
            onOpenChange={handleOpenChange}
        />
    );
}
