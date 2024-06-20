'use client'; // This component uses client-only features

// Dependencies - Structure
import StructureSettings from '@project/StructureSettings';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Styles
import {
    themeModeLocalStorageKey,
    themeModeChangeEventIdentifier,
    themeClassNameCookieKey,
    lightThemeClassName,
    darkThemeClassName,
    darkThemeMediaQuery,
    ThemeMode,
} from '@structure/source/theme/Theme';

// Dependencies - Utilities
import cookies from '@structure/source/utilities/cookies/Cookies';

// Context - Theme
interface ThemeType {
    theme: string | null;
    setTheme: (newTheme: string | null) => void;
}
const ThemeContext = React.createContext<ThemeType>({
    theme: null,
    setTheme: (newTheme: string | null) => {
        console.error('No ThemeProvider found.');
    },
});

// Component - ThemeProvider
export interface ThemeProviderInterface {
    children: React.ReactNode;
}
export function ThemeProvider({ children }: ThemeProviderInterface) {
    // State for the theme, default to StructureSettings.theme.default
    const [theme, setTheme] = React.useState<string | null>(StructureSettings?.theme?.default ?? null);

    // Handle changing the theme mode in local storage
    const updateTheme = React.useCallback(
        function () {
            // console.log('updateTheme');
            // console.log('localStorage[themeModeKey]', localStorage[themeModeKey]);
            // console.log(
            //     `window.matchMedia(darkThemeMediaQuery)`,
            //     window.matchMedia(darkThemeMediaQuery),
            // );

            // Dark mode
            if(
                // If the default theme is dark
                (theme === darkThemeClassName && localStorage[themeModeLocalStorageKey] === undefined) ||
                // If local storage has the theme mode set to dark
                localStorage[themeModeLocalStorageKey] === ThemeMode.Dark ||
                // Or if local storage has the theme mode set to system and the client's operating system is set to dark mode
                (localStorage[themeModeLocalStorageKey] === ThemeMode.System &&
                    window.matchMedia(darkThemeMediaQuery).matches) ||
                // Or if local storage does not have the theme mode set and the client's operating system is set to dark mode
                (localStorage[themeModeLocalStorageKey] === undefined && window.matchMedia(darkThemeMediaQuery).matches)
            ) {
                // console.log('Switching to dark mode');

                // Add the dark theme class to the document
                document.documentElement.classList.add(darkThemeClassName);

                // Set a cookie to remember the client is in dark mode
                // We only store the theme class name (not the theme mode) on the cookie, this way
                // when the page loads we can use the cookie to know if the client is in dark mode
                // right away without needing to check the theme mode in local storage which
                // would flash the page in light mode before switching to dark mode if the client
                // is in dark mode
                cookies.set(themeClassNameCookieKey, darkThemeClassName, {
                    path: '/',
                    maxAge: 31536000, // 1 year
                    sameSite: 'strict',
                    secure: true,
                });

                setTheme(darkThemeClassName);
            }
            // Light mode
            else {
                // console.log('Switching to light mode');

                // Remove the dark theme class from the document
                document.documentElement.classList.remove(darkThemeClassName);

                // Set a cookie to remember the client is in light mode
                cookies.set(themeClassNameCookieKey, lightThemeClassName, {
                    path: '/',
                    maxAge: 31536000, // 1 year
                    sameSite: 'strict',
                    secure: true,
                });

                setTheme(lightThemeClassName);
            }
        },
        [theme],
    );

    // Handle changes in local storage, sent by other tabs
    const handleLocalStorageChange = React.useCallback(
        function (event: StorageEvent) {
            if(event.key === themeModeLocalStorageKey) {
                updateTheme();
            }
        },
        [updateTheme],
    );

    // Handle changes in the operating system's theme
    const handleOperatingSystemThemeChange = React.useCallback(
        function () {
            console.log('handleOperatingSystemThemeChange');

            // We will only change the favicon on operating system theme changes, not website theme changes
            // If the operating system is set to dark mode,
            if(window.matchMedia(darkThemeMediaQuery).matches) {
                // Change the favicon to the dark favicon
                document
                    .querySelector<HTMLLinkElement>('link[rel="icon"]')
                    ?.setAttribute('href', StructureSettings.assets.favicon.dark.location);
            }
            // If the operating system is set to light mode
            else {
                // Change the favicon to the light favicon
                document
                    .querySelector<HTMLLinkElement>('link[rel="icon"]')
                    ?.setAttribute('href', StructureSettings.assets.favicon.light.location);
            }

            // Run the theme mode change handler
            updateTheme();
        },
        [updateTheme],
    );

    // On mount
    React.useEffect(
        function () {
            // Initalize the theme mode
            updateTheme();

            // Add theme mode change event listener that calls updateTheme on theme change
            window.addEventListener(themeModeChangeEventIdentifier, updateTheme);

            // Add a listener for changes in local storage
            window.addEventListener('storage', handleLocalStorageChange);

            // Add a listener for changes in the operating system's theme
            window.matchMedia(darkThemeMediaQuery).addEventListener('change', handleOperatingSystemThemeChange);

            // On unmount
            return () => {
                // Remove theme mode change event listener
                window.removeEventListener(themeModeChangeEventIdentifier, updateTheme);

                // Remove the listener for changes in local storage
                window.removeEventListener('storage', handleLocalStorageChange);

                // Remove the listener for changes in the operating system's theme
                window.matchMedia(darkThemeMediaQuery).removeEventListener('change', handleOperatingSystemThemeChange);
            };
        },
        [handleLocalStorageChange, handleOperatingSystemThemeChange, updateTheme],
    );

    // Render the component
    return <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>{children}</ThemeContext.Provider>;
}

// Hook - useTheme
export function useTheme() {
    return React.useContext(ThemeContext);
}

// Export - Default
export default ThemeProvider;
