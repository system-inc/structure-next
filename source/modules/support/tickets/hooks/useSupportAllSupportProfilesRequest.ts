// Dependencies - API
import { networkService, gql, InferUseGraphQlQueryOptions } from '@structure/source/services/network/NetworkService';
import { SupportAllSupportProfilesDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useSupportAllSupportProfilesRequest
export function useSupportAllSupportProfilesRequest(
    options?: InferUseGraphQlQueryOptions<typeof SupportAllSupportProfilesDocument>,
) {
    return networkService.useGraphQlQuery(
        gql(`
            query SupportAllSupportProfiles {
                supportAllSupportProfiles {
                    username
                    displayName
                    images {
                        type
                        url
                        variant
                    }
                }
            }
        `),
        undefined,
        options,
    );
}
