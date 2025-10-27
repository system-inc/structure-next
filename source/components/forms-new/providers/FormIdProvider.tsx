'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

/**
 * Context - FormIdContext
 * A unique ID per form instance - useful as a prefix for field IDs
 */
export const FormIdContext = React.createContext<string | null>(null);

export function useFormId() {
    return React.useContext(FormIdContext);
}

/**
 * Hook - useFieldId
 * Generates a deterministic field ID from formId + fieldName
 * No context needed - just computation
 */
export function useFieldId(fieldIdentifier: string | number | symbol) {
    const formId = useFormId();
    return `${formId ?? 'form'}-${String(fieldIdentifier)}`;
}

/**
 * Provider - FormIdProvider
 * Provides a unique ID for a form and its children
 */
export function FormIdProvider(properties: { id?: string; children: React.ReactNode }) {
    const reactId = React.useId();
    const id = properties.id ?? reactId;
    return <FormIdContext.Provider value={id}>{properties.children}</FormIdContext.Provider>;
}
