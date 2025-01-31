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
import { TabItem, Tabs, tabsVariants } from '@project/source/ui/base/Tabs';
import { atomWithStorage } from 'jotai/utils';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import Cookies from '../utilities/cookies/Cookies';
import ProjectSettings from '@project/ProjectSettings';
import { globalStore } from '../utilities/shared-state/SharedStateProvider';
import ClientOnly from '../utilities/react/ClientOnly';
import { VariantProps } from 'class-variance-authority';

export const root_themeAtom = atomWithStorage<ThemeMode>(
    themeModeLocalStorageKey, // Local storage Key
    ThemeMode.System, // Initial value (overridden by local storage values)
    undefined, // custom storage (change if you want to use something other than localStorage)
    {
        getOnInit: true, // Initialize atom prior to React initial hydration (prevents flashing)
    },
);

export const root_systemThemeAtom = atom<NonNullable<ThemeMode>>(ProjectSettings.theme?.defaultClassName ?? 'light');
export const readonlySystemThemeAtom = atom((get) => get(root_systemThemeAtom));

// On mount, the theme atom will create a listener that changes the favicon based on the user's system theme preference.
// This only updates the theme if the theme is set to system.
root_systemThemeAtom.onMount = (setSystemThemeAtom) => {
    const abortController = new AbortController();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Function to update the favicon
    function updateFaviconAndRootClass() {
        const systemPreference = mediaQuery.matches ? ThemeMode.Dark : ThemeMode.Light;
        setSystemThemeAtom(systemPreference);

        const favicon = document.querySelector('link[rel="icon"]');
        if(favicon) {
            favicon.setAttribute(
                'href',
                mediaQuery.matches
                    ? ProjectSettings.assets.favicon.dark.location
                    : ProjectSettings.assets.favicon.light.location,
            );
        }

        // If the theme mode is set to system, we need to update the theme class name and cookie as well
        if(globalStore.get(readonlyThemeAtom) === undefined) {
            document.documentElement.classList.remove(ThemeMode.Light);
            document.documentElement.classList.remove(ThemeMode.Dark);
            document.documentElement.classList.add(mediaQuery.matches ? ThemeMode.Dark : ThemeMode.Light);

            // Set the cookie
            Cookies.set(themeClassNameCookieKey, mediaQuery.matches ? ThemeMode.Dark : ThemeMode.Light, {
                path: '/',
                maxAge: 31536000, // 1 year
                sameSite: 'strict',
                secure: true,
            });
        }
    }

    // Update the favicon on load
    updateFaviconAndRootClass();

    // Update the favicon when the system theme changes
    mediaQuery.addEventListener('change', updateFaviconAndRootClass, {
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
        const systemPreference = get(readonlySystemThemeAtom);

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
type ThemeToggleProps = VariantProps<typeof tabsVariants>;
export function ThemeToggle({ size = 'extra-small' }: ThemeToggleProps) {
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
        <ClientOnly>
            <Tabs
                size="extra-small"
                value={tabsDefaultValue}
                onValueChange={(value) => {
                    if(value === 'system') {
                        handleChangeThemeMode(ThemeMode.System);
                    }
                    else {
                        handleChangeThemeMode(value as ThemeMode);
                    }
                }}
            >
                <TabItem icon value={'system'}>
                    <Laptop />
                </TabItem>
                <TabItem icon value={ThemeMode.Light}>
                    <Sun />
                </TabItem>
                <TabItem icon value={ThemeMode.Dark}>
                    <Moon />
                </TabItem>
            </Tabs>
        </ClientOnly>
    );
}

// Export - Default
export default ThemeToggle;
