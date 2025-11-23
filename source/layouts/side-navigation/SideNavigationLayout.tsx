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
    async function () {
        return (await import('@structure/source/layouts/side-navigation/SideNavigationLayoutContent'))
            .SideNavigationLayoutContent;
    },
    { ssr: false },
);
const SideNavigationLayoutContentBody = dynamic(
    async function () {
        return (await import('@structure/source/layouts/side-navigation/SideNavigationLayoutContentBody'))
            .SideNavigationLayoutContentBody;
    },
    { ssr: false },
);
const SideNavigationLayoutNavigation = dynamic(
    async function () {
        return (await import('@structure/source/layouts/side-navigation/SideNavigationLayoutNavigation'))
            .SideNavigationLayoutNavigation;
    },
    { ssr: false },
);

// Component - SideNavigationLayout
export interface SideNavigationLayoutProperties {
    identifier: string;
    layout?: 'Fixed' | 'Flex'; // Layout mode: 'Fixed' for standalone pages, 'Flex' for nested in flex containers (default: 'Fixed')
    navigation: React.ReactNode;
    contentBody: React.ReactNode;
    children?: React.ReactNode;
    showHeader?: boolean;
    showHeaderBorder?: boolean;
    topTitle?: React.ReactNode;
    navigationClassName?: string; // Additional classes for the navigation sidebar
    contentClassName?: string; // Additional classes for the content area
    defaultNavigationWidth?: number; // Default width of the navigation sidebar in pixels (default: 288)
    minimumNavigationWidth?: number; // Minimum width of the navigation sidebar in pixels (default: 244)
    maximumNavigationWidth?: number; // Maximum width of the navigation sidebar in pixels (default: 488)
    alwaysShowNavigationOnDesktop?: boolean; // When true, prevents navigation from being collapsed or hidden on desktop (mobile behavior unchanged)
}
export function SideNavigationLayout(properties: SideNavigationLayoutProperties) {
    // Defaults
    const layout = properties.layout ?? 'Fixed';

    // Render the component
    // For Flex layout, wrap in a flex container
    // For Fixed layout, render as siblings (navigation overlays content)
    if(layout === 'Flex') {
        return (
            <div className="relative flex h-full w-full">
                {/* Navigation */}
                <SideNavigationLayoutNavigation
                    layoutIdentifier={properties.identifier}
                    layout={layout}
                    showHeader={properties.showHeader}
                    showHeaderBorder={properties.showHeaderBorder}
                    topTitle={properties.topTitle}
                    className={properties.navigationClassName}
                    defaultNavigationWidth={properties.defaultNavigationWidth}
                    minimumNavigationWidth={properties.minimumNavigationWidth}
                    maximumNavigationWidth={properties.maximumNavigationWidth}
                    alwaysShowNavigationOnDesktop={properties.alwaysShowNavigationOnDesktop}
                >
                    {properties.navigation}
                </SideNavigationLayoutNavigation>

                {/* Content */}
                <SideNavigationLayoutContent
                    layoutIdentifier={properties.identifier}
                    layout={layout}
                    showHeader={properties.showHeader}
                    topTitle={properties.topTitle}
                    className={properties.contentClassName}
                    defaultNavigationWidth={properties.defaultNavigationWidth}
                >
                    <SideNavigationLayoutContentBody>{properties.contentBody}</SideNavigationLayoutContentBody>
                </SideNavigationLayoutContent>

                {/* Children */}
                {properties.children}
            </div>
        );
    }

    // Fixed layout - render as siblings
    return (
        <>
            {/* Navigation */}
            <SideNavigationLayoutNavigation
                layoutIdentifier={properties.identifier}
                layout={layout}
                showHeader={properties.showHeader}
                showHeaderBorder={properties.showHeaderBorder}
                topTitle={properties.topTitle}
                className={properties.navigationClassName}
                defaultNavigationWidth={properties.defaultNavigationWidth}
                minimumNavigationWidth={properties.minimumNavigationWidth}
                maximumNavigationWidth={properties.maximumNavigationWidth}
                alwaysShowNavigationOnDesktop={properties.alwaysShowNavigationOnDesktop}
            >
                {properties.navigation}
            </SideNavigationLayoutNavigation>

            {/* Content */}
            <SideNavigationLayoutContent
                layoutIdentifier={properties.identifier}
                layout={layout}
                showHeader={properties.showHeader}
                topTitle={properties.topTitle}
                className={properties.contentClassName}
                defaultNavigationWidth={properties.defaultNavigationWidth}
            >
                <SideNavigationLayoutContentBody>{properties.contentBody}</SideNavigationLayoutContentBody>
            </SideNavigationLayoutContent>

            {/* Children */}
            {properties.children}
        </>
    );
}
