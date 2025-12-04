// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { PostDeleteDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import { postsCacheKey } from './usePostCreateRequest';

// Hook - usePostDeleteRequest
export function usePostDeleteRequest(options?: InferUseGraphQlMutationOptions<typeof PostDeleteDocument>) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation PostDelete($id: String!) {
                postDelete(id: $id) {
                    success
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
