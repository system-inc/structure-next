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

// Hook to get the previous value of a variable
export function usePreviousValue<T>(value: T): T | undefined {
    const [current, setCurrent] = React.useState<T>(value);
    const [previous, setPrevious] = React.useState<T | undefined>(undefined);

    if(value !== current) {
        setPrevious(current);
        setCurrent(value);
    }

    return previous;
}

// Function to extract string content from React nodes recursively
// Useful for searching or displaying text from complex React children
// Returns undefined if no string content is found
export function getStringFromReactNode(node: React.ReactNode): string | undefined {
    // Handle null/undefined
    if(node === null || node === undefined) {
        return undefined;
    }

    // Handle strings
    if(typeof node === 'string') {
        return node || undefined;
    }

    // Handle numbers
    if(typeof node === 'number') {
        return String(node);
    }

    // Handle booleans
    if(typeof node === 'boolean') {
        return undefined;
    }

    // Handle arrays
    if(Array.isArray(node)) {
        const result = node.map(getStringFromReactNode).filter(Boolean).join('');
        return result || undefined;
    }

    // Handle React elements - recursively extract text from children
    if(React.isValidElement(node)) {
        const nodeProperties = node.props as { children?: React.ReactNode };
        if(nodeProperties.children) {
            return getStringFromReactNode(nodeProperties.children);
        }
    }

    // Default case
    return undefined;
}
