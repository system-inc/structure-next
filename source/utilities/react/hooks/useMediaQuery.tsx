// Dependencies - React
import React from 'react';

// Hook to detect media query matches (for responsive design)
// Returns true when the media query matches, false otherwise
export function useMediaQuery(query: string): boolean {
    // Initialize with SSR-safe default (false)
    const [matches, setMatches] = React.useState<boolean>(function () {
        if(typeof window !== 'undefined') {
            return window.matchMedia(query).matches;
        }
        return false;
    });

    // Effect to set up media query listener
    React.useEffect(
        function () {
            if(typeof window === 'undefined') return;

            const mediaQueryList = window.matchMedia(query);

            // Update state when media query changes
            function handleChange(event: MediaQueryListEvent) {
                setMatches(event.matches);
            }

            // Set initial value
            setMatches(mediaQueryList.matches);

            // Listen for changes
            mediaQueryList.addEventListener('change', handleChange);

            // Cleanup listener on unmount
            return function () {
                mediaQueryList.removeEventListener('change', handleChange);
            };
        },
        [query],
    );

    return matches;
}
