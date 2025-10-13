// Dependencies - React and Next.js
import React from 'react';

// Function to wrap function components and SVGs in a span so they can be interacted with
export function wrapForSlot(children: React.ReactElement, className?: string) {
    // Determine if the child needs to be wrapped
    let needsToBeWrapped = false;
    if(children && children.type) {
        // Determine if the child is an SVG
        const constructorName = (children.type as React.JSXElementConstructor<unknown>).name;
        if(constructorName) {
            needsToBeWrapped = constructorName.startsWith('Svg');
        }

        // Determine if the child is a function component
        if(children.type instanceof Function) {
            // If the child is a function component, it needs to be wrapped
            needsToBeWrapped = true;
        }
    }

    return needsToBeWrapped ? (
        // Wrap children in a span so they can be interacted with
        <span className={className}>{children}</span>
    ) : (
        // If not an SVG, render the children as is
        children
    );
}

// Function to get the previous value of a state variable
export function usePrevious<T>(value: T): T | undefined {
    // Create a reference to store the previous value
    const reference = React.useRef<T | undefined>(undefined);
    const [previousValue, setPreviousValue] = React.useState<T | undefined>(undefined);

    // Store the current value in the reference
    React.useEffect(
        function () {
            setPreviousValue(reference.current);
            reference.current = value;
        },
        [value],
    );

    return previousValue;
}

// Hook to trigger re-renders at a specified interval
// Set milliseconds to 0 or pass enabled=false to pause the interval
export function useRenderInterval(milliseconds: number, enabled: boolean = true): number {
    const [tick, setTick] = React.useState(0);

    React.useEffect(
        function () {
            // Don't start interval if disabled or milliseconds is 0
            if(!enabled || milliseconds === 0) {
                return;
            }

            const intervalId = setInterval(function () {
                setTick(function (previous) {
                    return previous + 1;
                });
            }, milliseconds);

            return function () {
                clearInterval(intervalId);
            };
        },
        [milliseconds, enabled],
    );

    return tick;
}

// Function to debounce a value
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

    React.useEffect(
        function () {
            const handler = setTimeout(function () {
                setDebouncedValue(value);
            }, delay);
            return function () {
                return clearTimeout(handler);
            };
        },
        [value, delay],
    );

    return debouncedValue;
}

export function usePreviousValue<T>(value: T): T | undefined {
    const reference = React.useRef<T | undefined>(undefined);
    const [previousValue, setPreviousValue] = React.useState<T | undefined>(undefined);

    React.useEffect(
        function () {
            setPreviousValue(reference.current);
            reference.current = value;
        },
        [value],
    );

    return previousValue;
}
