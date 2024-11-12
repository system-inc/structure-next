// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Types
import { FormContextInterface } from './types';

// Create form context
export const FormContext = React.createContext<FormContextInterface | undefined>(undefined);

// Hook - Use form context
export function useFormContext() {
    const context = React.useContext(FormContext);
    if(!context) {
        throw new Error('useFormContext must be used within a FormProvider');
    }
    return context;
}
