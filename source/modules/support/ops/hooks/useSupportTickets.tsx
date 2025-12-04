// Dependencies - React and Next.js
import React from 'react';

// Dependencies - API
import { ColumnFilterConditionOperator, OrderByDirection } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import { useSupportTicketsPrivilegedRequest } from '@structure/source/modules/support/tickets/hooks/useSupportTicketsPrivilegedRequest';
import { useSupportAllSupportProfilesRequest } from '@structure/source/modules/support/tickets/hooks/useSupportAllSupportProfilesRequest';
import { useSupportTicketCommentCreatePrivilegedRequest } from '@structure/source/modules/support/tickets/hooks/useSupportTicketCommentCreatePrivilegedRequest';
import { useSupportTicketAssignRequest } from '@structure/source/modules/support/tickets/hooks/useSupportTicketAssignRequest';
import { useSupportTicketUpdateStatusPrivilegedRequest } from '@structure/source/modules/support/tickets/hooks/useSupportTicketUpdateStatusPrivilegedRequest';

// Cache key constants
export const supportTicketsCacheKey = 'supportTickets';

// Function to use support tickets
export function useSupportTickets(
    page: number,
    itemsPerPage: number,
    selectedStatus: string,
    assignedToMe: boolean = false,
) {
    // Add loading state for manual refresh
    const [isManuallyRefreshing, setIsManuallyRefreshing] = React.useState(false);

    // Build filters
    const filters = React.useMemo(
        function () {
            const baseFilters = [
                {
                    column: 'status',
                    operator: ColumnFilterConditionOperator.Equal,
                    value: selectedStatus,
                },
            ];

            if(assignedToMe) {
                baseFilters.push({
                    column: 'assignedToUsername',
                    operator: ColumnFilterConditionOperator.Equal,
                    value: 'current', // The API will replace this with the current user's username
                });
            }

            return baseFilters;
        },
        [selectedStatus, assignedToMe],
    );

    // Query variables
    const ticketsVariables = React.useMemo(
        function () {
            return {
                itemsPerPage,
                itemIndex: (page - 1) * itemsPerPage,
                orderBy: [
                    {
                        key: 'createdAt',
                        direction: OrderByDirection.Descending,
                    },
                ],
                filters,
            };
        },
        [page, itemsPerPage, filters],
    );

    // Queries
    const supportTicketsPrivilegedRequest = useSupportTicketsPrivilegedRequest(ticketsVariables, {
        cache: 'SessionStorage',
        cacheKey: [supportTicketsCacheKey, ticketsVariables],
        // Poll every minute (60000ms)
        refreshIntervalInMilliseconds: 60000,
    });

    // Query for support profiles
    const supportAllSupportProfilesRequest = useSupportAllSupportProfilesRequest();

    // Mutations
    const supportTicketCommentCreatePrivilegedRequest = useSupportTicketCommentCreatePrivilegedRequest({
        invalidateOnSuccess: [[supportTicketsCacheKey, ticketsVariables]],
    });

    const supportTicketAssignRequest = useSupportTicketAssignRequest({
        invalidateOnSuccess: [[supportTicketsCacheKey, ticketsVariables]],
    });

    const supportTicketUpdateStatusPrivilegedRequest = useSupportTicketUpdateStatusPrivilegedRequest({
        invalidateOnSuccess: [[supportTicketsCacheKey, ticketsVariables]],
    });

    // Function to handle manual refresh
    const handleManualRefresh = React.useCallback(
        function () {
            setIsManuallyRefreshing(true);
            supportTicketsPrivilegedRequest.refresh();
            // NetworkService doesn't have a way to know when refresh is done, so we'll just reset after a delay
            setTimeout(function () {
                setIsManuallyRefreshing(false);
            }, 1000);
        },
        [supportTicketsPrivilegedRequest],
    );

    return {
        ticketsQuery: {
            data: supportTicketsPrivilegedRequest.data,
            loading: supportTicketsPrivilegedRequest.isLoading,
            error: supportTicketsPrivilegedRequest.error,
            refetch: supportTicketsPrivilegedRequest.refresh,
        },
        createComment: supportTicketCommentCreatePrivilegedRequest.execute,
        assignTicket: supportTicketAssignRequest.execute,
        updateTicketStatus: supportTicketUpdateStatusPrivilegedRequest.execute,
        isManuallyRefreshing,
        handleManualRefresh,
        supportProfilesQuery: {
            data: supportAllSupportProfilesRequest.data,
            loading: supportAllSupportProfilesRequest.isLoading,
            error: supportAllSupportProfilesRequest.error,
        },
        refetchTickets: supportTicketsPrivilegedRequest.refresh,
    };
}
