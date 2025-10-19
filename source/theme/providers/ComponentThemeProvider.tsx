'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Theme
import type { ButtonThemeConfiguration } from '@structure/source/components/buttons/ButtonTheme';
import type { PopoverThemeConfiguration } from '@structure/source/components/popovers/PopoverTheme';
import type { DialogThemeConfiguration } from '@structure/source/components/dialogs/DialogTheme';
import type { DeepPartialComponentTheme } from '@structure/source/theme/utilities/ThemeUtilities';

// Type - Component Theme Context Value
interface ComponentThemeContextValue {
    Button?: DeepPartialComponentTheme<ButtonThemeConfiguration>;
    Popover?: DeepPartialComponentTheme<PopoverThemeConfiguration>;
    Dialog?: DeepPartialComponentTheme<DialogThemeConfiguration>;
    // Future component themes:
    // Card?: DeepPartialComponentTheme<CardThemeConfiguration>;
    // Table?: DeepPartialComponentTheme<TableThemeConfiguration>;
}

// Context - Component Theme
const ComponentThemeContext = React.createContext<ComponentThemeContextValue | undefined>(undefined);

// Component - ComponentThemeProvider
export interface ComponentThemeProviderProperties {
    theme?: ComponentThemeContextValue;
    children: React.ReactNode;
}
export function ComponentThemeProvider(properties: ComponentThemeProviderProperties) {
    // Render the component
    return (
        <ComponentThemeContext.Provider value={properties.theme}>{properties.children}</ComponentThemeContext.Provider>
    );
}

// Hook - useComponentTheme
export function useComponentTheme() {
    return React.useContext(ComponentThemeContext);
}
