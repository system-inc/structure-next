'use client';

import React from 'react';

/**
 * Force light mode on the body element.
 * @description This hook will add the `light` class to the body element on mount and remove it on unmount.
 * @example ```tsx
 * function Component() {
 *   useForceLightMode();
 *   return <div>Component</div>;
 * }
 * ```
 */
export default function useForceLightMode() {
    return React.useLayoutEffect(() => {
        document.documentElement.classList.add('light');

        return () => {
            document.documentElement.classList.remove('light');
        };
    }, []);
}
