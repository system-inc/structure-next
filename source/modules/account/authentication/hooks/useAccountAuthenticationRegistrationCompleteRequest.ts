// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { AccountAuthenticationRegistrationCompleteDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useAccountAuthenticationRegistrationCompleteRequest
export function useAccountAuthenticationRegistrationCompleteRequest(
    options?: InferUseGraphQlMutationOptions<typeof AccountAuthenticationRegistrationCompleteDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation AccountAuthenticationRegistrationComplete($input: AccountRegistrationCompleteInput!) {
                accountAuthenticationRegistrationComplete(input: $input) {
                    success
                }
            }
        `),
        options,
    );
}
