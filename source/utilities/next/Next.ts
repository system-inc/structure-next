// Dependencies - Next.js
import { ResolvingMetadata } from 'next';

/**
 * Function to get the URL path from Next metadata
 * This dives into async storage of promise state to get the path
 * This is much more performant that using headers() from next as this doesn't opt out from the cache
 * @param metadata
 */
export function getUrlPathFromMetadata(metadata: ResolvingMetadata): string | undefined {
    const result = Object.getOwnPropertySymbols(metadata || {})
        .map(function (propertySymbol) {
            return Reflect.get(metadata, propertySymbol);
        })
        .find(function (state) {
            return state && Object.prototype.hasOwnProperty.call(state, 'urlPathname');
        });

    return result?.urlPathname.replace(/\?.+/, '');
}
