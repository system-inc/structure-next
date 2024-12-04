// This is a react hook that returns a boolean value based on the media query passed in as an argument. This is useful for creating responsive components that change based on the screen size.

import React from 'react';

export default function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = React.useState<boolean>(() => {
        if(typeof window !== 'undefined') {
            return window.matchMedia(query).matches;
        }
        return false;
    });

    const mediaQueryList = React.useMemo(
        () => (typeof window !== 'undefined' ? window.matchMedia(query) : null),
        [query],
    );

    const listener = React.useCallback(() => {
        if(mediaQueryList) {
            setMatches(mediaQueryList.matches);
        }
    }, [mediaQueryList]);

    React.useEffect(() => {
        if(!mediaQueryList) return;

        mediaQueryList.addEventListener('change', listener);
        setMatches(mediaQueryList.matches);

        return () => {
            mediaQueryList.removeEventListener('change', listener);
        };
    }, [mediaQueryList, listener]);

    return matches;
}
