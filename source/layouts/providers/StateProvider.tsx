'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Jotai
import { Provider as JotaiProvider, createStore } from 'jotai';

// Create the store and export it for use in the application
export const globalStore = createStore();

// Interface
interface StateInterface {
    children: React.ReactNode;
}
// State Provider
export function StateProvider(properties: StateInterface) {
    // Render the component
    return <JotaiProvider store={globalStore}>{properties.children}</JotaiProvider>;
}

// Export - Default
export default StateProvider;
