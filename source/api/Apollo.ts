// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Dependencies - API
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';

// Create a globally shared Apollo client for the browser
export const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: createHttpLink({
        uri: ProjectSettings.apis.base.url + 'graphql', // This needs to be an absolute url, as relative urls cannot be used in SSR
        credentials: 'include', // Include HTTP Only cookies
    }),
});

// Function to get an Apollo client for server-side rendering
// Having a globally shared Apollo client breaks Cloudflare, so we need to create a new Apollo client for each request
export const getApolloClientForServerSideRendering = function () {
    return new ApolloClient({
        ssrMode: true,
        cache: new InMemoryCache(),
        link: createHttpLink({
            uri: ProjectSettings.apis.base.url + 'graphql', // This needs to be an absolute url, as relative urls cannot be used in SSR
        }),
    });
};
