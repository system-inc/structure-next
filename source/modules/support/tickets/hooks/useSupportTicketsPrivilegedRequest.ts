// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import { PaginationInput, SupportTicketsPrivilegedDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useSupportTicketsPrivilegedRequest
export function useSupportTicketsPrivilegedRequest(
    pagination: PaginationInput,
    options?: InferUseGraphQlQueryOptions<typeof SupportTicketsPrivilegedDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query SupportTicketsPrivileged($pagination: PaginationInput!) {
                supportTicketsPrivileged(pagination: $pagination) {
                    items {
                        id
                        identifier
                        status
                        type
                        title
                        description
                        userEmailAddress
                        assignedToProfileId
                        assignedToProfile {
                            username
                            displayName
                            images {
                                type
                                url
                                variant
                            }
                        }
                        attachments {
                            type
                            url
                            variant
                        }
                        comments {
                            id
                            source
                            visibility
                            content
                            contentType
                            attachments {
                                type
                                url
                                variant
                            }
                            createdAt
                        }
                        createdAt
                        updatedAt
                        lastUserCommentedAt
                        answeredAt
                        answered
                    }
                    pagination {
                        itemIndex
                        itemIndexForNextPage
                        itemIndexForPreviousPage
                        itemsPerPage
                        itemsTotal
                        page
                        pagesTotal
                    }
                }
            }
        `),
        { pagination },
        options,
    );
}
