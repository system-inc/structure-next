// Dependencies - React and Next.js
import React from 'react';

// Dependencies - API
import {
    useQuery,
    useMutation,
} from '@apollo/client';
import {
    ColumnFilterConditionOperator,
    OrderByDirection,
    SupportTicketsPrivilegedDocument,
    // SupportTicketCommentCreatePrivilegedDocument,
    SupportTicketAssignDocument,
    SupportAllSupportProfilesDocument,
    SupportTicketUpdateStatusPrivilegedDocument,
} from '@project/source/api/GraphQlGeneratedCode';

// Function to use support tickets
export function useSupportTickets(
    page: number,
    itemsPerPage: number,
    selectedStatus: string,
    assignedToMe: boolean = false,
) {
    // Add loading state for manual refresh
    const [isManuallyRefreshing, setIsManuallyRefreshing] = React.useState(false);

    // Add assign mutation
    const [assignTicket] = useMutation(SupportTicketAssignDocument, {
        refetchQueries: ['SupportTicketsPrivileged'],
    });

    // Add update status mutation
    const [updateTicketStatus] = useMutation(SupportTicketUpdateStatusPrivilegedDocument, {
        refetchQueries: ['SupportTicketsPrivileged'],
    })

    // Build filters
    const filters = React.useMemo(() => {
        const baseFilters = [
            {
                column: 'status',
                operator: ColumnFilterConditionOperator.Equal,
                value: selectedStatus,
            },
        ];

        if (assignedToMe) {
            baseFilters.push({
                column: 'assignedToUsername',
                operator: ColumnFilterConditionOperator.Equal,
                value: 'current', // The API will replace this with the current user's username
            });
        }

        return baseFilters;
    }, [selectedStatus, assignedToMe]);

    // Queries
    const ticketsQuery = useQuery(SupportTicketsPrivilegedDocument, {
        variables: {
            pagination: {
                itemsPerPage,
                itemIndex: (page - 1) * itemsPerPage,
                orderBy: [
                    {
                        key: 'createdAt',
                        direction: OrderByDirection.Descending,
                    },
                ],
                filters,
            },
        },
        // Poll every minute
        pollInterval: 60000,
    });

    // Modify the createComment mutation to include refetch
    // const [createComment] = useMutation(SupportTicketCommentCreatePrivilegedDocument, {
    //     refetchQueries: ['SupportTicketsPrivileged'],
    // });

    // Query for support profiles
    const supportProfilesQuery = useQuery(SupportAllSupportProfilesDocument);

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
        // createComment,
        assignTicket,
        updateTicketStatus,
        isManuallyRefreshing,
        handleManualRefresh,
        supportProfilesQuery,
    };
}
