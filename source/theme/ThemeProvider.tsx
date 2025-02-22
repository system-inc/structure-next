'use client'; // This component uses client-only features

// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Theme
import {
    // themeModeLocalStorageKey,
    // themeModeChangeEventIdentifier,
    // themeClassNameCookieKey,
    // lightThemeClassName,
    // darkThemeClassName,
    // darkThemeMediaQuery,
    ThemeMode,
} from '@structure/source/theme/Theme';

// Dependencies - Utilities
// import Cookies from '@structure/source/utilities/cookies/Cookies';
import { useAtomValue } from 'jotai';
import { readonlySystemThemeAtom, readonlyThemeAtom, root_systemThemeAtom, root_themeAtom } from './ThemeToggle';
import { useHydrateAtoms } from 'jotai/utils';

// Component - ThemeProvider
// export interface ThemeProviderInterface {
//     children: React.ReactNode;
//     themeClassName?: string;
// }
// export function ThemeProvider(properties: ThemeProviderInterface) {
//     // State
//     const [themeClassName, setThemeClassName] = React.useState<string | undefined>(properties.themeClassName);

//     // Function to update the theme
//     const updateThemeClassName = React.useCallback(
//         function () {
//             // console.log('updateTheme');
//             // console.log('localStorage[themeModeKey]', localStorage[themeModeKey]);
//             // console.log(
//             //     `window.matchMedia(darkThemeMediaQuery)`,
//             //     window.matchMedia(darkThemeMediaQuery),
//             // );

//             // Dark mode
//             if(
//                 // If the current theme is dark and the local storage theme mode is not set (left to right order is important here)
//                 (themeClassName === darkThemeClassName && localStorage[themeModeLocalStorageKey] === undefined) ||
//                 // If local storage has the theme mode set to dark
//                 localStorage[themeModeLocalStorageKey] === ThemeMode.Dark ||
//                 // Or if local storage has the theme mode set to system and the client's operating system is set to dark mode
//                 (localStorage[themeModeLocalStorageKey] === ThemeMode.System &&
//                     window.matchMedia(darkThemeMediaQuery).matches) ||
//                 // Or if local storage does not have the theme mode set and the client's operating system is set to dark mode
//                 (localStorage[themeModeLocalStorageKey] === undefined && window.matchMedia(darkThemeMediaQuery).matches)
//             ) {
//                 // console.log('Switching to dark mode');

//                 // Add the dark theme class to the document
//                 document.documentElement.classList.add(darkThemeClassName);

//                 // Set a cookie to remember the client is in dark mode
//                 // We only store the theme class name (not the theme mode) on the cookie, this way
//                 // when the page loads we can use the cookie to know if the client is in dark mode
//                 // right away without needing to check the theme mode in local storage which
//                 // would flash the page in light mode before switching to dark mode if the client
//                 // is in dark mode
//                 Cookies.set(themeClassNameCookieKey, darkThemeClassName, {
//                     path: '/',
//                     maxAge: 31536000, // 1 year
//                     sameSite: 'strict',
//                     secure: true,
//                 });

//                 // Update the theme class name state
//                 setThemeClassName(darkThemeClassName);
//             }
//             // Light mode
//             else {
//                 // console.log('Switching to light mode');

//                 // Remove the dark theme class from the document
//                 document.documentElement.classList.remove(darkThemeClassName);

//                 // Set a cookie to remember the client is in light mode
//                 Cookies.set(themeClassNameCookieKey, lightThemeClassName, {
//                     path: '/',
//                     maxAge: 31536000, // 1 year
//                     sameSite: 'strict',
//                     secure: true,
//                 });

//                 // Update the theme class name state
//                 setThemeClassName(lightThemeClassName);
//             }
//         },
//         [themeClassName],
//     );

//     // Handle changes in local storage, sent by other tabs
//     const handleLocalStorageChange = React.useCallback(
//         function (event: StorageEvent) {
//             // console.log('handleLocalStorageChange', event);
//             if(event.key === themeModeLocalStorageKey) {
//                 updateThemeClassName();
//             }
//         },
//         [updateThemeClassName],
//     );

//     // Function to update the favicon based on the operating system's theme
//     const applyOperatingSystemTheme = React.useCallback(
//         function () {
//             // console.log('handleOperatingSystemThemeChange');

//             // We change the favicon on operating system theme changes, not website theme changes
//             // If the operating system is set to dark mode,
//             if(window.matchMedia(darkThemeMediaQuery).matches) {
//                 // Change the favicon to the dark favicon
//                 document
//                     .querySelector<HTMLLinkElement>('link[rel="icon"]')
//                     ?.setAttribute('href', ProjectSettings.assets.favicon.dark.location);
//             }
//             // If the operating system is set to light mode
//             else {
//                 // Change the favicon to the light favicon
//                 document
//                     .querySelector<HTMLLinkElement>('link[rel="icon"]')
//                     ?.setAttribute('href', ProjectSettings.assets.favicon.light.location);
//             }

//             // Run the theme mode change handler
//             updateThemeClassName();
//         },
//         [updateThemeClassName],
//     );

//     // On mount
//     React.useEffect(
//         function () {
//             // Apply the operating system theme mode to the favicon and theme
//             applyOperatingSystemTheme();

//             // Add theme mode change event listener that calls updateTheme on theme change
//             window.addEventListener(themeModeChangeEventIdentifier, updateThemeClassName);

//             // Add a listener for changes in local storage
//             window.addEventListener('storage', handleLocalStorageChange);

//             // Add a listener for changes in the operating system's theme
//             window.matchMedia(darkThemeMediaQuery).addEventListener('change', applyOperatingSystemTheme);

//             // On unmount
//             return function () {
//                 // Remove theme mode change event listener
//                 window.removeEventListener(themeModeChangeEventIdentifier, updateThemeClassName);

//                 // Remove the listener for changes in local storage
//                 window.removeEventListener('storage', handleLocalStorageChange);

//                 // Remove the listener for changes in the operating system's theme
//                 window.matchMedia(darkThemeMediaQuery).removeEventListener('change', applyOperatingSystemTheme);
//             };
//         },
//         [handleLocalStorageChange, applyOperatingSystemTheme, updateThemeClassName],
//     );

//     // Render the component
//     return (
//         <ThemeContext.Provider value={{ themeClassName: themeClassName, setThemeClassName: updateThemeClassName }}>
//             {properties.children}
//         </ThemeContext.Provider>
//     );
// }

interface ThemeProviderProps {
    children: React.ReactNode;
    themeFromCookies?: ThemeMode;
}
const ThemeProvider = ({ children, themeFromCookies }: ThemeProviderProps) => {
    const currentThemeFromLocalStorage = useAtomValue(root_themeAtom);

    useHydrateAtoms([
        [root_themeAtom, currentThemeFromLocalStorage ?? themeFromCookies],
        [root_systemThemeAtom, themeFromCookies ?? 'dark'],
    ]);

    // Unused, but we want to mount the atoms and keep them read.
    useAtomValue(readonlyThemeAtom);
    useAtomValue(readonlySystemThemeAtom);

    return children;
};

// Hook - useTheme
export function useTheme() {
    const theme = useAtomValue(readonlyThemeAtom);
    const systemTheme = useAtomValue(readonlySystemThemeAtom);

    return {
        themeClassName: theme,
        systemTheme: systemTheme,
    };
}

// Export - Default
export default ThemeProvider;
