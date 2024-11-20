// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Dependencies - API
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { getCloudflareContext } from '@opennextjs/cloudflare';

// Function to get an Apollo client for server-side rendering
// Having a globally shared Apollo client breaks Cloudflare, so we need to create a new Apollo client for each request
export const getApolloClientForServerSideRendering = function () {
    console.log('process.env.NODE_ENV', process.env.NODE_ENV);

    // If in development environment or building for production
    if(process.env.NODE_ENV === 'development' || process.env.NEXT_PHASE === 'phase-production-build') {
        // Return a standard Apollo client
        return new ApolloClient({
            ssrMode: true,
            cache: new InMemoryCache(),
            link: createHttpLink({
                uri: ProjectSettings.apis.base.url + 'graphql', // This needs to be an absolute url, as relative urls cannot be used in SSR
            }),
        });
    }
    // If in production environment
    else {
        // Return an Apollo client that uses the bound API worker
        // This is much faster, doesn't bill us for two worker invocations, and does not create new deviceIds
        return new ApolloClient({
            ssrMode: true,
            cache: new InMemoryCache(),
            link: createHttpLink({
                fetch: async function (uri, options) {
                    const cloudflareContext = await getCloudflareContext();
                    const url = 'https://website.base-internal' + uri;

                    // Run `npm run cf-typegen` to get the types for cloudflareContext
                    return cloudflareContext.env.api.fetch(url, options);
                },
            }),
        });
    }
};
