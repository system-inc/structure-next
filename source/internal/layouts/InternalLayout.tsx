'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { AuthorizationLayout } from '@structure/source/layouts/AuthorizationLayout';
import { SideNavigationLayoutNavigation } from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigation';
import { SideNavigationLayoutContent } from '@structure/source/layouts/side-navigation/SideNavigationLayoutContent';
import { SideNavigationLayoutContentBody } from '@structure/source/layouts/side-navigation/SideNavigationLayoutContentBody';
import { InternalNavigation } from '@structure/source/internal/layouts/navigation/InternalNavigation';
import { InternalDialogMenu } from '@structure/source/internal/layouts/navigation/InternalDialogMenu';

// Settings
export const internalLayoutIdentifier = 'Internal';

// Component - InternalLayout
export interface InternalLayoutInterface {
    children: React.ReactNode;
}
export function InternalLayout(properties: InternalLayoutInterface) {
    // Effect to adjust the background color of the body on mount
    React.useEffect(function () {
        // Remove the other dark backgrounds and add the one we want
        document.body.classList.add('dark:bg-dark');
        document.body.classList.remove('dark:bg-dark-1');
        document.body.classList.remove('dark:bg-dark-2');
    }, []);

    // Render the component
    return (
        <AuthorizationLayout mustBeAdministrator={true}>
            {/* Navigation */}
            <SideNavigationLayoutNavigation layoutIdentifier={internalLayoutIdentifier} topBar={true}>
                <InternalNavigation />
            </SideNavigationLayoutNavigation>

            {/* Content */}
            <SideNavigationLayoutContent layoutIdentifier={internalLayoutIdentifier}>
                <SideNavigationLayoutContentBody>{properties.children}</SideNavigationLayoutContentBody>
            </SideNavigationLayoutContent>

            {/* Dialog Menu */}
            <InternalDialogMenu />
        </AuthorizationLayout>
    );
}

// Export - Default
export default InternalLayout;
