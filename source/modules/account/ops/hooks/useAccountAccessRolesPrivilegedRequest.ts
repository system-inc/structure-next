// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import { AccountAccessRolesPrivilegedDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useAccountAccessRolesPrivilegedRequest
export function useAccountAccessRolesPrivilegedRequest(
    options?: InferUseGraphQlQueryOptions<typeof AccountAccessRolesPrivilegedDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query AccountAccessRolesPrivileged {
                accountAccessRolesPrivileged {
                    type
                    description
                }
            }
        `),
        undefined,
        options,
    );
}
