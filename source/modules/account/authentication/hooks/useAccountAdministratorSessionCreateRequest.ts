// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { AccountAdministratorSessionCreateDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useAccountAdministratorSessionCreateRequest
export function useAccountAdministratorSessionCreateRequest(
    options?: InferUseGraphQlMutationOptions<typeof AccountAdministratorSessionCreateDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation AccountAdministratorSessionCreate {
                accountAdministratorSessionCreate {
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
