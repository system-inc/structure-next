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

// Dependencies - Utilities
import { Cookies } from '@structure/source/utilities/cookie/Cookies';

// Function to set the theme class name on the DOM
function setThemeClassName(themeClassName: string) {
    // Remove all scheme-* classes
    document.documentElement.classList.remove('scheme-light', 'scheme-dark', 'scheme-light-dark');

    // Add the new scheme class
    document.documentElement.classList.add(themeClassName);
}

// Shared State - Theme (Synchronized with Local Storage)
const themeAtomWithStorage = atomWithStorage<Theme>(
    themeKey, // Local storage Key
    Theme.OperatingSystem, // Initial value (overridden by local storage values)
    undefined, // Custom storage (change if you want to use something other than localStorage)
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
        // If OperatingSystem theme is selected, use actual OS preference
        if(theme === Theme.OperatingSystem) {
            const operatingSystemDarkThemeQuery = window.matchMedia(darkThemeMediaQueryString);
            const isDark = operatingSystemDarkThemeQuery.matches;
            const schemeClass = isDark ? 'scheme-dark' : 'scheme-light';
            setThemeClassName(schemeClass);
        }
        else {
            // For Light or Dark, use the direct mapping
            const schemeClass = ThemeClassName[theme];
            setThemeClassName(schemeClass);
        }
    }

    // Set the theme
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

        // If the theme is OperatingSystem, set scheme-dark or scheme-light based on OS preference
        // This allows both light-dark() CSS function AND Tailwind's dark: classes to work
        if(globalStore.get(readOnlyThemeAtom) === Theme.OperatingSystem) {
            const osBasedSchemeClass =
                operatingSystemTheme === OperatingSystemTheme.Dark ? 'scheme-dark' : 'scheme-light';
            setThemeClassName(osBasedSchemeClass);
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
