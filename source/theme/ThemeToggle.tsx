'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import Tip from '@structure/source/common/notifications/Tip';

// Dependencies - Styles
import { themeModeLocalStorageKey, themeModeChangeEventIdentifier, ThemeMode } from '@structure/source/theme/Theme';

// Dependencies - Assets
import DesktopIcon from '@structure/assets/icons/technology/DesktopIcon.svg';
import SunIcon from '@structure/assets/icons/nature/SunIcon.svg';
import MoonIcon from '@structure/assets/icons/nature/MoonIcon.svg';

// Component - ThemeToggle
export type ThemeToggleProperties = {};
export function ThemeToggle(properties: ThemeToggleProperties) {
    // State for the theme
    const [themeMode, setThemeMode] = React.useState<ThemeMode>(ThemeMode.System);

    // Handle the client's input
    function handleChangeTheme(themeMode: ThemeMode) {
        // Set the state to the input
        setThemeMode(themeMode);

        // Store the client's preference in local storage
        localStorage.setItem(themeModeLocalStorageKey, themeMode);

        // Emit the event to the browser
        const event = new CustomEvent(themeModeChangeEventIdentifier, { detail: themeMode });
        window.dispatchEvent(event);
    }

    // On mount
    React.useEffect(() => {
        // Get the client's preference
        const themeFromLocalStorage = localStorage.getItem(themeModeLocalStorageKey);

        // If the client has a preference
        if(themeFromLocalStorage) {
            // Set the state to the client's preference
            setThemeMode(themeFromLocalStorage as ThemeMode);
        }
        // If the client does not have a preference
        else {
            // Use the operating system's theme
            setThemeMode(ThemeMode.System);
        }
    }, []);

    // Get a theme mode button for a given theme mode
    function themeModeButton(currentThemeMode: ThemeMode) {
        let IconComponent =
            currentThemeMode === ThemeMode.Light
                ? SunIcon
                : currentThemeMode === ThemeMode.Dark
                  ? MoonIcon
                  : DesktopIcon;

        return (
            <Tip sideOffset={8} content={<div className="px-2 py-1 text-xs">{currentThemeMode} Theme</div>}>
                <button
                    tabIndex={1} // Leave tab index as 1, tabs will happen in the order of the buttons
                    onClick={() => handleChangeTheme(currentThemeMode)}
                    className={`rounded-full transition-colors hover:text-dark dark:hover:text-light ${
                        themeMode === currentThemeMode && 'bg-light-3 text-dark dark:bg-dark-4 dark:text-light'
                    }`}
                >
                    <IconComponent className="m-1.5 h-3.5 w-3.5" />
                </button>
            </Tip>
        );
    }

    // Render the component
    return (
        <div className="transition-color flex w-min items-center justify-center space-x-0.5 rounded-full border border-dark-4/50 p-1 text-dark-4/50 dark:border-dark-4 dark:text-light-6">
            {themeModeButton(ThemeMode.System)}
            {themeModeButton(ThemeMode.Light)}
            {themeModeButton(ThemeMode.Dark)}
        </div>
    );
}

// Export - Default
export default ThemeToggle;
