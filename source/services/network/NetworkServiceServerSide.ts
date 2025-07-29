// Dependencies - Network Service
import { NetworkService, networkService } from './NetworkService';

// Re-export GraphQL utilities
export { gql } from './NetworkService';

// Dependencies - Cloudflare
import { getCloudflareContext } from '@opennextjs/cloudflare';

/**
 * Creates a NetworkService instance configured for server-side rendering.
 *
 * IMPORTANT: Cloudflare Workers require special handling for server-side rendering.
 * Having a globally shared singleton instance breaks Cloudflare Workers because:
 * 1. Workers are stateless - each request should be isolated
 * 2. Global state can leak between requests causing data pollution
 * 3. Shared cache/state between requests can cause security issues
 *
 * In development, we can safely return the regular networkService singleton because:
 * - Development runs in a traditional Node.js environment
 * - No risk of state pollution between requests
 * - Easier debugging with consistent state
 *
 * In production on Cloudflare Workers, we must create a new instance per request to:
 * - Ensure complete isolation between requests
 * - Prevent any state leakage
 * - Maintain security boundaries
 *
 * @returns NetworkService instance configured for server-side use
 */
export async function getServerSideNetworkService() {
    // Check if we're in development environment or building for production
    if(
        // Node environment is development
        process.env.NODE_ENV === 'development' ||
        // Structure environment is development (as NODE_ENV is always set to production with `wrangler dev`)
        process.env.STRUCTURE_ENV === 'development' ||
        // Next.js phase is production-build
        process.env.NEXT_PHASE === 'phase-production-build'
    ) {
        // In development/build environments, return the standard networkService singleton
        // This is safe because we're not running in the stateless Cloudflare Workers environment
        return networkService;
    }
    // If in production environment on Cloudflare Workers
    else {
        // Get the Cloudflare context which provides access to the bound services
        const cloudflareContext = await getCloudflareContext();

        // Create a new NetworkService instance for this specific request
        // This ensures complete isolation and prevents state pollution between requests
        return new NetworkService({
            // Mark this as a server-side instance
            serverSide: true,
            // Provide the Cloudflare API worker's fetch method
            // This enables direct worker-to-worker communication which:
            // 1. Is much faster than going through the public internet
            // 2. Doesn't bill us for two separate worker invocations
            // 3. Preserves the request context (preventing duplicate deviceIds)
            // Run `npm run cf-typegen` to get the types for cloudflareContext
            // IMPORTANT: Bind the fetch method to maintain its 'this' context
            fetch: cloudflareContext.env.api.fetch.bind(cloudflareContext.env.api),
        });
    }
}
