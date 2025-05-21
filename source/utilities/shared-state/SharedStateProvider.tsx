'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Utilities
import { Provider as JotaiProvider, createStore as jotaiCreateStore } from 'jotai';

// Global Store
export const globalStore = jotaiCreateStore();

// Interface
export interface SharedStateProviderProperties {
    children: React.ReactNode;
}
// State Provider
export function SharedStateProvider(properties: SharedStateProviderProperties) {
    // Render the component
    return <JotaiProvider store={globalStore}>{properties.children}</JotaiProvider>;
}

// Export - Default
export default SharedStateProvider;
