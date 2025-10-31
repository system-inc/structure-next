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

// Hook to detect mobile viewport (max-width: 768px)
// Initializes with correct value to avoid layout shift
export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = React.useState(function () {
        // Initialize on mount with correct value
        return typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
    });

    // Effect to update on viewport size changes
    React.useEffect(function () {
        // Set initial value
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        setIsMobile(mediaQuery.matches);

        // Function to handle media query changes
        function handleChange(event: MediaQueryListEvent) {
            setIsMobile(event.matches);
        }

        // Add the event listener
        mediaQuery.addEventListener('change', handleChange);

        // On unmount, remove the event listener
        return function () {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    return isMobile;
}

// Helper to focus first focusable element within a container
// Useful for dialog/drawer focus management
export function focusFirstFocusableElement(selector: string): void {
    // Find the container element
    const container = document.querySelector(selector);
    if(!container) return;

    // Find the first focusable element within the container
    const focusable = container.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    // Focus the element if found
    focusable?.focus();
}

// Function to focus the next focusable form element after the current element
// Uses label elements to determine field order, making it work with custom form components
// Falls back to direct element navigation for unlabeled elements (like submit buttons)
// Returns true if next element was found and focused, false otherwise
export function focusNextFormElementByLabel(currentElement: HTMLElement): boolean {
    const form = currentElement.closest('form');
    if(!form) return false;

    // Find all labels with 'for' attribute in the form (in DOM order)
    const labels = Array.from(form.querySelectorAll<HTMLLabelElement>('label[for]'));

    // Find the label that points to the current element
    const currentLabel = labels.find(function (label) {
        return label.htmlFor === currentElement.id;
    });

    if(!currentLabel) {
        // Fallback: current element isn't labeled (e.g., submit button)
        return focusNextFormElement(currentElement, form);
    }

    // Get the index of current label and find next label
    const currentIndex = labels.indexOf(currentLabel);
    const nextLabel = labels[currentIndex + 1];

    if(nextLabel) {
        // Find the element this label points to
        const nextElement = document.getElementById(nextLabel.htmlFor);
        if(nextElement && nextElement instanceof HTMLElement) {
            nextElement.focus();
            nextElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            return true;
        }
    }

    // No next label found - try to find submit button
    const submitButton = form.querySelector<HTMLElement>('button[type="submit"]:not([disabled])');
    if(submitButton) {
        submitButton.focus();
        submitButton.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        return true;
    }

    return false;
}

// Function to focus the next focusable form element after the current element
function focusNextFormElement(currentElement: HTMLElement, form: HTMLFormElement): boolean {
    const formElements = Array.from(
        form.querySelectorAll<HTMLElement>(
            'input:not([type="hidden"]):not([disabled]), ' +
                'textarea:not([disabled]), ' +
                'select:not([disabled]), ' +
                'button[type="submit"]:not([disabled])',
        ),
    );

    const currentIndex = formElements.indexOf(currentElement);
    const nextElement = formElements[currentIndex + 1];

    if(nextElement) {
        nextElement.focus();
        nextElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        return true;
    }

    return false;
}
