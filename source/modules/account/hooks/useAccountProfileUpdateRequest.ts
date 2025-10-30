// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { AccountProfileUpdateDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useAccountProfileUpdateRequest
export function useAccountProfileUpdateRequest(
    options?: InferUseGraphQlMutationOptions<typeof AccountProfileUpdateDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation AccountProfileUpdate($input: AccountProfileUpdateInput!) {
                accountProfileUpdate(input: $input) {
                    id
                    username
                    displayName
                    givenName
                    familyName
                    images {
                        url
                        variant
                    }
                    updatedAt
                    createdAt
                }
            }
        `),
        options,
    );
}
