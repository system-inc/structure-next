// Dependencies - React
import React from 'react';

// Hook to detect mobile viewport (max-width: 768px)
// Always starts with false for SSR safety, then updates to actual viewport after hydration
export function useIsMobile(): boolean {
    // Always start with false to prevent SSR hydration mismatches
    const [isMobile, setIsMobile] = React.useState(false);

    // Effect to update on viewport size changes
    React.useEffect(function () {
        // Set initial value
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        setIsMobile(mediaQuery.matches);

        // Function to handle media query changes
        function handleChange(event: MediaQueryListEvent) {
            setIsMobile(event.matches);
        }

        // Add the event listener
        mediaQuery.addEventListener('change', handleChange);

        // On unmount, remove the event listener
        return function () {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    return isMobile;
}
