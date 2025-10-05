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

    // Store the current value in the reference
    React.useEffect(function () {
        reference.current = value;
    });

    return reference.current;
}
