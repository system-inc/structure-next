// Dependencies - React
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

// Function to extract string content from React nodes recursively
// Useful for searching or displaying text from complex React children
// Returns undefined if no string content is found
export function stringFromReactNode(node: React.ReactNode): string | undefined {
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
        const result = node.map(stringFromReactNode).filter(Boolean).join('');
        return result || undefined;
    }

    // Handle React elements - recursively extract text from children
    if(React.isValidElement(node)) {
        const nodeProperties = node.props as { children?: React.ReactNode };
        if(nodeProperties.children) {
            return stringFromReactNode(nodeProperties.children);
        }
    }

    // Default case
    return undefined;
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

    // No next field found - return false to indicate this is the last field
    // The caller can decide whether to submit the form or focus the submit button
    return false;
}

// Function to focus the next focusable form element after the current element
export function focusNextFormElement(currentElement: HTMLElement, form: HTMLFormElement): boolean {
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

// Function to merge multiple references into a single reference callback
// Useful when you need to pass a reference to a third-party component that also needs its own reference
// Example: const mergedReference = mergeReferences([localReference, forwardedReference]);
export function mergeReferences<T>(
    references: Array<React.RefObject<T> | React.Ref<T> | undefined | null>,
): React.RefCallback<T> {
    return function (value) {
        references.forEach(function (reference) {
            if(typeof reference === 'function') {
                reference(value);
            }
            else if(reference != null) {
                (reference as React.RefObject<T | null>).current = value;
            }
        });
    };
}
