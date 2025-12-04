// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { SupportTicketUpdateStatusPrivilegedDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useSupportTicketUpdateStatusPrivilegedRequest
export function useSupportTicketUpdateStatusPrivilegedRequest(
    options?: InferUseGraphQlMutationOptions<typeof SupportTicketUpdateStatusPrivilegedDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation SupportTicketUpdateStatusPrivileged($id: String!, $status: SupportTicketStatus!) {
                supportTicketUpdateStatusPrivileged(id: $id, status: $status) {
                    id
                    status
                }
            }
        `),
        options,
    );
}
