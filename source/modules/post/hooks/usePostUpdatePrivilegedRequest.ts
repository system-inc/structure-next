// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { PostUpdatePrivilegedDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import { postsCacheKey } from './usePostCreateRequest';

// Hook - usePostUpdatePrivilegedRequest
// Updates a post with privileged access
export function usePostUpdatePrivilegedRequest(
    options?: InferUseGraphQlMutationOptions<typeof PostUpdatePrivilegedDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation PostUpdatePrivileged($id: String!, $input: PostUpdateInput!) {
                postUpdatePrivileged(id: $id, input: $input) {
                    id
                    identifier
                    title
                    slug
                    description
                    content
                    contentType
                    status
                    type
                    metadata
                    createdAt
                    updatedAt
                }
            }
        `),
        {
            ...options,
            invalidateOnSuccess: function (variables) {
                return [[postsCacheKey], ['post', variables.id]];
            },
        },
    );
}
