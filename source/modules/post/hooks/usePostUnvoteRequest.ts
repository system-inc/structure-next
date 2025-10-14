// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { PostUnvoteDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - usePostUnvoteRequest
export function usePostUnvoteRequest(options?: InferUseGraphQlMutationOptions<typeof PostUnvoteDocument>) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation PostUnvote($postId: String!) {
                postUnvote(postId: $postId) {
                    success
                }
            }
        `),
        options,
    );
}
