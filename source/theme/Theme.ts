// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Theme variables shared across the app
export const themeKey = ProjectSettings.identifier + 'Theme';
export const operatingSystemThemeKey = ProjectSettings.identifier + 'OperatingSystemTheme';
export const themeChangeEventIdentifier = ProjectSettings.identifier + 'Theme.change';
export const darkThemeMediaQueryString = '(prefers-color-scheme: dark)';

// Theme - The theme preference of the app.
export enum Theme {
    OperatingSystem = 'OperatingSystem',
    Light = 'Light',
    Dark = 'Dark',
}

// OperatingSystemTheme - The theme preference of the operating system.
export enum OperatingSystemTheme {
    Light = Theme.Light,
    Dark = Theme.Dark,
}

// ThemeClassName - The class names for the themes.
export enum ThemeClassName {
    Light = 'light',
    Dark = 'dark',
}
