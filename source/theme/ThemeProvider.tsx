'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Shared State
import { atom, useAtomValue } from 'jotai';
import { atomWithStorage, RESET as atomReset } from 'jotai/utils';
import { globalStore } from '@structure/source/utilities/shared-state/SharedStateProvider';

// Dependencies - Theme
import { Theme, OperatingSystemTheme, ThemeClassName } from '@structure/source/theme/ThemeTypes';
import { themeKey, operatingSystemThemeKey, darkThemeMediaQueryString } from '@structure/source/theme/ThemeSettings';

// Dependencies - Services
import { localStorageService } from '@structure/source/services/local-storage/LocalStorageService';

// Dependencies - Utilities
import { Cookies } from '@structure/source/utilities/cookie/Cookies';

// Function to resolve a theme to its actual scheme class name
// When theme is OperatingSystem, uses the provided OS theme to determine the class
export function getThemeClassName(theme: Theme, operatingSystemTheme?: OperatingSystemTheme): string {
    if(theme === Theme.OperatingSystem) {
        return operatingSystemTheme === OperatingSystemTheme.Dark
            ? ThemeClassName[Theme.Dark]
            : ThemeClassName[Theme.Light];
    }
    return ThemeClassName[theme];
}

// Function to set the theme class name on the DOM
function setThemeClassName(themeClassName: string) {
    // Remove all scheme-* classes
    document.documentElement.classList.remove('scheme-light', 'scheme-dark', 'scheme-light-dark');

    // Add the new scheme class
    document.documentElement.classList.add(themeClassName);
}

// Function to apply a theme to the DOM (resolves Theme enum to actual scheme class)
function applyThemeToDom(theme: Theme) {
    // Determine the current OS theme preference
    const operatingSystemDarkThemeQuery = window.matchMedia(darkThemeMediaQueryString);
    const operatingSystemTheme = operatingSystemDarkThemeQuery.matches
        ? OperatingSystemTheme.Dark
        : OperatingSystemTheme.Light;

    // Get the resolved scheme class and apply it
    const schemeClass = getThemeClassName(theme, operatingSystemTheme);
    setThemeClassName(schemeClass);
}

// Shared State - Theme (Synchronized with Local Storage)
// Custom storage implementation enables cross-tab synchronization
const themeAtomWithStorage = atomWithStorage<Theme>(
    themeKey,
    Theme.OperatingSystem, // Initial value (overridden by local storage values)
    {
        getItem: function (key: string, initialValue: Theme): Theme {
            const storedValue = localStorageService.get<Theme>(key);
            return storedValue ?? initialValue;
        },
        setItem: function (key: string, value: Theme): void {
            localStorageService.set(key, value);
        },
        removeItem: function (key: string): void {
            localStorageService.remove(key);
        },
        subscribe: function (key: string, callback: (value: Theme) => void, initialValue: Theme) {
            // Cross-tab synchronization via storage events
            // Listens for storage events from other browser tabs and applies theme changes
            // This ensures all tabs stay in sync when theme is changed in any tab
            function handleStorageChange(event: StorageEvent) {
                // Get the prefixed key that localStorageService uses
                const prefixedKey = localStorageService.getPrefixedKey(key);

                if(event.key === prefixedKey && event.newValue) {
                    try {
                        // localStorageService wraps values in { value: ... }
                        const wrapped = JSON.parse(event.newValue) as { value: Theme };
                        const newTheme = wrapped.value;

                        // Apply theme to DOM in this tab
                        applyThemeToDom(newTheme);

                        // Update the atom state
                        callback(newTheme);
                    }
                    catch(error) {
                        console.error('[ThemeStorage] Failed to parse storage event:', error);
                    }
                }
                else if(event.key === prefixedKey && event.newValue === null) {
                    // Key was removed, reset to initial value
                    applyThemeToDom(initialValue);
                    callback(initialValue);
                }
            }

            window.addEventListener('storage', handleStorageChange);

            // Return cleanup function
            return function () {
                window.removeEventListener('storage', handleStorageChange);
            };
        },
    },
    {
        getOnInit: true, // Initialize atom prior to React initial hydration (prevents flashing)
    },
);

// Shared State - Read-only Theme
export const readOnlyThemeAtom = atom(function (get) {
    return get(themeAtomWithStorage);
});

// Shared State - setThemeAtom
export const setThemeAtom = atom(null, function (get, set, theme: Theme) {
    if(typeof window !== 'undefined') {
        applyThemeToDom(theme);
    }

    // Set the theme (atomWithStorage handles localStorage and cross-tab sync)
    set(themeAtomWithStorage, theme ?? atomReset);
});

// Shared State - Operating System Theme
const operatingSystemThemeAtom = atom<OperatingSystemTheme>();
operatingSystemThemeAtom.onMount = function (setOperatingSystemThemeAtom) {
    // Query the operating system theme
    const operatingSystemDarkThemeQuery = window.matchMedia(darkThemeMediaQueryString);

    // Function to handle the operating system theme change
    function handleOperatingSystemThemeChange() {
        // Get the operating system theme using the media query
        const operatingSystemTheme = operatingSystemDarkThemeQuery.matches
            ? OperatingSystemTheme.Dark
            : OperatingSystemTheme.Light;

        // Update the operatingSystemThemeAtom
        setOperatingSystemThemeAtom(operatingSystemTheme);

        // If the user has selected "Operating System" theme, update DOM to match the new OS preference
        if(globalStore.get(readOnlyThemeAtom) === Theme.OperatingSystem) {
            applyThemeToDom(Theme.OperatingSystem);
        }
    }

    // Update DOM class on mount
    handleOperatingSystemThemeChange();

    // Listen for changes to the operating system theme and update the favicon and DOM class
    const abortController = new AbortController();
    operatingSystemDarkThemeQuery.addEventListener('change', handleOperatingSystemThemeChange, {
        signal: abortController.signal,
    });

    // On unmount
    return function () {
        // Abort the event listener
        abortController.abort();
    };
};

// Shared State - Read-only Operating System Theme
export const readOnlyOperatingSystemThemeAtom = atom(function (get) {
    return get(operatingSystemThemeAtom);
});

// Component - ThemeProvider
export interface ThemeProviderProperties {
    children: React.ReactNode;
}
export function ThemeProvider(properties: ThemeProviderProperties) {
    // Shared State
    const theme = useAtomValue(readOnlyThemeAtom);
    const operatingSystemTheme = useAtomValue(readOnlyOperatingSystemThemeAtom);

    // We set cookies to track the theme and operating system theme so we can use them in
    // server-side rendering to prevent the flash of the wrong theme

    // Effect to set the theme cookie when the theme changes
    React.useEffect(
        function () {
            if(theme) {
                // console.log('Setting theme cookie', theme);

                Cookies.set(themeKey, theme, {
                    path: '/',
                    maxAge: 31536000, // 1 year
                    sameSite: 'strict',
                    secure: true,
                });
            }
        },
        [theme],
    );

    // Effect to set the operating system theme cookie when the operating system theme changes
    React.useEffect(
        function () {
            if(operatingSystemTheme) {
                // console.log('Setting operating system theme cookie', operatingSystemTheme);

                Cookies.set(operatingSystemThemeKey, operatingSystemTheme, {
                    path: '/',
                    maxAge: 31536000, // 1 year
                    sameSite: 'strict',
                    secure: true,
                });
            }
        },
        [operatingSystemTheme],
    );

    // Render the children
    return properties.children;
}
