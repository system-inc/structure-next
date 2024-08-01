'use client'; // This component uses client-only features

// Dependencies - API
import { apolloClient } from '@structure/source/api/Apollo';
import { ApolloProvider as ApolloClientProvider } from '@apollo/client';

// Component - ApolloWrapper
export interface ApolloProviderInterface {
    children: React.ReactNode;
}
export function ApolloProvider(properties: ApolloProviderInterface) {
    return <ApolloClientProvider client={apolloClient}>{properties.children}</ApolloClientProvider>;
}

// Export - Default
export default ApolloProvider;
