'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - TanStack Query
// eslint-disable-next-line structure/network-service-rule
import { QueryClientProvider as TanStackReactQueryClientProvider } from '@tanstack/react-query';

// Dependencies - Network Service
import { networkService } from './NetworkService';

// Component - NetworkServiceProvider
export interface NetworkServiceProviderProperties {
    children: React.ReactNode;
}
export function NetworkServiceProvider(properties: NetworkServiceProviderProperties) {
    // Get the QueryClient from NetworkService
    // This ensures we use the same client instance that NetworkService uses internally
    const tanStackReactQueryClient = networkService.getTanStackReactQueryClient();

    return (
        <TanStackReactQueryClientProvider client={tanStackReactQueryClient}>
            {properties.children}
        </TanStackReactQueryClientProvider>
    );
}
