// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { AccountPasswordUpdateDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useAccountPasswordUpdateRequest
export function useAccountPasswordUpdateRequest(
    options?: InferUseGraphQlMutationOptions<typeof AccountPasswordUpdateDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation AccountPasswordUpdate($input: AccountPasswordUpdateInput!) {
                accountPasswordUpdate(input: $input) {
                    success
                }
            }
        `),
        options,
    );
}
