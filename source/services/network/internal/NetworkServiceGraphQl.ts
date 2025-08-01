/**
 * GraphQL Import Strategy
 *
 * We have two separate GraphQL code generation outputs:
 * 1. App-specific queries: /app/_api/graphql/generated/
 * 2. Structure queries: /libraries/structure/source/api/graphql/generated/
 *
 * NetworkService needs to handle both because:
 * - App code uses app-specific GraphQL queries (e.g., product queries, checkout, etc.)
 * - Structure code uses structure GraphQL queries (e.g., account management, posts, etc.)
 *
 * By importing both and creating a unified interface, NetworkService becomes the single
 * source of truth for all network operations, regardless of where the query was defined.
 *
 * The ESLint ignores below are necessary because NetworkService is a special case that
 * needs to bridge the app/structure boundary to provide a unified API.
 */

// Import both graphql functions from their respective generated locations
// eslint-disable-next-line structure/no-structure-project-imports-rule
import { graphql as appGraphQl } from '@project/app/_api/graphql/GraphQlGeneratedCode';
import { graphql as structureGraphQl } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Import TypedDocumentString types from both locations
// TypedDocumentString is a class that extends String and contains the GraphQL query along with its type information for full type safety
// eslint-disable-next-line structure/no-structure-project-imports-rule
import { TypedDocumentString as AppTypedDocumentString } from '@project/app/_api/graphql/GraphQlGeneratedCode';
import { TypedDocumentString as StructureTypedDocumentString } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Create a union type that accepts both TypedDocumentString types
// This allows our GraphQL methods to accept queries from either code generation output
export type AppOrStructureTypedDocumentString<TResult, TVariables> =
    | StructureTypedDocumentString<TResult, TVariables>
    | AppTypedDocumentString<TResult, TVariables>;

/**
 * Unified GraphQL Template Tag (gql)
 *
 * This Proxy creates a single `gql` function that can handle GraphQL queries from both
 * app and structure generated code. It works by:
 *
 * 1. When used as a template tag: gql`query { ... }`
 *    - Tries app's graphql function first
 *    - Falls back to structure's graphql function if not found
 *
 * 2. When accessing pre-generated documents: gql.SomeDocument
 *    - Checks if the property exists in app's graphql exports
 *    - Falls back to structure's graphql exports if not found
 *
 * This approach allows us to:
 * - Use a single import: `import { gql } from '@structure/source/services/network/NetworkService'`
 * - Access queries from either code generation output transparently
 * - Maintain full TypeScript type safety for all queries
 *
 * Example usage:
 * ```typescript
 * // For inline queries (template tag)
 * const myQuery = gql`query GetUser { user { id name } }`;
 *
 * // For pre-generated typed documents
 * const result = await networkService.graphQlRequest(gql.GetUserDocument, variables);
 * ```
 * Export note: We export as 'gql' instead of 'graphql' to:
 * 1. Avoid naming conflicts with the original graphql imports
 * 2. Make it clear this is our unified NetworkService version
 */
export const gql = new Proxy(
    function gqlTarget() {
        throw new Error('gql called without arguments');
    }, // Change target to a function for callability
    {
        get(target, property) {
            // Try app graphql first (for pre-generated documents)
            if(property in appGraphQl) {
                return (appGraphQl as unknown as Record<string | symbol, unknown>)[property];
            }
            // Fall back to structure graphql
            if(property in structureGraphQl) {
                return (structureGraphQl as unknown as Record<string | symbol, unknown>)[property];
            }

            return undefined;
        },
        // Handle direct function calls (template tag usage)
        apply(target, thisArgument, argumentsList) {
            // Helper to check if result is a valid TypedDocumentString
            const isValidDocument = (result: unknown): boolean => {
                // Check if it's an instance of either TypedDocumentString class
                return result instanceof AppTypedDocumentString || result instanceof StructureTypedDocumentString;
            };

            // Try app's graphql function first
            const appFunction = appGraphQl as unknown as (...args: unknown[]) => unknown;
            const appResult = Function.prototype.apply.call(appFunction, null, argumentsList);

            if(isValidDocument(appResult)) {
                return appResult;
            }

            // Try structure's graphql function
            const structureFunction = structureGraphQl as unknown as (...args: unknown[]) => unknown;
            const structureResult = Function.prototype.apply.call(structureFunction, null, argumentsList);

            if(isValidDocument(structureResult)) {
                return structureResult;
            }

            // Neither worked, throw an error
            throw new Error(
                `GraphQL query not found in generated documents. Make sure to run 'npm run graphql:generate' after adding new queries.`,
            );
        },
    },
) as typeof appGraphQl & typeof structureGraphQl;
