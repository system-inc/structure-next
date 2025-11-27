'use client'; // The component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlPath } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { Drawer } from '@structure/source/components/drawers/Drawer';
import { NavigationDrawerBody, NavigationDrawerBodyProperties } from './NavigationDrawerBody';

// Dependencies - Assets
import { ListIcon } from '@phosphor-icons/react/ssr';

// Component - NavigationDrawer
export interface NavigationDrawerProperties {
    header?: React.ReactNode;
    navigationLinks: NavigationDrawerBodyProperties['navigationLinks'];
    footer?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}
export function NavigationDrawer(properties: NavigationDrawerProperties) {
    // Hooks
    const urlPath = useUrlPath();

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
    function closeDrawer() {
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
        <Drawer
            variant="A"
            className=""
            side="Left"
            accessibilityTitle="Navigation Menu"
            accessibilityDescription="Browse the main sections of the website."
            trigger={<Button variant="Ghost" size="Icon" icon={ListIcon} className="rounded-full md:hidden" />}
            header={properties.header}
            body={<NavigationDrawerBody navigationLinks={properties.navigationLinks} closeDrawer={closeDrawer} />}
            footerCloseButton={false}
            footer={properties.footer}
            open={isOpen}
            onOpenChange={handleOpenChange}
        />
    );
}
