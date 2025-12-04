// Dependencies - Shared State
import { useAtomValue } from 'jotai';
import {
    readOnlyThemeAtom,
    readOnlyOperatingSystemThemeAtom,
    getThemeClassName,
} from '@structure/source/theme/ThemeProvider';

// Hook - useThemeSettings
export function useThemeSettings() {
    const theme = useAtomValue(readOnlyThemeAtom);
    const operatingSystemTheme = useAtomValue(readOnlyOperatingSystemThemeAtom);

    return {
        theme: theme,
        themeClassName: getThemeClassName(theme, operatingSystemTheme),
        operatingSystemTheme: operatingSystemTheme,
    };
}
