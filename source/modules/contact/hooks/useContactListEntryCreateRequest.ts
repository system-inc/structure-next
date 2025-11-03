// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { ContactListEntryCreateDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { schema } from '@structure/source/utilities/schema/Schema';

// Schema - contactListEntryCreateRequestInputSchema
export const contactListEntryCreateRequestInputSchema = schema.object({
    emailAddress: schema.string().emailAddress(),
});

// Cache Key
export const emailListCacheKey = 'emailList';

// Hook - useContactListEntryCreateRequest
export function useContactListEntryCreateRequest(
    options?: InferUseGraphQlMutationOptions<typeof ContactListEntryCreateDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation ContactListEntryCreate($data: ContactListEntryInput!) {
                contactListEntryCreate(data: $data) {
                    id
                }
            }
        `),
        {
            ...options,
            invalidateOnSuccess: function (variables) {
                return [[emailListCacheKey, variables.data.contactListIdentifier]];
            },
        },
    );
}
