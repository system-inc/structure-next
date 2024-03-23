// Theme variables shared across the application
export const themeModeLocalStorageKey = 'themeMode';
export const themeModeChangeEventIdentifier = 'themeMode.change';
export const themeClassNameCookieKey = 'themeClassName';
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
