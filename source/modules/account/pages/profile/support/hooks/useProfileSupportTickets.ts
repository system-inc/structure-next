// Dependencies - React
import React from 'react';

// Dependencies - API
import { useQuery } from '@apollo/client';
import { ProfileSupportTicketsDocument } from '@project/source/api/GraphQlGeneratedCode';

export function useProfileSupportTickets({
    openTicketsPage,
    closedTicketsPage,
}: {
    openTicketsPage: number;
    closedTicketsPage: number;
}) {
    const variables = React.useMemo(() => ({
        openTicketsIndex: (openTicketsPage - 1) * 3,
        closedTicketsIndex: (closedTicketsPage - 1) * 3,
    }), [openTicketsPage, closedTicketsPage]);

    // Queries
    const queryResult = useQuery(ProfileSupportTicketsDocument, {
        variables,
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: false,
        // Poll every minute
        // pollInterval: 60000,
    });

    return {
        ticketsQuery: queryResult,
        refetchTickets: queryResult.refetch,
    };
}