// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';

export function useAccountEmailAddressesRequest() {
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
    );
}
