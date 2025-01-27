'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
// TODO: Implement accessible Tootltip component.
// import Tip from '@structure/source/common/popovers/Tip';

// Dependencies - Styles
import { themeModeLocalStorageKey, ThemeMode, themeClassNameCookieKey } from '@structure/source/theme/Theme';

// Dependencies - Assets
import { Laptop, Sun, Moon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { TabItem, Tabs } from '@project/source/ui/Tabs';
import { atomWithStorage } from 'jotai/utils';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import Cookies from '../utilities/cookies/Cookies';
import ProjectSettings from '@project/ProjectSettings';
import { globalStore } from '../utilities/shared-state/SharedStateProvider';

const root_themeAtom = atomWithStorage<ThemeMode>(
    themeModeLocalStorageKey, // Local storage Key
    ThemeMode.System, // Initial value (overridden by local storage values)
    undefined, // custom storage (change if you want to use something other than localStorage)
    {
        getOnInit: true, // Initialize atom prior to React initial hydration (prevents flashing)
    },
);

// On mount, the theme atom will create a listener that changes the favicon based on the user's system theme preference.
// Notably, this listener does not change the theme of the website, only the favicon.
root_themeAtom.onMount = () => {
    const abortController = new AbortController();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Function to update the favicon
    function updateFavicon() {
        const favicon = document.querySelector('link[rel="icon"]');
        if(favicon) {
            favicon.setAttribute(
                'href',
                mediaQuery.matches
                    ? ProjectSettings.assets.favicon.dark.location
                    : ProjectSettings.assets.favicon.light.location,
            );
        }

        // If the theme mode is set to system, we need to update the theme class name as well
        if(globalStore.get(readonlyThemeAtom) === undefined) {
            document.documentElement.classList.remove(ThemeMode.Light);
            document.documentElement.classList.remove(ThemeMode.Dark);
            document.documentElement.classList.add(mediaQuery.matches ? ThemeMode.Dark : ThemeMode.Light);
        }
    }

    // Update the favicon on load
    updateFavicon();

    // Update the favicon when the system theme changes
    mediaQuery.addEventListener('change', updateFavicon, {
        signal: abortController.signal,
    });

    // Cleanup
    return () => {
        // Abort controller abort signal is a JavaScript signal object that can be used to remove/abort any listeners with the signal.
        abortController.abort();
    };
};

// The readonlyThemeAtom listens for changes to the original theme atom and updates accordingly
// without giving other consumers of the atom a way to update the value accidentally.
export const readonlyThemeAtom = atom((get) => get(root_themeAtom));

// The setThemeAtom is used to update the theme atom with a new value.
// But it also updates the theme cookie and appends/removes the theme class to/from the document element.
export const setThemeAtom = atom(null, (get, set, theme: ThemeMode) => {
    // When setting the theme, we need to update the theme cookie, for SSR, and append/remove the theme
    // class to/from the document element.

    if(typeof window !== 'undefined') {
        // System preference
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? ThemeMode.Dark
            : ThemeMode.Light;

        // Set the cookie
        Cookies.set(themeClassNameCookieKey, theme ?? systemPreference, {
            path: '/',
            maxAge: 31536000, // 1 year
            sameSite: 'strict',
            secure: true,
        });

        if(theme === ThemeMode.Dark) {
            document.documentElement.classList.add(theme);
            document.documentElement.classList.remove(ThemeMode.Light);
        }
        else if(theme === ThemeMode.Light) {
            document.documentElement.classList.add(theme);
            document.documentElement.classList.remove(ThemeMode.Dark);
        }
        else {
            document.documentElement.classList.remove(ThemeMode.Light);
            document.documentElement.classList.remove(ThemeMode.Dark);
            document.documentElement.classList.add(systemPreference);
        }
    }
    set(root_themeAtom, theme);
});

// Component - ThemeToggle
export interface ThemeToggleProperties {
    className?: string;
}
export function ThemeToggle() {
    // State for the theme
    const themeMode = useAtomValue(readonlyThemeAtom);
    const setThemeMode = useSetAtom(setThemeAtom);

    const tabsDefaultValue = themeMode ?? 'system';

    // Handle the client's input
    function handleChangeThemeMode(themeMode: ThemeMode) {
        // Set the state to the input
        setThemeMode(themeMode);
    }

    // Render the component
    return (
        <Tabs size="extra-small" defaultValue={tabsDefaultValue}>
            <TabItem icon value={'system'} onClick={() => handleChangeThemeMode(ThemeMode.System)}>
                <Laptop />
            </TabItem>
            <TabItem icon value={ThemeMode.Light} onClick={() => handleChangeThemeMode(ThemeMode.Light)}>
                <Sun />
            </TabItem>
            <TabItem icon value={ThemeMode.Dark} onClick={() => handleChangeThemeMode(ThemeMode.Dark)}>
                <Moon />
            </TabItem>
        </Tabs>
    );
}

// Export - Default
export default ThemeToggle;
