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
    // Render the component
    return (
        <AuthorizationLayout>
            {/* Navigation */}
            <SideNavigationLayoutNavigation layoutIdentifier={internalLayoutIdentifier} topBar={true}>
                <InternalNavigation />
            </SideNavigationLayoutNavigation>

            {/* Content */}
            <SideNavigationLayoutContent layoutIdentifier={internalLayoutIdentifier}>
                <SideNavigationLayoutContentBody className="px-8 py-6">
                    {properties.children}
                </SideNavigationLayoutContentBody>
            </SideNavigationLayoutContent>

            {/* Dialog Menu */}
            <InternalDialogMenu />
        </AuthorizationLayout>
    );
}

// Export - Default
export default InternalLayout;
