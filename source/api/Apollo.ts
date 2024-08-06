// Dependencies - Structure
import StructureSettings from '@project/StructureSettings';

// Dependencies - API
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';

// Function to create an HttpLink for Apollo
function getApolloClientHttpLink(mode: 'Browser' | 'Server') {
    // Create the link to the API
    return createHttpLink({
        uri: StructureSettings.apis.base.url + 'graphql', // This needs to be an absolute url, as relative urls cannot be used in SSR
        credentials: mode === 'Browser' ? 'include' : undefined, // Cloudflare Workers does not support 'include'
        // Disable caching for server-side rendering for development
        fetch:
            mode === 'Server'
                ? function (uri, options) {
                      return fetch(uri, {
                          ...(options ?? {}),
                          headers: {
                              ...(options?.headers ?? {}),
                          },
                          next: {
                              revalidate: 0,
                          },
                      });
                  }
                : undefined,
    });
}

// Apollo client
export const apolloClient = new ApolloClient({
    link: getApolloClientHttpLink('Browser'),
    cache: new InMemoryCache(),
    ssrMode: true,
});

// Apollo client for server-side rendering
export const serverSideApolloClient = new ApolloClient({
    link: getApolloClientHttpLink('Server'),
    cache: new InMemoryCache(),
    ssrMode: true,
    // Disable caching for server-side rendering for development
    defaultOptions: {
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
        watchQuery: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    },
});
