'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - TanStack Query
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

// Dependencies - Network Service
import { networkService, networkServiceCacheKey } from './NetworkService';

// Create the persister with localStorage
const asyncStoragePersister = createAsyncStoragePersister({
    key: networkServiceCacheKey,
    storage: {
        getItem: async function (key: string) {
            try {
                // eslint-disable-next-line structure/local-storage-service-rule
                return window.localStorage.getItem(key);
            }
            catch(error) {
                console.warn('[NetworkService] Failed to read from localStorage:', error);
                return null;
            }
        },
        setItem: async function (key: string, value: string) {
            try {
                // eslint-disable-next-line structure/local-storage-service-rule
                window.localStorage.setItem(key, value);
                // const size = new Blob([value]).size;
                // console.log(`[NetworkService] Persisted ${(size / 1024).toFixed(2)}KB to localStorage`);
            }
            catch(error) {
                console.warn('[NetworkService] Failed to persist to localStorage:', error);
                // Check if it's a quota error
                if(error instanceof DOMException && error.name === 'QuotaExceededError') {
                    console.error('[NetworkService] localStorage quota exceeded - consider clearing old cache');
                }
            }
        },
        removeItem: async function (key: string) {
            try {
                // eslint-disable-next-line structure/local-storage-service-rule
                window.localStorage.removeItem(key);
            }
            catch(error) {
                console.warn('[NetworkService] Failed to remove from localStorage:', error);
            }
        },
    },
});

// Component - NetworkServiceProvider
export interface NetworkServiceProviderProperties {
    children: React.ReactNode;
}
export function NetworkServiceProvider(properties: NetworkServiceProviderProperties) {
    // Get the QueryClient from NetworkService
    // This ensures we use the same client instance that NetworkService uses internally
    const tanStackReactQueryClient = networkService.getTanStackReactQueryClient();

    return (
        <PersistQueryClientProvider
            client={tanStackReactQueryClient}
            persistOptions={{
                persister: asyncStoragePersister,
                maxAge: Infinity, // No expiration, let staleTime handle freshness
                dehydrateOptions: {
                    // Only persist queries that explicitly opt-in with cache: 'LocalStorage'
                    shouldDehydrateQuery: (query) => query.meta?.cache === 'LocalStorage',
                },
            }}
        >
            {properties.children}
        </PersistQueryClientProvider>
    );
}
