'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Utilities
import { Provider as JotaiProvider, createStore } from 'jotai';

// Create the store and export it for use in the application
export const globalStore = createStore();

// Interface
export interface StateProviderInterface {
    children: React.ReactNode;
}
// State Provider
export function StateProvider(properties: StateProviderInterface) {
    // Render the component
    return <JotaiProvider store={globalStore}>{properties.children}</JotaiProvider>;
}

// Export - Default
export default StateProvider;
