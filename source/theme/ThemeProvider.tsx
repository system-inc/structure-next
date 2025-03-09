'use client'; // This component uses client-only features

// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Shared State
import { atom, useAtomValue } from 'jotai';
import { atomWithStorage, RESET as atomReset } from 'jotai/utils';
import { globalStore } from '@structure/source/utilities/shared-state/SharedStateProvider';

// Dependencies - Theme
import {
    themeKey,
    operatingSystemThemeKey,
    darkThemeMediaQueryString,
    Theme,
    OperatingSystemTheme,
    ThemeClassName,
} from '@structure/source/theme/Theme';

// Dependencies - Utilities
import Cookies from '@structure/source/utilities/cookies/Cookies';

// Function to set the theme class name on the DOM
function setThemeClassName(themeClassName: ThemeClassName) {
    // console.log('setThemeClassName', themeClassName);

    // Light
    if(themeClassName === ThemeClassName.Light) {
        document.documentElement.classList.add(ThemeClassName.Light);
        document.documentElement.classList.remove(ThemeClassName.Dark);
    }
    // Dark
    else if(themeClassName === ThemeClassName.Dark) {
        document.documentElement.classList.add(ThemeClassName.Dark);
        document.documentElement.classList.remove(ThemeClassName.Light);
    }
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
        // Light
        if(theme === Theme.Light) {
            setThemeClassName(ThemeClassName.Light);
        }
        // Dark
        else if(theme === Theme.Dark) {
            setThemeClassName(ThemeClassName.Dark);
        }
        // Operating System
        else if(theme === Theme.OperatingSystem) {
            const operatingSystemTheme = get(readOnlyOperatingSystemThemeAtom);
            setThemeClassName(
                operatingSystemTheme === OperatingSystemTheme.Light ? ThemeClassName.Light : ThemeClassName.Dark,
            );
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
        // console.log('handleOperatingSystemThemeChange');

        // Get the operating system theme using the media query
        const operatingSystemTheme = operatingSystemDarkThemeQuery.matches
            ? OperatingSystemTheme.Dark
            : OperatingSystemTheme.Light;
        // console.log('operatingSystemTheme', operatingSystemTheme);

        // Update the operatingSystemThemeAtom
        setOperatingSystemThemeAtom(operatingSystemTheme);

        // Get the favicon element
        const favicon = document.querySelector('link[rel="icon"]');
        // console.log('favicon', favicon);

        // Determine if the favicon should be light or dark based on the operating system theme
        const faviconHref =
            operatingSystemTheme === OperatingSystemTheme.Dark
                ? ProjectSettings.assets.favicon.dark.location
                : ProjectSettings.assets.favicon.light.location;
        // console.log('faviconHref', faviconHref);

        // Set the favicon href
        favicon?.setAttribute('href', faviconHref);

        // If the theme is OperatingSystem, we need to update the theme class name
        // console.log('globalStore.get(readOnlyThemeAtom)', globalStore.get(readOnlyThemeAtom));
        if(globalStore.get(readOnlyThemeAtom) === Theme.OperatingSystem) {
            // If the operating system theme is light
            if(operatingSystemTheme === OperatingSystemTheme.Light) {
                setThemeClassName(ThemeClassName.Light);
            }
            // If the operating system theme is dark
            else if(operatingSystemTheme === OperatingSystemTheme.Dark) {
                setThemeClassName(ThemeClassName.Dark);
            }
        }
    }

    // Update the favicon and DOM class on mount
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
export interface ThemeProviderInterface {
    children: React.ReactNode;
}
export const ThemeProvider = function (properties: ThemeProviderInterface) {
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
};

// Export - Default
export default ThemeProvider;
