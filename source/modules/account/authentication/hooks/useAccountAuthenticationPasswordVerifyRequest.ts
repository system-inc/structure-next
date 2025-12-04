// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { AccountAuthenticationPasswordVerifyDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useAccountAuthenticationPasswordVerifyRequest
export function useAccountAuthenticationPasswordVerifyRequest(
    options?: InferUseGraphQlMutationOptions<typeof AccountAuthenticationPasswordVerifyDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation AccountAuthenticationPasswordVerify($input: AccountPasswordVerifyInput!) {
                accountAuthenticationPasswordVerify(input: $input) {
                    success
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
