// Dependencies - React
import React from 'react';

// Dependencies - Theme
import type { DrawerThemeConfiguration } from './DrawerTheme';
import type { DrawerSide } from './DrawerTheme';

// Drawer Context Interface
export interface DrawerContextValue {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    drawerId: string;
    drawerTheme: DrawerThemeConfiguration;
    side?: DrawerSide;
    isNested: boolean;
}

// Create Drawer Context
export const DrawerContext = React.createContext<DrawerContextValue | null>(null);

// Hook to use Drawer Context
export function useDrawerContext() {
    const context = React.useContext(DrawerContext);
    if(!context) {
        throw new Error('Drawer compound components must be used within a Drawer component');
    }
    return context;
}

// Nested Drawer Context (for nested drawer detection)
export const DrawerNestedContext = React.createContext<{ value: number }>({
    value: 0,
});

// Hook to check if drawer is nested
export function useIsNestedDrawer() {
    try {
        return React.useContext(DrawerNestedContext).value > 0;
    } catch {
        return false;
    }
}
