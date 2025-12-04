// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { AccountSignOutDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useAccountSignOutRequest
export function useAccountSignOutRequest(options?: InferUseGraphQlMutationOptions<typeof AccountSignOutDocument>) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation AccountSignOut {
                accountSignOut {
                    success
                }
            }
        `),
        options,
    );
}
