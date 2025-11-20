'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Shared State
import { useAtomValue, useSetAtom } from 'jotai';

// Dependencies - Theme
import { Theme } from '@structure/source/theme/ThemeTypes';
import { readOnlyThemeAtom, setThemeAtom } from '@structure/source/theme/ThemeProvider';

// Dependencies - Main Components
import { Tabs } from '@structure/source/components/navigation/tabs/Tabs';
import { TabItem } from '@structure/source/components/navigation/tabs/TabItem';
import type { TabsSize } from '@structure/source/components/navigation/tabs/TabsTheme';

// Dependencies - Assets
import { LaptopIcon, SunIcon, MoonIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { ClientOnly } from '@structure/source/utilities/react/ClientOnly';

// Component - ThemeToggle
export interface ThemeToggleProperties {
    size?: TabsSize;
}
export function ThemeToggle(properties: ThemeToggleProperties) {
    // Shared State
    const theme = useAtomValue(readOnlyThemeAtom);
    const setTheme = useSetAtom(setThemeAtom);

    // Defaults
    const size = properties.size ?? 'Small';
    const tabsDefaultValue = theme ?? Theme.OperatingSystem;

    // Function to handle the user changing the theme
    function handleChangeTheme(theme: Theme) {
        setTheme(theme);
    }

    // Render the component
    return (
        <ClientOnly>
            <Tabs
                size={size === 'Small' ? 'IconSmall' : 'Icon'}
                value={tabsDefaultValue}
                onValueChange={function (value) {
                    handleChangeTheme(value as Theme);
                }}
            >
                <TabItem value={Theme.OperatingSystem} icon={LaptopIcon} />
                <TabItem value={Theme.Light} icon={SunIcon} />
                <TabItem value={Theme.Dark} icon={MoonIcon} />
            </Tabs>
        </ClientOnly>
    );
}
