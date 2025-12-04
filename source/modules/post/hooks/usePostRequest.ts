// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import { PostDocument, PostQueryVariables } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - usePostRequest
// Returns essential post fields for cards, list items, and links
export function usePostRequest(
    variables: PostQueryVariables,
    options?: InferUseGraphQlQueryOptions<typeof PostDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query Post($identifier: String!) {
                post(identifier: $identifier) {
                    identifier
                    slug
                    status
                    title
                    description
                    content
                    updatedAt
                    createdAt
                }
            }
        `),
        variables,
        options,
    );
}
