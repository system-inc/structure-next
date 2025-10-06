'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Shared State
import { useAtomValue, useSetAtom } from 'jotai';

// Dependencies - Theme
import { Theme } from '@structure/source/theme/ThemeTypes';
import { readOnlyThemeAtom, setThemeAtom } from '@structure/source/theme/ThemeProvider';

// Dependencies - Main Components
import { Tip } from '@structure/source/common/popovers/Tip';

// Dependencies - Assets
import DesktopIcon from '@structure/assets/icons/technology/DesktopIcon.svg';
import SunIcon from '@structure/assets/icons/nature/SunIcon.svg';
import MoonIcon from '@structure/assets/icons/nature/MoonIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - ThemeToggle
export function ThemeToggle() {
    // Shared State
    const theme = useAtomValue(readOnlyThemeAtom);
    const setTheme = useSetAtom(setThemeAtom);

    // Function to handle the user changing the theme
    function handleChangeTheme(theme: Theme) {
        setTheme(theme);
    }

    // Get a theme mode button for a given theme mode
    function themeModeButton(currentTheme: Theme) {
        const IconComponent =
            currentTheme === Theme.Light ? SunIcon : currentTheme === Theme.Dark ? MoonIcon : DesktopIcon;
        const currentThemeText =
            currentTheme === Theme.Light ? 'Light' : currentTheme === Theme.Dark ? 'Dark' : 'System';

        return (
            <Tip sideOffset={8} content={<div className="px-2 py-1 text-xs">{currentThemeText} Theme</div>}>
                <button
                    className={mergeClassNames(
                        'cursor-pointer rounded-full hover:text-dark dark:hover:text-light',
                        theme === currentTheme && 'bg-light-3 text-dark dark:bg-dark-4 dark:text-light',
                    )}
                    tabIndex={1} // Leave tab index as 1, tabs will happen in the order of the buttons
                    onClick={function () {
                        handleChangeTheme(currentTheme);
                    }}
                >
                    <IconComponent className="m-1.5 h-3.5 w-3.5" />
                </button>
            </Tip>
        );
    }

    // Render the component
    return (
        <div className="transition-color flex w-min items-center justify-center space-x-0.5 rounded-extra-large border border-dark-4/50 p-1 text-dark-4/50 dark:border-dark-4 dark:text-light-6">
            {themeModeButton(Theme.OperatingSystem)}
            {themeModeButton(Theme.Light)}
            {themeModeButton(Theme.Dark)}
        </div>
    );
}
