'use client'; // This hook uses client-only features

// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { PostTopicUpdatePositionDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - usePostTopicUpdatePositionRequest
// Updates the position of a topic (establishes sibling order)
export function usePostTopicUpdatePositionRequest(
    options?: InferUseGraphQlMutationOptions<typeof PostTopicUpdatePositionDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation PostTopicUpdatePosition($id: String!, $input: PostTopicUpdatePositionInput!) {
                postTopicUpdatePosition(id: $id, input: $input) {
                    id
                    previousSiblingId
                    nextSiblingId
                    title
                    slug
                }
            }
        `),
        options,
    );
}
