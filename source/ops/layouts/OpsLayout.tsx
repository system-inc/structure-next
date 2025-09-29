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

            {/* Content - Takes remaining space */}
            <div className="flex-1 overflow-auto">{properties.children}</div>

            {/* Dialog Menu */}
            {/* <OpsDialogMenu /> */}
        </div>
    );
}
