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
    // Queries
    const ticketsQuery = useQuery(ProfileSupportTicketsDocument, {
        variables: {
            openTicketsIndex: (openTicketsPage - 1) * 10,
            closedTicketsIndex: (closedTicketsPage - 1) * 10,
        },
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
        // Poll every minute
        pollInterval: 60000,
    });

    return {
        ticketsQuery,
    };
}