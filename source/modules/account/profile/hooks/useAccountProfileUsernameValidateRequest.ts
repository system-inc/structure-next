// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import { AccountProfileUsernameValidateDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useAccountProfileUsernameValidateRequest
export function useAccountProfileUsernameValidateRequest(
    username: string,
    options?: InferUseGraphQlQueryOptions<typeof AccountProfileUsernameValidateDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query AccountProfileUsernameValidate($username: String!) {
                accountProfileUsernameValidate(username: $username)
            }
        `),
        {
            username: username,
        },
        options,
    );
}
