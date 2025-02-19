import React from 'react';

export const useInView = ({ root, ...options }: IntersectionObserverInit & { amount?: 'any' | 'all' } = {}) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- we don't know what the ref will be
    const ref = React.useRef<any>(null);
    const [inView, setInView] = React.useState<boolean | undefined>(undefined);

    const observer = React.useMemo(() => {
        // If the IntersectionObserver API is not supported (or on the server), return a mock observer
        if(typeof window === 'undefined' || !window.IntersectionObserver) {
            return {
                observe: () => {},
                disconnect: () => {},
            };
        }

        let calculatedRoot = root;
        if(!calculatedRoot) {
            calculatedRoot = document.querySelector('main');
        }

        // Otherwise, return a new IntersectionObserver
        return new IntersectionObserver(
            (entries) => {
                const isIntersecting =
                    options.amount === 'all'
                        ? entries.every((entry) => entry.isIntersecting)
                        : entries.some((entry) => entry.isIntersecting);
                setInView(isIntersecting);
            },
            { ...options, root: calculatedRoot },
        );
    }, [options, root]);

    React.useEffect(() => {
        if(ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [ref, observer]);

    return [ref, inView] as const;
};
