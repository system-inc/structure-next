// Dependencies - React and Next.js
import React from 'react';

// Dependencies - API
import { useQuery, useMutation } from '@apollo/client';
import {
    ColumnFilterConditionOperator,
    OrderByDirection,
    SupportTicketsAdminDocument,
    SupportTicketCommentCreateAdminDocument,
} from '@project/source/api/GraphQlGeneratedCode';

// Function to use support tickets
export function useSupportTickets(page: number, itemsPerPage: number, selectedStatus: string) {
    // Add loading state for manual refresh
    const [isManuallyRefreshing, setIsManuallyRefreshing] = React.useState(false);

    // Queries
    const ticketsQuery = useQuery(SupportTicketsAdminDocument, {
        variables: {
            pagination: {
                itemsPerPage,
                itemIndex: (page - 1) * itemsPerPage,
                filters: [
                    {
                        column: 'status',
                        operator: ColumnFilterConditionOperator.Equal,
                        value: selectedStatus,
                    },
                ],
            },
            orderBy: {
                key: 'createdAt',
                direction: OrderByDirection.Descending,
            },
        },
        // Poll every minute
        pollInterval: 60000,
    });

    // Modify the createComment mutation to include refetch
    const [createComment] = useMutation(SupportTicketCommentCreateAdminDocument, {
        refetchQueries: ['SupportTicketsAdmin'],
    });

    // Function to handle manual refresh
    const handleManualRefresh = React.useCallback(
        function () {
            setIsManuallyRefreshing(true);
            ticketsQuery.refetch().finally(() => {
                setIsManuallyRefreshing(false);
            });
        },
        [ticketsQuery],
    );

    return {
        ticketsQuery,
        createComment,
        isManuallyRefreshing,
        handleManualRefresh,
    };
}
