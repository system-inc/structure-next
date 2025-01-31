import React from 'react';

export function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        if(typeof window === 'undefined') return;

        const abortController = new AbortController();
        const signal = abortController.signal;

        const handleResize = () => {
            if(window.innerWidth < 768) {
                setIsMobile(true);
            }
            else {
                setIsMobile(false);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize, { signal });

        return () => {
            abortController.abort();
        };
    }, []);

    return isMobile;
}
