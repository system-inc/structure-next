// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { AccountAuthenticationEmailVerificationVerifyDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useAccountAuthenticationEmailVerificationVerifyRequest
export function useAccountAuthenticationEmailVerificationVerifyRequest(
    options?: InferUseGraphQlMutationOptions<typeof AccountAuthenticationEmailVerificationVerifyDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation AccountAuthenticationEmailVerificationVerify($input: AccountEmailVerificationVerifyInput!) {
                accountAuthenticationEmailVerificationVerify(input: $input) {
                    verification {
                        status
                        emailAddress
                        lastEmailSentAt
                    }
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
