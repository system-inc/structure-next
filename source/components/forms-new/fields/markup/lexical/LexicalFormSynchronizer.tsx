'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - TanStack Form
import { useStore, type AnyFieldApi } from '@tanstack/react-form';

// Dependencies - Types
import { InputMarkupReferenceInterface } from './LexicalImperativeHandle';

/**
 * Synchronizes TanStack Form store values with InputMarkup editor.
 *
 * This component subscribes to the form store and imperatively updates the editor
 * when the store changes programmatically (e.g., form.reset() or setFieldValue()).
 *
 * By isolating the subscription in this child component, the parent input component
 * does not re-render when the user types. Only this invisible component re-renders.
 *
 * Smart Synchronization:
 * - Only syncs when editor content differs from store value
 * - Prevents infinite loops by comparing values before updating
 *
 * Architecture:
 * - Parent creates reference and writes to store (via handleChange)
 * - Parent does NOT subscribe to store (no re-render on typing)
 * - This child subscribes to store and syncs editor when needed
 * - This child returns null (invisible, no DOM output)
 *
 * Usage:
 * ```tsx
 * const editorReference = React.useRef<InputMarkupReferenceInterface>(null);
 *
 * return (
 *   <>
 *     <InputMarkup ref={editorReference} onChange={handleChange} />
 *     <LexicalFormSynchronizer
 *       editorReference={editorReference}
 *       fieldStore={fieldContext.store}
 *       type="Markdown"
 *     />
 *   </>
 * );
 * ```
 */
export interface LexicalFormSynchronizerProperties {
    // Reference to the InputMarkup editor to synchronize
    editorReference: React.RefObject<InputMarkupReferenceInterface | null>;
    // TanStack Form field store to subscribe to
    fieldStore: AnyFieldApi['store'];
    // The serialization format used by the editor
    type: 'Markdown' | 'Html' | 'Json';
}
export function LexicalFormSynchronizer(properties: LexicalFormSynchronizerProperties) {
    // Subscribe to the field's value in the TanStack Form store
    // When this changes, only THIS component re-renders, not the parent
    const storeValue = useStore(properties.fieldStore, function (state) {
        return state.value as string | undefined;
    });

    // Effect to synchronize store value to editor when it changes programmatically
    React.useEffect(
        function () {
            const editor = properties.editorReference.current;

            // If no editor reference, nothing to do
            if(!editor) {
                return;
            }

            // Determine the next value from the store (convert null/undefined to empty string)
            const nextStoreValue = storeValue ?? '';

            // Get current editor content
            const currentEditorValue = editor.getContent();

            // Only sync if the editor content is different from the store value
            // This prevents infinite loops: user types → onChange → store updates →
            // this effect runs → but values match → no sync needed
            if(currentEditorValue === nextStoreValue) {
                return;
            }

            // Imperatively set the editor content
            editor.setContent(nextStoreValue);
        },
        [storeValue, properties.editorReference],
    );

    // This component is invisible - it only exists to subscribe and synchronize
    return null;
}
