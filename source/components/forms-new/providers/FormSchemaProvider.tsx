'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Schema Types
import type { ObjectSchema, ObjectShape } from '@structure/source/utilities/schema/schemas/ObjectSchema';

// Interface - FormSchemaContextValue
interface FormSchemaContextValue {
    schema?: ObjectSchema<ObjectShape>;
}

// Context - FormSchemaContext
export const FormSchemaContext = React.createContext<FormSchemaContextValue>({ schema: undefined });

// Hook - useFormSchema
export function useFormSchema() {
    return React.useContext(FormSchemaContext);
}

// Component - FormSchemaProvider
export function FormSchemaProvider(properties: { schema?: ObjectSchema<ObjectShape>; children: React.ReactNode }) {
    return (
        <FormSchemaContext.Provider value={{ schema: properties.schema }}>
            {properties.children}
        </FormSchemaContext.Provider>
    );
}
