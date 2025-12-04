// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import { PaginationInput, FeedbackListPrivilegedDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useFeedbackListPrivilegedRequest
export function useFeedbackListPrivilegedRequest(
    pagination: PaginationInput,
    options?: InferUseGraphQlQueryOptions<typeof FeedbackListPrivilegedDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query FeedbackListPrivileged($pagination: PaginationInput!) {
                feedbackListPrivileged(pagination: $pagination) {
                    items {
                        identifier
                        subject
                        reaction
                        content
                        contentType
                        emailAddress
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
