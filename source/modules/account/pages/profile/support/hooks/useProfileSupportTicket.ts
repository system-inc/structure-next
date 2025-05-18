// Dependencies - API
import { useQuery } from '@apollo/client';
import {
    ProfileSupportTicketDocument,
    ColumnFilterConditionOperator,
} from '@project/source/api/GraphQlGeneratedCode';

export function useProfileSupportTicket(
    ticketIdentifier: string,
) {
    // Queries
    const pagination = {
        itemsPerPage: 1,
        filters: [{
            column: 'identifier',
            operator: ColumnFilterConditionOperator.Equal,
            value: ticketIdentifier,
        }],
    }

    const ticketQuery = useQuery(ProfileSupportTicketDocument, {
        variables: { pagination },
        // fetchPolicy: 'cache-and-network',
        // notifyOnNetworkStatusChange: true,
        // Poll every minute
        pollInterval: 60000,
    })

    // Mutations
    // const [createComment] = useMutation(SupportTicketCommentCreateDocument, {
    //     refetchQueries: ['ProfileSupportTickets'],
    // })

    const createComment = (comment: unknown) => {
        console.log('Comment:', comment);
    }

    return {
        ticketQuery,
        createComment,
        refetchTicket: ticketQuery.refetch,
    };
}