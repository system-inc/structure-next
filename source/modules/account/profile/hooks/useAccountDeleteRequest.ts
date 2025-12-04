// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { AccountDeleteDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useAccountDeleteRequest
export function useAccountDeleteRequest(options?: InferUseGraphQlMutationOptions<typeof AccountDeleteDocument>) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation AccountDelete($reason: String) {
                accountDelete(reason: $reason) {
                    success
                }
            }
        `),
        options,
    );
}
