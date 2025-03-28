// Dependencies - Shared State
import { useAtomValue } from 'jotai';
import { readOnlyThemeAtom, readOnlyOperatingSystemThemeAtom } from '@structure/source/theme/ThemeProvider';
import { Theme, OperatingSystemTheme, ThemeClassName } from '@structure/source/theme/ThemeTypes';

// Hook - useTheme
export function useTheme() {
    const theme = useAtomValue(readOnlyThemeAtom);
    const operatingSystemTheme = useAtomValue(readOnlyOperatingSystemThemeAtom);
    const themeClassName =
        theme === Theme.OperatingSystem
            ? operatingSystemTheme === OperatingSystemTheme.Light
                ? ThemeClassName.Light
                : ThemeClassName.Dark
            : theme === Theme.Light
              ? ThemeClassName.Light
              : ThemeClassName.Dark;

    return {
        theme: theme,
        themeClassName: themeClassName,
        operatingSystemTheme: operatingSystemTheme,
    };
}

// Export - Default
export default useTheme;
