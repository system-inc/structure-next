// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { ContactListEntryUnsubscribeDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import { emailListCacheKey } from './useContactListEntryCreateRequest';

// Hook - useContactListEntryDeleteRequest
export function useContactListEntryDeleteRequest(
    options?: InferUseGraphQlMutationOptions<typeof ContactListEntryUnsubscribeDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation ContactListEntryUnsubscribe($contactListIdentifier: String!, $emailAddress: String!, $reason: String) {
                contactListEntryUnsubscribe(contactListIdentifier: $contactListIdentifier, emailAddress: $emailAddress, reason: $reason) {
                    success
                }
            }
        `),
        {
            ...options,
            invalidateOnSuccess: function (variables) {
                return [[emailListCacheKey, variables.contactListIdentifier]];
            },
        },
    );
}
