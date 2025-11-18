'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Context - ResponsivePopoverDrawerContext
export interface ResponsivePopoverDrawerContextValue {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isMobile: boolean;
}

// Create ResponsivePopoverDrawer Context
export const ResponsivePopoverDrawerContext = React.createContext<ResponsivePopoverDrawerContextValue | null>(null);

// Hook - useResponsivePopoverDrawerContext
export function useResponsivePopoverDrawerContext() {
    const context = React.useContext(ResponsivePopoverDrawerContext);
    if(!context) {
        throw new Error(
            'ResponsivePopoverDrawer compound components must be used within a ResponsivePopoverDrawer component',
        );
    }
    return context;
}
