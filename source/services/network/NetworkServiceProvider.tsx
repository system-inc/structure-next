'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - TanStack Query
// eslint-disable-next-line structure/network-service-rule
import { QueryClientProvider } from '@tanstack/react-query';

// Dependencies - Network Service
import { networkService } from './NetworkService';

// Component - NetworkServiceProvider
export interface NetworkServiceProviderProperties {
    children: React.ReactNode;
}

/**
 * NetworkServiceProvider wraps the application with the necessary providers for NetworkService.
 * This abstraction allows us to swap out the underlying query library (currently TanStack Query)
 * without changing any component code. All components should use NetworkService hooks instead
 * of importing from TanStack Query directly.
 */
export function NetworkServiceProvider(properties: NetworkServiceProviderProperties) {
    // Get the QueryClient from NetworkService
    // This ensures we use the same client instance that NetworkService uses internally
    const tanStackReactQueryClient = networkService.getTanStackReactQueryClient();

    return <QueryClientProvider client={tanStackReactQueryClient}>{properties.children}</QueryClientProvider>;
}
