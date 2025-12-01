'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Types
import type { UseLinkedFieldsReturnInterface } from '../hooks/useLinkedFields';

// Interface - LinkedFieldsContextValue
interface LinkedFieldsContextValue {
    linkedFieldsResult?: UseLinkedFieldsReturnInterface;
}

// Context - LinkedFieldsContext
const LinkedFieldsContext = React.createContext<LinkedFieldsContextValue>({
    linkedFieldsResult: undefined,
});

// Hook - useLinkedFieldsContext
export function useLinkedFieldsContext() {
    return React.useContext(LinkedFieldsContext);
}

// Component - LinkedFieldsProvider
export function LinkedFieldsProvider(properties: {
    linkedFieldsResult?: UseLinkedFieldsReturnInterface;
    children: React.ReactNode;
}) {
    return (
        <LinkedFieldsContext.Provider value={{ linkedFieldsResult: properties.linkedFieldsResult }}>
            {properties.children}
        </LinkedFieldsContext.Provider>
    );
}
