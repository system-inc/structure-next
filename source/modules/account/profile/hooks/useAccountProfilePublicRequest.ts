// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import {
    AccountProfilePublicDocument,
    AccountProfilePublicQueryVariables,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useAccountProfilePublicRequest
export function useAccountProfilePublicRequest(
    variables: AccountProfilePublicQueryVariables,
    options?: InferUseGraphQlQueryOptions<typeof AccountProfilePublicDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query AccountProfilePublic($username: String!) {
                accountProfilePublic(username: $username) {
                    username
                    displayName
                    images {
                        url
                        variant
                    }
                    createdAt
                }
            }
        `),
        variables,
        options,
    );
}
