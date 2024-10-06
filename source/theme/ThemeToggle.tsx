'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import Tip from '@structure/source/common/popovers/Tip';

// Dependencies - Styles
import { themeModeLocalStorageKey, themeModeChangeEventIdentifier, ThemeMode } from '@structure/source/theme/Theme';

// Dependencies - Assets
import DesktopIcon from '@structure/assets/icons/technology/DesktopIcon.svg';
import SunIcon from '@structure/assets/icons/nature/SunIcon.svg';
import MoonIcon from '@structure/assets/icons/nature/MoonIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - ThemeToggle
export interface ThemeToggleProperties {
    className?: string;
}
export function ThemeToggle(properties: ThemeToggleProperties) {
    // State for the theme
    const [themeMode, setThemeMode] = React.useState<ThemeMode>(ThemeMode.System);

    // Handle the client's input
    function handleChangeThemeMode(themeMode: ThemeMode) {
        console.log('handleChangeTheme', themeMode);

        // Set the state to the input
        setThemeMode(themeMode);

        // Store the client's preference in local storage
        localStorage.setItem(themeModeLocalStorageKey, themeMode);

        // Emit the event to the browser
        const event = new CustomEvent(themeModeChangeEventIdentifier, { detail: themeMode });
        window.dispatchEvent(event);
    }

    // Handle another tab changing the theme mode
    function handleLocalStorageChange(event: StorageEvent) {
        // If the event is for the theme mode
        if(event.key === themeModeLocalStorageKey) {
            // Set the state to the new theme mode
            setThemeMode(event.newValue as ThemeMode);
        }
    }

    // On mount
    React.useEffect(function () {
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

        // Add a listener for changes in local storage
        window.addEventListener('storage', handleLocalStorageChange);

        // On unmount
        return function () {
            // Remove the listener for changes in local storage
            window.removeEventListener('storage', handleLocalStorageChange);
        };
    }, []);

    // Get a theme mode button for a given theme mode
    function themeModeButton(currentThemeMode: ThemeMode) {
        const IconComponent =
            currentThemeMode === ThemeMode.Light
                ? SunIcon
                : currentThemeMode === ThemeMode.Dark
                  ? MoonIcon
                  : DesktopIcon;

        return (
            <Tip sideOffset={8} content={<div className="px-2 py-1 text-xs">{currentThemeMode} Theme</div>}>
                <button
                    className={`rounded-full transition-colors hover:text-dark dark:hover:text-light ${
                        themeMode === currentThemeMode && 'bg-light-3 text-dark dark:bg-dark-4 dark:text-light'
                    }`}
                    tabIndex={1} // Leave tab index as 1, tabs will happen in the order of the buttons
                    onClick={function () {
                        handleChangeThemeMode(currentThemeMode);
                    }}
                >
                    <IconComponent className="m-1.5 h-3.5 w-3.5" />
                </button>
            </Tip>
        );
    }

    // Render the component
    return (
        <div
            className={mergeClassNames(
                'transition-color flex w-min items-center justify-center space-x-0.5 rounded-full border border-dark-4/50 p-1 text-dark-4/50 dark:border-dark-4 dark:text-light-6',
                properties.className,
            )}
        >
            {themeModeButton(ThemeMode.System)}
            {themeModeButton(ThemeMode.Light)}
            {themeModeButton(ThemeMode.Dark)}
        </div>
    );
}

// Export - Default
export default ThemeToggle;
