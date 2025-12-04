// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { SupportTicketAssignDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useSupportTicketAssignRequest
export function useSupportTicketAssignRequest(
    options?: InferUseGraphQlMutationOptions<typeof SupportTicketAssignDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation SupportTicketAssign($ticketId: String!, $username: String) {
                supportTicketAssign(ticketId: $ticketId, username: $username) {
                    id
                    assignedToProfileId
                    assignedToProfile {
                        username
                        displayName
                        images {
                            type
                            url
                            variant
                        }
                    }
                }
            }
        `),
        options,
    );
}
