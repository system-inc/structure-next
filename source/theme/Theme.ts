// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Theme variables shared across the application
export const themeModeLocalStorageKey = ProjectSettings.identifier + 'ThemeMode';
export const themeModeChangeEventIdentifier = ProjectSettings.identifier + 'ThemeMode.change';
export const themeClassNameCookieKey = ProjectSettings.identifier + 'ThemeClassName';
export const lightThemeClassName = 'light';
export const darkThemeClassName = 'dark';
export const darkThemeMediaQuery = '(prefers-color-scheme: dark)';

/**
 * Theme modes. System is the default, which uses the client's
 * operating system theme preference, which is either light or dark.
 */
export const ThemeMode = {
    System: undefined,
    Light: 'light',
    Dark: 'dark',
} as const;
export type ThemeMode = (typeof ThemeMode)[keyof typeof ThemeMode];
