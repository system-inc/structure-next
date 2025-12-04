// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import { PostsDetailedDocument, PostsDetailedQueryVariables } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - usePostsDetailedRequest
// Returns full post data including author profile, reactions, votes, and moderation fields
export function usePostsDetailedRequest(
    variables: PostsDetailedQueryVariables,
    options?: InferUseGraphQlQueryOptions<typeof PostsDetailedDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query PostsDetailed($pagination: PaginationInput!) {
                posts(pagination: $pagination) {
                    pagination {
                        itemIndex
                        itemIndexForPreviousPage
                        itemIndexForNextPage
                        itemsPerPage
                        itemsTotal
                        pagesTotal
                        page
                    }
                    items {
                        id
                        identifier
                        slug
                        status
                        title
                        createdByProfileId
                        createdByProfile {
                            displayName
                            username
                            images {
                                url
                                type
                                variant
                            }
                        }
                        content
                        reactions {
                            content
                            count
                            reacted
                        }
                        upvoteCount
                        downvoteCount
                        voteType
                        reportedCount
                        reportStatus
                        metadata
                        latestRevisionId
                        updatedAt
                        createdAt
                    }
                }
            }
        `),
        variables,
        options,
    );
}
