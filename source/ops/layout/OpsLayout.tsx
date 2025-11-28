'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { OpsNavigationBar } from './OpsNavigationBar';

// Component - InternalLayout
export interface OpsLayoutProperties {
    children: React.ReactNode;
}
export function OpsLayout(properties: OpsLayoutProperties) {
    // Render the component
    return (
        <div className="flex h-screen flex-col overflow-hidden dark:bg-[#161616]">
            {/* Navigation - Fixed at top */}
            <div className="shrink-0">
                <OpsNavigationBar />
            </div>

            {/* Main Content - Wrapper with padding */}
            <div className="flex min-h-0 flex-1 px-2 pt-0 pb-2">
                {/* Content Container - Rounded border box */}
                <div className="flex-1 overflow-hidden rounded-lg border border--0 background--0">
                    {properties.children}
                </div>
            </div>

            {/* Dialog Menu */}
            {/* <OpsDialogMenu /> */}
        </div>
    );
}
