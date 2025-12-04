// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import {
    AccountPrivilegedDocument,
    AccountPrivilegedQueryVariables,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useAccountPrivilegedRequest
export function useAccountPrivilegedRequest(
    variables: AccountPrivilegedQueryVariables,
    options?: InferUseGraphQlQueryOptions<typeof AccountPrivilegedDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query AccountPrivileged($input: AccountInput!) {
                accountPrivileged(input: $input) {
                    profiles {
                        username
                        displayName
                        images {
                            url
                            variant
                        }
                    }
                }
            }
        `),
        variables,
        options,
    );
}
