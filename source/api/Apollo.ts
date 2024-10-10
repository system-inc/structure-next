// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Dependencies - API
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';

// Function to create an HttpLink for Apollo
function getApolloClientHttpLink(mode: 'Browser' | 'Server') {
    // Create the link to the API
    return createHttpLink({
        uri: ProjectSettings.apis.base.url + 'graphql', // This needs to be an absolute url, as relative urls cannot be used in SSR
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
const apolloClientCache = new InMemoryCache({
    typePolicies: {
        ShoppingBagItem: {
            keyFields: ['id'],
        },
    },
});
export const apolloClient = new ApolloClient({
    link: getApolloClientHttpLink('Browser'),
    cache: apolloClientCache,
    ssrMode: true,
});

// Apollo client for server-side rendering
// Attempting to fix an issue with Cloudflare Next on Pages
// It is possible that having a globally shared Apollo client is causing issues with Cloudflare Next on Pages
export const getServersideApolloClient = function () {
    return new ApolloClient({
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
};
