// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { AccountAuthenticationSignInCompleteDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useAccountAuthenticationSignInCompleteRequest
export function useAccountAuthenticationSignInCompleteRequest(
    options?: InferUseGraphQlMutationOptions<typeof AccountAuthenticationSignInCompleteDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation AccountAuthenticationSignInComplete {
                accountAuthenticationSignInComplete {
                    success
                }
            }
        `),
        options,
    );
}
