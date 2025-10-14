// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { PostTopicDeleteDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import { postTopicsCacheKey } from './usePostTopicCreateRequest';

// Hook - usePostTopicDeleteRequest
export function usePostTopicDeleteRequest(options?: InferUseGraphQlMutationOptions<typeof PostTopicDeleteDocument>) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation PostTopicDelete($id: String!) {
                postTopicDelete(id: $id) {
                    success
                }
            }
        `),
        {
            ...options,
            invalidateOnSuccess: function (variables) {
                return [[postTopicsCacheKey], ['postTopic', variables.id]];
            },
        },
    );
}
