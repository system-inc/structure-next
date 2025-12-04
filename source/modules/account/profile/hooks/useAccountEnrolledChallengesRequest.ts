// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import { AccountEnrolledChallengesDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useAccountEnrolledChallengesRequest
export function useAccountEnrolledChallengesRequest(
    options?: InferUseGraphQlQueryOptions<typeof AccountEnrolledChallengesDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query AccountEnrolledChallenges {
                account {
                    enrolledChallenges
                }
            }
        `),
        undefined,
        options,
    );
}
