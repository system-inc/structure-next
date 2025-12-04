// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { AccountAuthenticationRegistrationOrSignInCreateDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useAccountAuthenticationRegistrationOrSignInCreateRequest
export function useAccountAuthenticationRegistrationOrSignInCreateRequest(
    options?: InferUseGraphQlMutationOptions<typeof AccountAuthenticationRegistrationOrSignInCreateDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation AccountAuthenticationRegistrationOrSignInCreate($input: AccountRegistrationOrSignInCreateInput!) {
                accountAuthenticationRegistrationOrSignInCreate(input: $input) {
                    emailAddress
                    authentication {
                        status
                        scopeType
                        currentChallenge {
                            challengeType
                            status
                        }
                        updatedAt
                        createdAt
                    }
                }
            }
        `),
        options,
    );
}
