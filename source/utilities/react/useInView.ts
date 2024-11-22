import React from 'react';

export const useInView = (options: IntersectionObserverInit & { amount?: 'any' | 'all' } = {}) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- we don't know what the ref will be
    const ref = React.useRef<any>(null);
    const [inView, setInView] = React.useState<boolean | undefined>(undefined);

    const observer = React.useMemo(() => {
        return new IntersectionObserver((entries) => {
            const isIntersecting =
                options.amount === 'all'
                    ? entries.every((entry) => entry.isIntersecting)
                    : entries.some((entry) => entry.isIntersecting);
            setInView(isIntersecting);
        }, options);
    }, [options]);

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
