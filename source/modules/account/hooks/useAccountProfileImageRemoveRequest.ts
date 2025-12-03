// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { AccountProfileImageRemoveDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useAccountProfileImageRemoveRequest
export function useAccountProfileImageRemoveRequest(
    options?: InferUseGraphQlMutationOptions<typeof AccountProfileImageRemoveDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation AccountProfileImageRemove {
                accountProfileImageRemove {
                    images {
                        url
                        variant
                    }
                }
            }
        `),
        options,
    );
}
