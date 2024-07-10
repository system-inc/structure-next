// TODO: We want to use apollo on server as well
'use client'; // This component uses client-only features

// Dependencies - Structure
import StructureSettings from '@project/StructureSettings';

// Dependencies - Accounts
import Session from '@structure/source/modules/account/Session';

// Dependencies - API
import { ApolloClient, ApolloProvider as ApolloClientProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Create the link to the API
const apolloClientHttpLink = createHttpLink({
    uri: StructureSettings.apis.base.url + 'graphql', // This needs to be an absolute url, as relative urls cannot be used in SSR
    // credentials: 'same-origin',
    credentials: 'include', // This needs to be 'include' as the GraphQL API is on a different domain and we need to use cookies the GraphQL server sets
});

// Function to set the authorization header
const setAuthorizationContext = setContext(function (_, { headers }) {
    // Get the session token using the session token hook
    const sessionToken = Session.getToken();

    return {
        headers: {
            authorization: sessionToken ?? '',
            ...headers,
        },
    };
});

// Create the Apollo client
export const apolloClient = new ApolloClient({
    link: setAuthorizationContext.concat(apolloClientHttpLink),
    cache: new InMemoryCache(),
    ssrMode: true,
});

// Component - ApolloWrapper
export interface ApolloProviderInterface {
    children: React.ReactNode;
}
export function ApolloProvider({ children }: ApolloProviderInterface) {
    return <ApolloClientProvider client={apolloClient}>{children}</ApolloClientProvider>;
}

// Export - Default
export default ApolloProvider;
