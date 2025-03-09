// Dependencies - Shared State
import { useAtomValue } from 'jotai';
import { readOnlyThemeAtom, readOnlyOperatingSystemThemeAtom } from '@structure/source/theme/ThemeProvider';

// Hook - useTheme
export function useTheme() {
    const theme = useAtomValue(readOnlyThemeAtom);
    const operatingSystemTheme = useAtomValue(readOnlyOperatingSystemThemeAtom);

    return {
        theme: theme,
        operatingSystemTheme: operatingSystemTheme,
    };
}

// Export - Default
export default useTheme;
