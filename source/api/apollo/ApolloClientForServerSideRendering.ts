// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Dependencies - API
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { getCloudflareContext } from '@opennextjs/cloudflare';

// Function to get an Apollo client for server-side rendering
// Having a globally shared Apollo client breaks Cloudflare, so we need to create a new Apollo client for each request
export const getApolloClientForServerSideRendering = function () {
    // If in development environment or building for production
    if(
        // Node environment is development
        process.env.NODE_ENV === 'development' ||
        // Structure environment is development (as NODE_ENV is always set to production with `wrangler dev`)
        process.env.STRUCTURE_ENV === 'development' ||
        // Next.js phase is production-build
        process.env.NEXT_PHASE === 'phase-production-build'
    ) {
        // Return a standard Apollo client
        return new ApolloClient({
            ssrMode: true,
            cache: new InMemoryCache(),
            link: createHttpLink({
                uri: 'https://' + ProjectSettings.apis.base.host + ProjectSettings.apis.base.graphQlPath,
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

                    // This is a special convention that tells Base to not create duplicate deviceIds for worker to worker requests
                    const url = 'https://website.base-internal' + uri;

                    // Run `npm run cf-typegen` to get the types for cloudflareContext
                    return cloudflareContext.env.api.fetch(url, options);
                },
            }),
        });
    }
};
