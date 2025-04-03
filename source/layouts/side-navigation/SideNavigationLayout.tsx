'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import dynamic from 'next/dynamic';

// Dependencies - Main Components

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

// Component - SideNavigationLayout
export interface SideNavigationLayoutInterface {
    identifier: string;
    navigation: React.ReactNode;
    contentBody: React.ReactNode;
    children?: React.ReactNode;
    topBar?: boolean;
    topTitle?: React.ReactNode;
}
export function SideNavigationLayout(properties: SideNavigationLayoutInterface) {
    // Render the component
    return (
        <>
            {/* Navigation */}
            <SideNavigationLayoutNavigation
                layoutIdentifier={properties.identifier}
                topBar={properties.topBar}
                topTitle={properties.topTitle}
            >
                {properties.navigation}
            </SideNavigationLayoutNavigation>

            {/* Content */}
            <SideNavigationLayoutContent
                layoutIdentifier={properties.identifier}
                topTitle={properties.topTitle}
            >
                <SideNavigationLayoutContentBody>{properties.contentBody}</SideNavigationLayoutContentBody>
            </SideNavigationLayoutContent>

            {/* Children */}
            {properties.children}
        </>
    );
}

// Export - Default
export default SideNavigationLayout;
