// Dependencies - React and Next.js
import React from 'react';

// Function to debounce a value
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

    React.useEffect(
        function () {
            const handler = setTimeout(() => setDebouncedValue(value), delay);
            return () => clearTimeout(handler);
        },
        [value, delay],
    );

    return debouncedValue;
}
