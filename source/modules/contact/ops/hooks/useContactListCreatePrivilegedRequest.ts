// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { ContactListCreatePrivilegedDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Cache Key
export const contactListsPrivilegedCacheKey = 'contactListsPrivileged';

// Hook - useContactListCreatePrivilegedRequest
export function useContactListCreatePrivilegedRequest(
    options?: InferUseGraphQlMutationOptions<typeof ContactListCreatePrivilegedDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation ContactListCreatePrivileged($data: ContactListCreationInput!) {
                contactListCreatePrivileged(data: $data) {
                    id
                    identifier
                    title
                    description
                    updatedAt
                    createdAt
                }
            }
        `),
        {
            ...options,
            invalidateOnSuccess: function () {
                return [[contactListsPrivilegedCacheKey]];
            },
        },
    );
}
