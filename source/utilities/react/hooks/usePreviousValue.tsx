// Dependencies - React
import React from 'react';

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
