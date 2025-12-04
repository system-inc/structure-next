// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import {
    SupportTicketsDocument,
    SupportTicketsQueryVariables,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useSupportTicketsRequest
export function useSupportTicketsRequest(
    variables: SupportTicketsQueryVariables,
    options?: InferUseGraphQlQueryOptions<typeof SupportTicketsDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query SupportTickets($pagination: PaginationInput!) {
                supportTickets(pagination: $pagination) {
                    items {
                        identifier
                        title
                        status
                        userEmailAddress
                        comments {
                            id
                            source
                            visibility
                            content
                            contentType
                            createdAt
                            attachments {
                                type
                                url
                                variant
                            }
                        }
                    }
                }
            }
        `),
        variables,
        options,
    );
}
