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

export const devApolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: createHttpLink({
        uri: ProjectSettings.apis.dev.url + 'graphql', // This needs to be an absolute url, as relative urls cannot be used in SSR
        credentials: 'include', // Include HTTP Only cookies
    }),
});
