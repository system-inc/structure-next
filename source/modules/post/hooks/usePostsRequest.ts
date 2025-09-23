// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import { PaginationInput, PostsDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

export function usePostsRequest(
    pagination?: Partial<PaginationInput>,
    options?: InferUseGraphQlQueryOptions<typeof PostsDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query Posts($pagination: PaginationInput!) {
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
        {
            pagination: {
                itemIndex: pagination?.itemIndex ?? 0,
                itemsPerPage: pagination?.itemsPerPage ?? 10,
                filters: pagination?.filters,
                orderBy: pagination?.orderBy,
            },
        },
        options,
    );
}
