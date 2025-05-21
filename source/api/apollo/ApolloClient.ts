// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - API
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';

// Create a globally shared Apollo client for the browser
export const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: createHttpLink({
        uri: 'https://' + ProjectSettings.apis.base.host + ProjectSettings.apis.base.graphQlPath,
        credentials: 'include', // Include HTTP Only cookies
    }),
});
