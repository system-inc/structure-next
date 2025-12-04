// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { AccountAccessRoleAssignmentCreatePrivilegedDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useAccountAccessRoleAssignmentCreatePrivilegedRequest
export function useAccountAccessRoleAssignmentCreatePrivilegedRequest(
    options?: InferUseGraphQlMutationOptions<typeof AccountAccessRoleAssignmentCreatePrivilegedDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation AccountAccessRoleAssignmentCreatePrivileged($input: AccessRoleAssignmentCreateInput!) {
                accountAccessRoleAssignmentCreatePrivileged(input: $input) {
                    id
                    accessRole {
                        id
                        type
                        description
                    }
                    status
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
            }
        `),
        options,
    );
}
