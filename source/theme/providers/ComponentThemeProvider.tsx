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
import type { DrawerThemeConfiguration } from '@structure/source/components/drawers/DrawerTheme';
import type { BadgeThemeConfiguration } from '@structure/source/components/badges/BadgeTheme';
import type { NoticeThemeConfiguration } from '@structure/source/components/notices/NoticeTheme';
import type { CardThemeConfiguration } from '@structure/source/components/containers/CardTheme';
import type { InputTextThemeConfiguration } from '@structure/source/components/forms-new/fields/text/InputTextTheme';
import type { InputTextAreaThemeConfiguration } from '@structure/source/components/forms-new/fields/text-area/InputTextAreaTheme';
import type { InputCheckboxThemeConfiguration } from '@structure/source/components/forms-new/fields/checkbox/InputCheckboxTheme';
import type { InputSelectThemeConfiguration } from '@structure/source/components/forms-new/fields/select/InputSelectTheme';
import type { DeepPartialTheme } from '@structure/source/theme/utilities/ThemeUtilities';

// Type - Component Theme Context Value
interface ComponentThemeContextValue {
    Button?: DeepPartialTheme<ButtonThemeConfiguration>;
    Toggle?: DeepPartialTheme<ToggleThemeConfiguration>;
    ToggleGroup?: DeepPartialTheme<ToggleGroupThemeConfiguration>;
    Link?: DeepPartialTheme<LinkThemeConfiguration>;
    Tabs?: DeepPartialTheme<TabsThemeConfiguration>;
    Popover?: DeepPartialTheme<PopoverThemeConfiguration>;
    Dialog?: DeepPartialTheme<DialogThemeConfiguration>;
    Drawer?: DeepPartialTheme<DrawerThemeConfiguration>;
    Badge?: DeepPartialTheme<BadgeThemeConfiguration>;
    Notice?: DeepPartialTheme<NoticeThemeConfiguration>;
    Card?: DeepPartialTheme<CardThemeConfiguration>;
    InputText?: DeepPartialTheme<InputTextThemeConfiguration>;
    InputTextArea?: DeepPartialTheme<InputTextAreaThemeConfiguration>;
    InputCheckbox?: DeepPartialTheme<InputCheckboxThemeConfiguration>;
    InputSelect?: DeepPartialTheme<InputSelectThemeConfiguration>;
    // Future component themes:
    // Table?: DeepPartialTheme<TableThemeConfiguration>;
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
