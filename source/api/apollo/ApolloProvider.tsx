'use client'; // This component uses client-only features

// Dependencies - API
import { apolloClient, devApolloClient } from '@structure/source/api/apollo/ApolloClient';
import { ApolloProvider as ApolloClientProvider } from '@apollo/client';
import { useSearchParams } from 'next/navigation';

// Component - ApolloWrapper
export interface ApolloProviderInterface {
    children: React.ReactNode;
}
export function ApolloProvider(properties: ApolloProviderInterface) {
    const searchParams = useSearchParams();
    const isDev = searchParams?.get('dev') === 'true';

    return (
        <ApolloClientProvider client={isDev ? devApolloClient : apolloClient}>
            {properties.children}
        </ApolloClientProvider>
    );
}

// Export - Default
export default ApolloProvider;
