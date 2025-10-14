// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { PostUpdateDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import { postsCacheKey } from './usePostCreateRequest';

// Hook - usePostUpdateRequest
export function usePostUpdateRequest(options?: InferUseGraphQlMutationOptions<typeof PostUpdateDocument>) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation PostUpdate($id: String!, $input: PostUpdateInput!) {
                postUpdate(id: $id, input: $input) {
                    id
                    status
                    title
                    contentType
                    content
                    settings
                    upvoteCount
                    downvoteCount
                    metadata
                    updatedAt
                    createdAt
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
