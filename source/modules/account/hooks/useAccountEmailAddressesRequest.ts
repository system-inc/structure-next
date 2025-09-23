// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import { AccountEmailsDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

export function useAccountEmailAddressesRequest(options?: InferUseGraphQlQueryOptions<typeof AccountEmailsDocument>) {
    return networkService.useGraphQlQuery(
        gql(`
            query AccountEmails {
                accountEmailAddresses {
                    emailAddresses {
                        id
                        emailAddress
                        type
                        isVerified
                    }
                }
            }
        `),
        undefined, // No variables
        options,
    );
}
