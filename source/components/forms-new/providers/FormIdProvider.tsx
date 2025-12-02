'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Context - FormIdContext
export const FormIdContext = React.createContext<string | null>(null);

// Hook - useFormId
export function useFormId() {
    return React.useContext(FormIdContext);
}

// Hook - useFieldId
// Generates a deterministic field ID from formId + fieldIdentifier
export function useFieldId(fieldIdentifier: string | number | symbol) {
    const formId = useFormId();
    return `${formId ?? 'form'}-${String(fieldIdentifier)}`;
}

// Hook - useFieldLabelId
// Generates a deterministic label ID for aria-labelledby usage
export function useFieldLabelId(fieldIdentifier: string | number | symbol) {
    const formId = useFormId();
    return `${formId ?? 'form'}-${String(fieldIdentifier)}-label`;
}

// Component - FormIdProvider
// Provides a unique ID for a form and its children
export function FormIdProvider(properties: { id?: string; children: React.ReactNode }) {
    const reactId = React.useId();

    return <FormIdContext.Provider value={properties.id ?? reactId}>{properties.children}</FormIdContext.Provider>;
}
