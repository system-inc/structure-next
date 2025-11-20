// Dependencies - React
import React from 'react';

// Hook to always access the latest value of a variable without adding it to effect dependencies
// Useful for accessing current props/state in stable callbacks without recreating them
export function useLatestPropertyValue<T>(value: T): React.RefObject<T> {
    const reference = React.useRef<T>(value);

    React.useEffect(
        function () {
            reference.current = value;
        },
        [value],
    );

    return reference;
}
