// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import {
    AccountAccessRoleAssignmentsPrivilegedDocument,
    AccountAccessRoleAssignmentsPrivilegedQueryVariables,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useAccountAccessRoleAssignmentsPrivilegedRequest
export function useAccountAccessRoleAssignmentsPrivilegedRequest(
    variables: AccountAccessRoleAssignmentsPrivilegedQueryVariables,
    options?: InferUseGraphQlQueryOptions<typeof AccountAccessRoleAssignmentsPrivilegedDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query AccountAccessRoleAssignmentsPrivileged($statuses: [AccessRoleStatus!]!, $pagination: PaginationInput!) {
                accountAccessRoleAssignmentsPrivileged(statuses: $statuses, pagination: $pagination) {
                    items {
                        id
                        accessRole {
                            id
                            type
                            description
                        }
                        status
                        emailAddress
                        profile {
                            username
                            displayName
                            images {
                                url
                                variant
                            }
                            createdAt
                        }
                        expiresAt
                        createdAt
                        updatedAt
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
