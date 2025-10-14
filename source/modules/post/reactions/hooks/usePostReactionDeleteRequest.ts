// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { PostReactionDeleteDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - usePostReactionDeleteRequest
export function usePostReactionDeleteRequest(
    options?: InferUseGraphQlMutationOptions<typeof PostReactionDeleteDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation PostReactionDelete($postId: String!, $content: String!) {
                postReactionDelete(postId: $postId, content: $content) {
                    success
                }
            }
        `),
        options,
    );
}
