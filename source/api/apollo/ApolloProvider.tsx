'use client'; // This component uses client-only features

// Dependencies - API
import { apolloClient } from '@structure/source/api/apollo/ApolloClient';
import { ApolloProvider as ApolloClientProvider } from '@apollo/client';

// Component - ApolloWrapper
export interface ApolloProviderProperties {
    children: React.ReactNode;
}
export function ApolloProvider(properties: ApolloProviderProperties) {
    return <ApolloClientProvider client={apolloClient}>{properties.children}</ApolloClientProvider>;
}
