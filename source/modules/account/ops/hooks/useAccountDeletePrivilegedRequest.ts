// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { AccountDeletePrivilegedDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useAccountDeletePrivilegedRequest
export function useAccountDeletePrivilegedRequest(
    options?: InferUseGraphQlMutationOptions<typeof AccountDeletePrivilegedDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation AccountDeletePrivileged($input: AccountDeleteInput!) {
                accountDeletePrivileged(input: $input) {
                    success
                }
            }
        `),
        options,
    );
}
