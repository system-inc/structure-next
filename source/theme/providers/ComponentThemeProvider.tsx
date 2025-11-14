'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Theme
import type { ButtonThemeConfiguration } from '@structure/source/components/buttons/ButtonTheme';
import type { ToggleThemeConfiguration } from '@structure/source/components/buttons/ToggleTheme';
import type { ToggleGroupThemeConfiguration } from '@structure/source/components/buttons/ToggleGroupTheme';
import type { LinkThemeConfiguration } from '@structure/source/components/navigation/LinkTheme';
import type { TabsThemeConfiguration } from '@structure/source/components/navigation/tabs/TabsTheme';
import type { PopoverThemeConfiguration } from '@structure/source/components/popovers/PopoverTheme';
import type { DialogThemeConfiguration } from '@structure/source/components/dialogs/DialogTheme';
import type { BadgeThemeConfiguration } from '@structure/source/components/notifications/BadgeTheme';
import type { AlertThemeConfiguration } from '@structure/source/components/notifications/AlertTheme';
import type { InputTextThemeConfiguration } from '@structure/source/components/forms-new/fields/text/InputTextTheme';
import type { InputTextAreaThemeConfiguration } from '@structure/source/components/forms-new/fields/text-area/InputTextAreaTheme';
import type { InputCheckboxThemeConfiguration } from '@structure/source/components/forms-new/fields/checkbox/InputCheckboxTheme';
import type { DeepPartialComponentTheme } from '@structure/source/theme/utilities/ThemeUtilities';

// Type - Component Theme Context Value
interface ComponentThemeContextValue {
    Button?: DeepPartialComponentTheme<ButtonThemeConfiguration>;
    Toggle?: DeepPartialComponentTheme<ToggleThemeConfiguration>;
    ToggleGroup?: DeepPartialComponentTheme<ToggleGroupThemeConfiguration>;
    Link?: DeepPartialComponentTheme<LinkThemeConfiguration>;
    Tabs?: DeepPartialComponentTheme<TabsThemeConfiguration>;
    Popover?: DeepPartialComponentTheme<PopoverThemeConfiguration>;
    Dialog?: DeepPartialComponentTheme<DialogThemeConfiguration>;
    Badge?: DeepPartialComponentTheme<BadgeThemeConfiguration>;
    Alert?: DeepPartialComponentTheme<AlertThemeConfiguration>;
    InputText?: DeepPartialComponentTheme<InputTextThemeConfiguration>;
    InputTextArea?: DeepPartialComponentTheme<InputTextAreaThemeConfiguration>;
    InputCheckbox?: DeepPartialComponentTheme<InputCheckboxThemeConfiguration>;
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
