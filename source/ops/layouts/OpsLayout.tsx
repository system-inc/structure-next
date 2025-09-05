'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
// import dynamic from 'next/dynamic';

// Dependencies - Main Components
// import { SideNavigationLayoutNavigation } from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigation';
// import { SideNavigationLayoutContent } from '@structure/source/layouts/side-navigation/SideNavigationLayoutContent';
// import { SideNavigationLayoutContentBody } from '@structure/source/layouts/side-navigation/SideNavigationLayoutContentBody';
// import { OpsDialogMenu } from '@structure/source/ops/layouts/navigation/OpsDialogMenu';
import { OpsNavigationBar } from './OpsNavigationBar';

// Import SideNavigation components with next/dynamic to avoid server-side rendering
// We can't SSR these because they use localStorage and window.innerWidth to render the navigation state
// The side and top navigation components cause hydration mismatch errors if they are SSR'd
// Dependencies - Side Navigation Components
// const SideNavigationLayoutContent = dynamic(
//     async function () {
//         return (await import('@structure/source/layouts/side-navigation/SideNavigationLayoutContent'))
//             .SideNavigationLayoutContent;
//     },
//     { ssr: false },
// );
// const SideNavigationLayoutContentBody = dynamic(
//     async function () {
//         return (await import('@structure/source/layouts/side-navigation/SideNavigationLayoutContentBody'))
//             .SideNavigationLayoutContentBody;
//     },
//     { ssr: false },
// );
// const SideNavigationLayoutNavigation = dynamic(
//     async function () {
//         return (await import('@structure/source/layouts/side-navigation/SideNavigationLayoutNavigation'))
//             .SideNavigationLayoutNavigation;
//     },
//     { ssr: false },
// );

// Settings
// export const opsLayoutIdentifier = 'Ops';

// Component - InternalLayout
export interface OpsLayoutProperties {
    children: React.ReactNode;
}
export function OpsLayout(properties: OpsLayoutProperties) {
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
            {/*<SideNavigationLayoutNavigation layoutIdentifier={opsLayoutIdentifier} topBar={true}>
                <OpsNavigation />
            </SideNavigationLayoutNavigation>*/}

            <OpsNavigationBar />

            {/* Content */}
            {/*<SideNavigationLayoutContent layoutIdentifier={opsLayoutIdentifier}>*/}
            {/*<SideNavigationLayoutContentBody>*/}
            {properties.children}
            {/*</SideNavigationLayoutContentBody>*/}
            {/*</SideNavigationLayoutContent>*/}

            {/* Dialog Menu */}
            {/* <OpsDialogMenu /> */}
        </>
    );
}
