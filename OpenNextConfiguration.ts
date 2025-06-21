// Dependencies - OpenNext
import type { OpenNextConfig as OpenNextConfigurationInterface } from '@opennextjs/aws/types/open-next.js';

// OpenNextConfiguration - https://opennext.js.org/
export const OpenNextConfiguration: OpenNextConfigurationInterface = {
    default: {
        override: {
            wrapper: 'cloudflare-node',
            converter: 'edge',
            proxyExternalRequest: 'fetch',
            incrementalCache: 'dummy',
            tagCache: 'dummy',
            queue: 'dummy',
        },
    },

    edgeExternals: ['node:crypto'],

    // Necessary to keep our 'build' command as 'opennextjs-cloudflare'
    buildCommand: 'next build', // DEFAULT: '{packageManager} run build',

    middleware: {
        external: true,
        override: {
            wrapper: 'cloudflare-edge',
            converter: 'edge',
            proxyExternalRequest: 'fetch',
            incrementalCache: 'dummy',
            tagCache: 'dummy',
            queue: 'dummy',
        },
    },
};
