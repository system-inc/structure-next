// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { PostTopicUpdateDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import { postTopicsCacheKey } from './usePostTopicCreateRequest';

// Hook - usePostTopicUpdateRequest
export function usePostTopicUpdateRequest(options?: InferUseGraphQlMutationOptions<typeof PostTopicUpdateDocument>) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation PostTopicUpdate($input: PostTopicUpdateInput!) {
                postTopicUpdate(input: $input) {
                    id
                    title
                    slug
                    description
                    postCount
                    createdAt
                }
            }
        `),
        {
            ...options,
            invalidateOnSuccess: function (variables) {
                return [[postTopicsCacheKey], ['postTopicById', variables.input.id]];
            },
        },
    );
}
