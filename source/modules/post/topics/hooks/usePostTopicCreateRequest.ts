// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { PostTopicCreateDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Cache Key
export const postTopicsCacheKey = 'postTopics';

// Hook - usePostTopicCreateRequest
export function usePostTopicCreateRequest(options?: InferUseGraphQlMutationOptions<typeof PostTopicCreateDocument>) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation PostTopicCreate($input: PostTopicCreateInput!) {
                postTopicCreate(input: $input) {
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
            invalidateOnSuccess: function () {
                return [[postTopicsCacheKey]];
            },
        },
    );
}
