// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import { AccountsPrivilegedDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Types
import type { AccountsPrivilegedQueryVariables } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useAccountsPrivilegedRequest
export function useAccountsPrivilegedRequest(
    variables: AccountsPrivilegedQueryVariables,
    options?: InferUseGraphQlQueryOptions<typeof AccountsPrivilegedDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query AccountsPrivileged($pagination: PaginationInput!) {
                accountsPrivileged(pagination: $pagination) {
                    items {
                        emailAddress
                        profiles {
                            username
                            displayName
                            givenName
                            familyName
                            countryCode
                            images {
                                url
                                variant
                            }
                            updatedAt
                            createdAt
                        }
                    }
                    pagination {
                        itemsTotal
                        itemsPerPage
                        page
                        pagesTotal
                        itemIndex
                        itemIndexForNextPage
                        itemIndexForPreviousPage
                    }
                }
            }
        `),
        variables,
        options,
    );
}
