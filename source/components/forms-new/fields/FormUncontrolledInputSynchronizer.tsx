'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - TanStack Form
import { useStore, type AnyFieldApi } from '@tanstack/react-form';

/**
 * Imperatively sets the value of an uncontrolled input element.
 *
 * When working with uncontrolled inputs, we need to imperatively update
 * the DOM when the form store changes programmatically (e.g., form.reset()
 * or setFieldValue()).
 *
 * @param element - The input or textarea element to update
 * @param value - The value to set (will be converted to string)
 */
export function setUncontrolledValue(element: HTMLInputElement | HTMLTextAreaElement, value: unknown): void {
    const nextValue = value == null ? '' : String(value);

    // Only update if different to avoid unnecessary DOM operations
    if(element.value !== nextValue) {
        element.value = nextValue;
    }
}

// Component - FormUncontrolledInputSynchronizer
/**
 * Synchronizes TanStack Form store values with uncontrolled input DOM elements.
 *
 * This component subscribes to the form store and imperatively updates the DOM
 * when the store changes programmatically (e.g., form.reset() or setFieldValue()).
 *
 * By isolating the subscription in this child component, the parent input component
 * does not re-render when the user types. Only this invisible component re-renders.
 *
 * Smart Synchronization:
 * - Only syncs when DOM value differs from store value
 *
 * Architecture:
 * - Parent creates reference and writes to store (via handleChange)
 * - Parent does NOT subscribe to store (no re-render on typing)
 * - This child subscribes to store and syncs DOM when needed
 * - This child returns null (invisible, no DOM output)
 *
 * Usage:
 * ```tsx
 * const inputReference = React.useRef<HTMLInputElement>(null);
 *
 * return (
 *   <>
 *     <InputText ref={inputReference} onInput={handleInput} />
 *     <FormUncontrolledInputSynchronizer
 *       inputReference={inputReference}
 *       fieldStore={fieldContext.store}
 *     />
 *   </>
 * );
 * ```
 */
export interface FormUncontrolledInputSynchronizerProperties {
    // Reference to the input element to synchronize
    inputReference: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
    // TanStack Form field store to subscribe to
    fieldStore: AnyFieldApi['store'];
}
export function FormUncontrolledInputSynchronizer(properties: FormUncontrolledInputSynchronizerProperties) {
    // Subscribe to the field's value in the TanStack Form store
    // When this changes, only THIS component re-renders, not the parent
    const storeValue = useStore(properties.fieldStore, function (state) {
        return state.value;
    });

    // Effects to synchronize store value to DOM when it changes programmatically
    React.useEffect(
        function () {
            const element = properties.inputReference.current;

            // If no element, nothing to do
            if(!element) {
                return;
            }

            // Determine the next value from the store (convert null/undefined to empty string)
            const nextStoreValue = storeValue == null ? '' : String(storeValue);

            // Only sync if the DOM value is different from the store value
            if(element.value === nextStoreValue) {
                return;
            }

            // Use utility function to imperatively update DOM
            setUncontrolledValue(element, storeValue);
        },
        [storeValue, properties.inputReference],
    );

    // This component is invisible - it only exists to subscribe and synchronize
    return null;
}
