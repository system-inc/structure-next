'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import dynamic from 'next/dynamic';

// Dependencies - Main Components
// import { SideNavigationLayoutNavigation } from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigation';
// import { SideNavigationLayoutContent } from '@structure/source/layouts/side-navigation/SideNavigationLayoutContent';
// import { SideNavigationLayoutContentBody } from '@structure/source/layouts/side-navigation/SideNavigationLayoutContentBody';
import { OpsNavigation } from '@structure/source/ops/layouts/navigation/OpsNavigation';
import { OpsDialogMenu } from '@structure/source/ops/layouts/navigation/OpsDialogMenu';

// Import SideNavigation components with next/dynamic to avoid server-side rendering
// We can't SSR these because they use localStorage and window.innerWidth to render the navigation state
// The side and top navigation components cause hydration mismatch errors if they are SSR'd
// Dependencies - Side Navigation Components
const SideNavigationLayoutContent = dynamic(
    () => import('@structure/source/layouts/side-navigation/SideNavigationLayoutContent'),
    { ssr: false },
);
const SideNavigationLayoutContentBody = dynamic(
    () => import('@structure/source/layouts/side-navigation/SideNavigationLayoutContentBody'),
    { ssr: false },
);
const SideNavigationLayoutNavigation = dynamic(
    () => import('@structure/source/layouts/side-navigation/SideNavigationLayoutNavigation'),
    { ssr: false },
);

// Settings
export const internalLayoutIdentifier = 'Internal';

// Component - InternalLayout
export interface InternalLayoutProperties {
    children: React.ReactNode;
}
export function InternalLayout(properties: InternalLayoutProperties) {
    // Effect to adjust the background color of the body on mount
    // We want the navigation to be dark but the content to be a bit lighter
    // React.useEffect(function () {
    //     // Remove the darker backgrounds and add a lighter one
    //     // document.body.classList.remove('dark:bg-dark');
    //     // document.body.classList.remove('dark:bg-dark-1');
    //     // document.body.classList.add('dark:bg-[#1C1C1C]');
    // }, []);

    // Render the component
    return (
        <>
            {/* Navigation */}
            <SideNavigationLayoutNavigation layoutIdentifier={internalLayoutIdentifier} topBar={true}>
                <OpsNavigation />
            </SideNavigationLayoutNavigation>

            {/* Content */}
            <SideNavigationLayoutContent layoutIdentifier={internalLayoutIdentifier} topTitle="Internal">
                <SideNavigationLayoutContentBody>{properties.children}</SideNavigationLayoutContentBody>
            </SideNavigationLayoutContent>

            {/* Dialog Menu */}
            <OpsDialogMenu />
        </>
    );
}

// Export - Default
export default InternalLayout;
