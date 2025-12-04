// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { AccountAccessRoleAssignmentRevokePrivilegedDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useAccountAccessRoleAssignmentRevokePrivilegedRequest
export function useAccountAccessRoleAssignmentRevokePrivilegedRequest(
    options?: InferUseGraphQlMutationOptions<typeof AccountAccessRoleAssignmentRevokePrivilegedDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation AccountAccessRoleAssignmentRevokePrivileged($input: AccessRoleAssignmentRevokeInput!) {
                accountAccessRoleAssignmentRevokePrivileged(input: $input) {
                    success
                }
            }
        `),
        options,
    );
}
