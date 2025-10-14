// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { PostCreateDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Cache Key
export const postsCacheKey = 'posts';

// Hook - usePostCreateRequest
export function usePostCreateRequest(options?: InferUseGraphQlMutationOptions<typeof PostCreateDocument>) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation PostCreate($input: PostCreateInput!) {
                postCreatePrivileged(input: $input) {
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
            invalidateOnSuccess: function () {
                return [[postsCacheKey]];
            },
        },
    );
}
