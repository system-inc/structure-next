// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { PostVoteDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - usePostVoteRequest
export function usePostVoteRequest(options?: InferUseGraphQlMutationOptions<typeof PostVoteDocument>) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation PostVote($postId: String!, $type: PostVoteType!) {
                postVote(postId: $postId, type: $type) {
                    success
                }
            }
        `),
        options,
    );
}
