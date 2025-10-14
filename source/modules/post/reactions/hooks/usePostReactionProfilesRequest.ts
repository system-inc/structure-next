'use client'; // This hook uses client-only features

// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import {
    PostReactionProfilesDocument,
    PostReactionProfilesQueryVariables,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - usePostReactionProfilesQuery
export function usePostReactionProfilesRequest(
    variables: PostReactionProfilesQueryVariables,
    options?: InferUseGraphQlQueryOptions<typeof PostReactionProfilesDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query PostReactionProfiles($postId: String!, $content: String!, $pagination: PaginationInput!) {
                postReactionProfiles(postId: $postId, content: $content, pagination: $pagination) {
                    items {
                        username
                        displayName
                        profileId
                    }
                    pagination {
                        itemIndex
                        itemIndexForPreviousPage
                        itemIndexForNextPage
                        itemsPerPage
                        itemsTotal
                        pagesTotal
                        page
                    }
                }
            }
        `),
        variables,
        options,
    );
}
