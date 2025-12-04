// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import { PostByIdentifierDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - usePostByIdentifierRequest
export function usePostByIdentifierRequest(
    identifier: string,
    options?: InferUseGraphQlQueryOptions<typeof PostByIdentifierDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query PostByIdentifier($identifier: String!) {
                post(identifier: $identifier) {
                    id
                }
            }
        `),
        {
            identifier: identifier,
        },
        options,
    );
}
