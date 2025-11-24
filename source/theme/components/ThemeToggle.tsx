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
import { Button } from '@structure/source/components/buttons/Button';

// Dependencies - Assets
import { LaptopIcon, SunIcon, MoonIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { ClientOnly } from '@structure/source/utilities/react/ClientOnly';

// Component - ThemeToggle
export interface ThemeToggleProperties {
    className?: string;
}
export function ThemeToggle(properties: ThemeToggleProperties) {
    // Shared State
    const theme = useAtomValue(readOnlyThemeAtom);
    const setTheme = useSetAtom(setThemeAtom);

    // Defaults
    const currentTheme = theme ?? Theme.OperatingSystem;

    // Function to handle the user changing the theme
    function handleChangeTheme(value: string) {
        setTheme(value as Theme);
    }

    // Render the component
    return (
        <ClientOnly>
            <Tabs
                variant="Bubble"
                value={currentTheme}
                onValueChange={handleChangeTheme}
                className={properties.className}
            >
                <Tabs.TabItem value={Theme.Light}>
                    <Button size="Icon" icon={SunIcon} />
                </Tabs.TabItem>
                <Tabs.TabItem value={Theme.Dark}>
                    <Button size="Icon" icon={MoonIcon} />
                </Tabs.TabItem>
                <Tabs.TabItem value={Theme.OperatingSystem}>
                    <Button size="Icon" icon={LaptopIcon} />
                </Tabs.TabItem>
            </Tabs>
        </ClientOnly>
    );
}
