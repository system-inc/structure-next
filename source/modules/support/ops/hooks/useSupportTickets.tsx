// Dependencies - React and Next.js
import React from 'react';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import { ColumnFilterConditionOperator, OrderByDirection } from '@structure/source/api/graphql/GraphQlGeneratedCode';

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
            };
        },
        [page, itemsPerPage, filters],
    );

    // Queries
    const supportTicketsPrivilegedRequest = networkService.useGraphQlQuery(
        gql(`
            query SupportTicketsPrivileged($pagination: PaginationInput!) {
                supportTicketsPrivileged(pagination: $pagination) {
                    items {
                        id
                        identifier
                        status
                        type
                        title
                        description
                        userEmailAddress
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
                        attachments {
                            type
                            url
                            variant
                        }
                        comments {
                            id
                            source
                            visibility
                            content
                            contentType
                            attachments {
                                type
                                url
                                variant
                            }
                            createdAt
                        }
                        createdAt
                        updatedAt
                        lastUserCommentedAt
                        answeredAt
                        answered
                    }
                    pagination {
                        itemIndex
                        itemIndexForNextPage
                        itemIndexForPreviousPage
                        itemsPerPage
                        itemsTotal
                        page
                        pagesTotal
                    }
                }
            }
        `),
        ticketsVariables,
        {
            cache: 'SessionStorage',
            cacheKey: [supportTicketsCacheKey, ticketsVariables],
            // Poll every minute (60000ms)
            refreshIntervalInMilliseconds: 60000,
        },
    );

    // Query for support profiles
    const supportAllSupportProfilesRequest = networkService.useGraphQlQuery(
        gql(`
        query SupportAllSupportProfiles {
            supportAllSupportProfiles {
                username
                displayName
                images {
                    type
                    url
                    variant
                }
            }
        }
    `),
    );

    // Mutations
    const supportTicketCommentCreatePrivilegedRequest = networkService.useGraphQlMutation(
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
        {
            invalidateOnSuccess: [[supportTicketsCacheKey, ticketsVariables]],
        },
    );

    const supportTicketAssignRequest = networkService.useGraphQlMutation(
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
        {
            invalidateOnSuccess: [[supportTicketsCacheKey, ticketsVariables]],
        },
    );

    const supportTicketUpdateStatusPrivilegedRequest = networkService.useGraphQlMutation(
        gql(`
            mutation SupportTicketUpdateStatusPrivileged($id: String!, $status: SupportTicketStatus!) {
                supportTicketUpdateStatusPrivileged(id: $id, status: $status) {
                    id
                    status
                }
            }
        `),
        {
            invalidateOnSuccess: [[supportTicketsCacheKey, ticketsVariables]],
        },
    );

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
