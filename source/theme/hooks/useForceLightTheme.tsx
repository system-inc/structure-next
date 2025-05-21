// Dependencies - React
import React from 'react';

// Hook - useForceLightTheme - Force light mode on the body element
export function useForceLightTheme() {
    return React.useLayoutEffect(function () {
        // Add the light class to the body element
        document.documentElement.classList.add('light');

        // On unmount
        return function () {
            // Remove the light class from the body element
            document.documentElement.classList.remove('light');
        };
    }, []);
}
