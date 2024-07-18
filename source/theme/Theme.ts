// Dependencies - Structure
import StructureSettings from '@project/StructureSettings';

// Theme variables shared across the application
export const themeModeLocalStorageKey = StructureSettings.identifier + 'ThemeMode';
export const themeModeChangeEventIdentifier = StructureSettings.identifier + 'ThemeMode.change';
export const themeClassNameCookieKey = StructureSettings.identifier + 'ThemeClassName';
export const lightThemeClassName = 'light';
export const darkThemeClassName = 'dark';
export const darkThemeMediaQuery = '(prefers-color-scheme: dark)';

/**
 * Theme modes. System is the default, which uses the client's
 * operating system theme preference, which is either light or dark.
 */
export enum ThemeMode {
    System = 'System',
    Light = 'Light',
    Dark = 'Dark',
}
