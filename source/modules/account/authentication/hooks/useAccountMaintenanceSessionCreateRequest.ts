// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { AccountMaintenanceSessionCreateDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useAccountMaintenanceSessionCreateRequest
export function useAccountMaintenanceSessionCreateRequest(
    options?: InferUseGraphQlMutationOptions<typeof AccountMaintenanceSessionCreateDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation AccountMaintenanceSessionCreate {
                accountMaintenanceSessionCreate {
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
        options,
    );
}
