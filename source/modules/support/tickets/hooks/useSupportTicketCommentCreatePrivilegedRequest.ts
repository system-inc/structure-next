// Dependencies - API
import { networkService, gql, InferUseGraphQlMutationOptions } from '@structure/source/services/network/NetworkService';
import { SupportTicketCommentCreatePrivilegedDocument } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Hook - useSupportTicketCommentCreatePrivilegedRequest
export function useSupportTicketCommentCreatePrivilegedRequest(
    options?: InferUseGraphQlMutationOptions<typeof SupportTicketCommentCreatePrivilegedDocument>,
) {
    return networkService.useGraphQlMutation(
        gql(`
            mutation SupportTicketCommentCreatePrivileged($input: SupportTicketCommentCreateInput!) {
                supportTicketCommentCreatePrivileged(input: $input) {
                    id
                    content
                    contentType
                    source
                    visibility
                    createdAt
                }
            }
        `),
        options,
    );
}
