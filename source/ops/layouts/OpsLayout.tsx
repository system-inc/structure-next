'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Theme - Styles
import '@structure/source/theme/styles/variables.css';
import '@structure/source/theme/styles/global.css';
import '@project/app/_theme/styles/theme.css'; // TODO: Do not import stuff from project, fix when revisiting theming

// Dependencies - Main Components
import { OpsNavigationBar } from './OpsNavigationBar';

// Component - InternalLayout
export interface OpsLayoutProperties {
    children: React.ReactNode;
}
export function OpsLayout(properties: OpsLayoutProperties) {
    // Render the component
    return (
        <div className="flex h-screen flex-col overflow-hidden">
            {/* Navigation - Fixed at top */}
            <div className="flex-shrink-0">
                <OpsNavigationBar />
            </div>

            {/* Main Content - Wrapper with padding */}
            <div className="flex min-h-0 flex-1 bg-opsis-background-primary px-2 pb-2 pt-0">
                {/* Content Container - Rounded border box */}
                <div className="flex-1 overflow-auto rounded-lg border border-opsis-border-primary">
                    {properties.children}
                </div>
            </div>

            {/* Dialog Menu */}
            {/* <OpsDialogMenu /> */}
        </div>
    );
}
