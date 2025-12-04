// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { AccountAuthenticationEmailVerificationSendDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useAccountAuthenticationEmailVerificationSendRequest
export function useAccountAuthenticationEmailVerificationSendRequest(
    options?: InferUseGraphQlMutationOptions<typeof AccountAuthenticationEmailVerificationSendDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation AccountAuthenticationEmailVerificationSend {
                accountAuthenticationEmailVerificationSend {
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
