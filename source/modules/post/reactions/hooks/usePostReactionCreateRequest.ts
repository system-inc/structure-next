// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { PostReactionCreateDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - usePostReactionCreateRequest
export function usePostReactionCreateRequest(
    options?: InferUseGraphQlMutationOptions<typeof PostReactionCreateDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation PostReactionCreate($postId: String!, $content: String!) {
                postReactionCreate(postId: $postId, content: $content) {
                    success
                }
            }
        `),
        options,
    );
}
