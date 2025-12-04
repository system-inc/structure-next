// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import { AccountAuthenticationDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useAccountAuthenticationRequest
export function useAccountAuthenticationRequest(
    options?: InferUseGraphQlQueryOptions<typeof AccountAuthenticationDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query AccountAuthentication {
                accountAuthentication {
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
        `),
        undefined,
        options,
    );
}
