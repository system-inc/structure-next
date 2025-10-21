// Theme - The theme preference of the app
export enum Theme {
    OperatingSystem = 'OperatingSystem',
    Light = 'Light',
    Dark = 'Dark',
}

// OperatingSystemTheme - The theme preference of the operating system
export enum OperatingSystemTheme {
    Light = Theme.Light,
    Dark = Theme.Dark,
}

// ThemeClassName - Map themes to Tailwind v4 scheme-* utility classes
export const ThemeClassName = {
    [Theme.Light]: 'scheme-light',
    [Theme.Dark]: 'scheme-dark',
    [Theme.OperatingSystem]: 'scheme-light-dark',
} as const;
