// Dependencies - React
import React from 'react';

// Hook to manage state synchronized with session storage
export function useSessionStorageState<T>(key: string, initialValue: T) {
    // Create state
    const [state, setState] = React.useState<T>(function () {
        try {
            // Get from session storage by key
            const sessionStorageValue = sessionStorage.getItem(key);

            // If the value exists, return it
            if(typeof sessionStorageValue === 'string') {
                return JSON.parse(sessionStorageValue);
            }
            // Else, set the value to the initial value and return it
            else {
                sessionStorage.setItem(key, JSON.stringify(initialValue));
                return initialValue;
            }
        } catch {
            // If error, return the initial value
            return initialValue;
        }
    });

    // Effect to update session storage when state changes
    React.useEffect(
        function () {
            try {
                // Update session storage
                sessionStorage.setItem(key, JSON.stringify(state));
            } catch {
                // If error, do nothing
                console.error('Set session storage state failed.');
            }

            // No need to listen for session storage changes this state will be initialized
            // to the session storage value, then only updated via setState (which will update the session storage)
        },
        [state, key],
    );

    return [state, setState] as const;
}
