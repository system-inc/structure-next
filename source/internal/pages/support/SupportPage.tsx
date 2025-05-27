'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Internal Components
import { TicketList } from './components/TicketList/TicketList';
import { Ticket } from './components/Ticket/Ticket';
// import { CustomerAndTicketSidePanel } from './components/CustomerAndTicketSidePanel/CustomerAndTicketSidePanel';

// Dependencies - Hooks
import { useSupportTickets } from './hooks/useSupportTickets';
import { useAccountAndCommerceOrdersByEmail } from './hooks/useAccountAndCommerceOrdersByEmail';

// Dependencies - URL State
import { parseAsInteger, parseAsStringEnum, parseAsString, useQueryState } from 'nuqs';

// Dependencies - API
import {
    SupportTicketStatus,
    Pagination,
    SupportTicketCommentCreateInput,
} from '@project/source/api/graphql';

// Component - SupportPage
export function SupportPage() {
    const [pageIndex, setPageIndex] = useQueryState('page', parseAsInteger.withDefault(1));
    const [selectedStatus, setSelectedStatus] = useQueryState<SupportTicketStatus>('status',
        parseAsStringEnum<SupportTicketStatus>(Object.values(SupportTicketStatus)).withDefault(SupportTicketStatus.Open)
    );
    const [selectedTicketIdentifier, setSelectedTicketIdentifier] = useQueryState('ticket', parseAsString.withDefault(''));

    const [currentPagination, setCurrentPagination] = React.useState<Pagination>({
        itemIndex: 0, 
        itemIndexForNextPage: null,
        itemIndexForPreviousPage: null,
        itemsPerPage: 20,
        itemsTotal: 0,
        page: pageIndex,
        pagesTotal: 0,
    });
    const [showMyTickets] = React.useState<boolean>(false);

    // const ticketDetailsRef = React.useRef<HTMLDivElement>(null);
    const commentsContainerRef = React.useRef<HTMLDivElement>(null);

    // Hooks
    const {
        ticketsQuery,
        createComment,
        assignTicket,
        updateTicketStatus,
        isManuallyRefreshing,
        handleManualRefresh,
        supportProfilesQuery,
        refetchTickets,
    } = useSupportTickets(currentPagination.page, currentPagination.itemsPerPage, selectedStatus, showMyTickets);

    // Selected Ticket
    const { selectedTicket, selectedTicketIndex } = React.useMemo(() => {
        const items = ticketsQuery.data?.supportTicketsPrivileged?.items || [];
        const index = items.findIndex((ticket) => ticket.identifier === selectedTicketIdentifier);
        return {
            selectedTicket: index !== -1 ? items[index] : undefined,
            selectedTicketIndex: index,
        };
    }, [ticketsQuery.data, selectedTicketIdentifier]);

    // Get account and commerce orders by email
    const { accountAndCommerceOrdersByEmailQuery } = useAccountAndCommerceOrdersByEmail(selectedTicket?.userEmailAddress)

    // Fix?: client-side-unvalidated-url-redirection Allowing unvalidated redirection based on user-specified URLs
    function handleTicketStatusFilterChange(status: SupportTicketStatus) {
        setSelectedStatus(status);

        // Reset pagination state to page 1
        setCurrentPagination((prev) => ({
            ...prev,
            page: 1,
        }));
    
        // Update the URL parameters for status and reset the page
        setSelectedStatus(status);
        setPageIndex(1);
        setSelectedTicketIdentifier(null);
    }

    function handlePageChange(page: number) {
        setCurrentPagination((prev) => ({
            ...prev,
            page,
        }));

        setPageIndex(page);
    }

    function handleTicketIndexChange(ticketIndex: number) {
        const items = ticketsQuery.data?.supportTicketsPrivileged?.items || [];
        const ticket = items[ticketIndex];

        if (ticket) {
            setSelectedTicketIdentifier(ticket.identifier);
        }
    }


    // Function to select ticket and update URL
    function handleTicketSelection(ticketIdentifier: string) {
        setSelectedTicketIdentifier(ticketIdentifier);
    }

    React.useEffect(
        function () {
            // Ensure ticketsQuery has data and the selectedStatus is set
            if (!ticketsQuery.data || !selectedStatus) return;
    
            // Get the filtered tickets based on the current status
            const filteredTickets = ticketsQuery.data.supportTicketsPrivileged?.items || [];
    
            // Check if the currently selected ticket exists in the filtered list
            const ticketExists = filteredTickets.some((ticket) => ticket.identifier === selectedTicketIdentifier);
    
            // If no ticket is selected or the selected ticket is invalid, select the first ticket
            if (!selectedTicketIdentifier || !ticketExists) {
                const firstTicket = filteredTickets[0];
                if (firstTicket) {
                    setSelectedTicketIdentifier(firstTicket.identifier);
                } else {
                    // If no tickets are available, clear the ticket parameter
                    setSelectedTicketIdentifier(null);
                }
            }
        },
        [ticketsQuery.data, selectedStatus, selectedTicketIdentifier], // Dependencies
    );

    React.useEffect(
        function() {
            if (!ticketsQuery.data) return;

            const pagination = ticketsQuery.data.supportTicketsPrivileged.pagination;
            if (pagination) {
                setCurrentPagination(pagination);
            }
        },
        [ticketsQuery.data]
    )

    // Scroll to bottom when selecting ticket or when new comments appear
    React.useEffect(
        function () {
            if(commentsContainerRef.current && selectedTicket?.comments) {
                commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
            }
        },
        [selectedTicket],
    );

    const handleTicketStatusChange = React.useCallback(
        async function ({ ticketId, status }: { ticketId: string; status: SupportTicketStatus }) {
            await updateTicketStatus({
                variables: {
                    ticketId,
                    status,
                },
            })
        },
        [selectedTicket?.status]
    );

    const handleTicketAssignSupportProfile = React.useCallback(
        function ({ ticketId, supportProfileUsername }: { ticketId: string; supportProfileUsername: string }) {
            
            if (!ticketId || !supportProfileUsername) return;

            assignTicket({
                variables: {
                    ticketId,
                    username: supportProfileUsername,
                },
            });
        },
        []
    );

    const handleTicketCommentCreate = React.useCallback(
        async function (input: SupportTicketCommentCreateInput) {
            await createComment({
                variables: {
                    input,
                },
            });
        },
        [createComment]
    );

    // Render the component
    return (
        <div className="relative h-[calc(100vh-3.5rem)]">
            <div className="grid h-full grid-cols-[390px_1fr]">

                {/* Left Sidebar */}
                <TicketList
                    tickets={ticketsQuery.data?.supportTicketsPrivileged.items || []}
                    selectedTicketIdentifier={selectedTicketIdentifier}
                    selectedStatus={selectedStatus}
                    currentPagination={currentPagination}
                    isLoading={ticketsQuery.loading}
                    isRefreshing={isManuallyRefreshing}
                    onRefresh={handleManualRefresh}
                    onStatusChange={handleTicketStatusFilterChange}
                    onPageChange={handlePageChange}
                    onTicketSelect={handleTicketSelection}
                />

                <Ticket
                    ticket={selectedTicket}
                    ticketIndex={selectedTicketIndex}
                    account={accountAndCommerceOrdersByEmailQuery.data?.accountPrivileged}
                    supportProfiles={supportProfilesQuery.data?.supportAllSupportProfiles}
                    isLoadingProfiles={supportProfilesQuery.loading}
                    onTicketStatusChange={handleTicketStatusChange}
                    onTicketAssignSupportProfile={handleTicketAssignSupportProfile}
                    onTicketCommentCreate={handleTicketCommentCreate}
                    onTicketIndexChange={handleTicketIndexChange}
                    refetchTickets={refetchTickets}
                />

                {/* Right Sidebar */}
                {/* <CustomerAndTicketSidePanel
                    ticket={selectedTicket}
                    account={accountAndCommerceOrdersByEmailQuery.data?.accountPrivileged}
                    commerceOrders={accountAndCommerceOrdersByEmailQuery.data?.commerceOrdersPrivileged.items}
                /> */}
            </div>
        </div>
    );
}

// Export - Default
export default SupportPage;
