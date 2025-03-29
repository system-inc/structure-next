// Dependencies - API
import { useMutation } from '@apollo/client';
import {
    SupportTicketCommentCreatePrivilegedDocument,
} from '@project/source/api/GraphQlGeneratedCode';

// Function to use support tickets
export function useSupportTicketCreateComment(
) {
    // Modify the createComment mutation to include refetch
    const [createComment] = useMutation(SupportTicketCommentCreatePrivilegedDocument, {
        refetchQueries: ['SupportTicketsPrivileged'],
    });

    return {
        createComment,
    };
}
