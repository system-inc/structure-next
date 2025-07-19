// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import { ColumnFilterConditionOperator, OrderByDirection } from '@structure/source/api/graphql/GraphQlGeneratedCode';

export interface UsePostsRequestInterface {
    itemsPerPage?: number;
    page?: number;
    orderBy?: Array<{
        key: string;
        direction: OrderByDirection;
    }>;
    filters?: Array<{
        column: string;
        operator: ColumnFilterConditionOperator;
        value: string;
    }>;
}
export function usePostsRequest(properties?: UsePostsRequestInterface) {
    const itemsPerPage = properties?.itemsPerPage || 10;
    const page = properties?.page || 1;
    const orderBy = properties?.orderBy || [];
    const filters = properties?.filters || [];

    // Queries
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
                itemsPerPage: itemsPerPage,
                itemIndex: page ? (page - 1) * itemsPerPage : 0,
                orderBy: orderBy,
                filters: filters,
            },
        },
    );
}
