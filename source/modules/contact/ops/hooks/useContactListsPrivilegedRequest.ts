// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import {
    ContactListsPrivilegedDocument,
    ContactListsPrivilegedQueryVariables,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useContactListsPrivilegedRequest
export function useContactListsPrivilegedRequest(
    variables: ContactListsPrivilegedQueryVariables,
    options?: InferUseGraphQlQueryOptions<typeof ContactListsPrivilegedDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query ContactListsPrivileged($pagination: PaginationInput!) {
                contactListsPrivileged(pagination: $pagination) {
                    pagination {
                        itemIndex
                        itemIndexForNextPage
                        itemIndexForPreviousPage
                        itemsPerPage
                        itemsTotal
                        page
                        pagesTotal
                    }
                    items {
                        id
                        identifier
                        title
                        description
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
