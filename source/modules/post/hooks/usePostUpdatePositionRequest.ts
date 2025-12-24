'use client'; // This hook uses client-only features

// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { PostUpdatePositionDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - usePostUpdatePositionRequest
// Updates the position of a post within its topic (establishes sibling order)
export function usePostUpdatePositionRequest(
    options?: InferUseGraphQlMutationOptions<typeof PostUpdatePositionDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation PostUpdatePosition($id: String!, $input: PostUpdatePositionInput!) {
                postUpdatePosition(id: $id, input: $input) {
                    id
                    identifier
                    title
                    previousSiblingId
                    nextSiblingId
                }
            }
        `),
        options,
    );
}
