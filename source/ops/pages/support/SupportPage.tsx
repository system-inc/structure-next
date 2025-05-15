'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlSearchParameters, useRouter } from '@structure/source/utilities/next/NextNavigation';

// Dependencies - Internal Components
import { TicketList } from './components/TicketList/TicketList';
import { Ticket } from './components/Ticket/Ticket';
import { CustomerAndTicketSidePanel } from './components/CustomerAndTicketSidePanel/CustomerAndTicketSidePanel';

// Dependencies - Hooks
import { useSupportTickets } from './hooks/useSupportTickets';
import { useAccountAndCommerceOrdersByEmail } from './hooks/useAccountAndCommerceOrdersByEmail';

// Dependencies - API
import {
    Pagination,
    SupportTicketStatus,
    SupportTicketCommentCreateInput,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Component - SupportPage
export function SupportPage() {
    // Add router
    const router = useRouter();
    // URL Parameters
    const urlSearchParameters = useUrlSearchParameters();

    const pageParam = urlSearchParameters.get('page') ? parseInt(urlSearchParameters?.get('page') as string) : 1;

    // State & Refs
    const [selectedStatus, setSelectedStatus] = React.useState<SupportTicketStatus>(
        (urlSearchParameters?.get('status') as SupportTicketStatus) || SupportTicketStatus.Open,
    );
    const [selectedTicketIdentifier, setSelectedTicketIdentifier] = React.useState<string | null>(
        urlSearchParameters?.get('ticket') ?? null,
    );
    const [currentPagination, setCurrentPagination] = React.useState<Pagination>({
        itemIndex: 0,
        itemIndexForNextPage: null,
        itemIndexForPreviousPage: null,
        itemsPerPage: 20,
        itemsTotal: 0,
        page: pageParam,
        pagesTotal: 0,
    });
    const [showMyTickets] = React.useState<boolean>(false);

    // const ticketDetailsRef = React.useRef<HTMLDivElement>(null);
    const commentsContainerRef = React.useRef<HTMLDivElement>(null);

    // Hooks
    const {
        ticketsQuery,
        createComment,
        // assignTicket,
        updateTicketStatus,
        isManuallyRefreshing,
        handleManualRefresh,
        supportProfilesQuery,
        refetchTickets,
    } = useSupportTickets(currentPagination.page, currentPagination.itemsPerPage, selectedStatus, showMyTickets);

    // Selected Ticket
    const selectedTicket = ticketsQuery.data?.supportTicketsPrivileged?.items?.find(
        (ticket) => ticket.identifier === selectedTicketIdentifier,
    );

    // Get account and commerce orders by email
    const { accountAndCommerceOrdersByEmailQuery } = useAccountAndCommerceOrdersByEmail(
        selectedTicket?.userEmailAddress,
    );

    // Fix?: client-side-unvalidated-url-redirection Allowing unvalidated redirection based on user-specified URLs
    function handleTicketStatusFilterChange(status: SupportTicketStatus) {
        setSelectedStatus(status);

        // Reset pagination state to page 1
        setCurrentPagination((prev) => ({
            ...prev,
            page: 1,
        }));

        // Update the URL parameters for status and reset the page
        const updatedParams = new URLSearchParams(urlSearchParameters ?? undefined);
        updatedParams.set('status', status);
        updatedParams.set('page', '1'); // Reset to the first page when status changes
        updatedParams.delete('ticket'); // Remove the ticket parameter temporarily

        router.replace(`?${updatedParams.toString()}`);
    }

    function handlePageChange(page: number) {
        setCurrentPagination((prev) => ({
            ...prev,
            page,
        }));

        const updatedParams = new URLSearchParams(urlSearchParameters ?? undefined);
        updatedParams.set('status', selectedStatus); // Preserve the current status
        updatedParams.set('page', page.toString()); // Update the page
        if(selectedTicketIdentifier) {
            updatedParams.set('ticket', selectedTicketIdentifier); // Preserve the selected ticket
        }

        // Update the URL
        router.replace(`?${updatedParams.toString()}`);
    }

    // Function to select ticket and update URL
    function handleTicketSelection(ticketIdentifier: string) {
        setSelectedTicketIdentifier(ticketIdentifier);
        const updatedParams = new URLSearchParams(urlSearchParameters ?? undefined);
        updatedParams.set('status', selectedStatus); // Preserve the current status
        updatedParams.set('page', currentPagination.page.toString()); // Preserve the current page
        updatedParams.set('ticket', ticketIdentifier); // Update the selected ticket
        router.replace(`?${updatedParams.toString()}`);
    }

    React.useEffect(
        function () {
            // Ensure ticketsQuery has data and the selectedStatus is set
            if(!ticketsQuery.data || !selectedStatus) return;

            // Get the filtered tickets based on the current status
            const filteredTickets = ticketsQuery.data.supportTicketsPrivileged?.items || [];

            // Check if the currently selected ticket exists in the filtered list
            const ticketExists = filteredTickets.some((ticket) => ticket.identifier === selectedTicketIdentifier);

            // If no ticket is selected or the selected ticket is invalid, select the first ticket
            if(!selectedTicketIdentifier || !ticketExists) {
                const firstTicket = filteredTickets[0];
                if(firstTicket) {
                    setSelectedTicketIdentifier(firstTicket.identifier); // Update the selected ticket ID in state

                    // Update the URL with the new ticket parameter and reset the page to 1
                    const newParams = new URLSearchParams(urlSearchParameters ?? undefined);
                    newParams.set('status', selectedStatus);
                    newParams.set('page', currentPagination.page.toString()); // Reset to the first page
                    newParams.set('ticket', firstTicket.identifier); // Set the first ticket ID
                    router.replace(`?${newParams.toString()}`);
                }
                else {
                    // If no tickets are available, clear the ticket parameter
                    setSelectedTicketIdentifier(null);
                    const newParams = new URLSearchParams(urlSearchParameters ?? undefined);
                    newParams.set('status', selectedStatus);
                    newParams.set('page', currentPagination.page.toString());
                    newParams.delete('ticket');
                    router.replace(`?${newParams.toString()}`);
                }
            }
        },
        [
            ticketsQuery.data,
            selectedStatus,
            selectedTicketIdentifier,
            urlSearchParameters,
            router,
            currentPagination.page,
        ], // Added missing dependency
    );

    React.useEffect(
        function () {
            if(!ticketsQuery.data) return;

            const pagination = ticketsQuery.data.supportTicketsPrivileged.pagination;
            if(pagination) {
                setCurrentPagination(pagination);
            }
        },
        [ticketsQuery.data],
    );

    // Scroll to bottom when selecting ticket or when new comments appear
    React.useEffect(
        function () {
            if(commentsContainerRef.current && selectedTicket?.comments) {
                commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
            }
        },
        [selectedTicket],
    );

    // Function to handle ticket assignment
    // const handleTicketAssign = React.useCallback(
    //     async function (username: string) {
    //         if (!ticketId) return;

    //         await assignTicket({
    //             variables: {
    //                 ticketId,
    //                 username,
    //             },
    //         });
    //     },
    //     [assignTicket, ticketId]
    // );

    const handleTicketStatusChange = React.useCallback(
        async function (ticketId: string, status: SupportTicketStatus) {
            await updateTicketStatus({
                variables: {
                    id: ticketId,
                    status,
                },
            });
        },
        [updateTicketStatus], // Removed unnecessary dependency
    );

    const handleTicketCommentCreate = React.useCallback(
        async function (input: SupportTicketCommentCreateInput) {
            await createComment({
                variables: {
                    input,
                },
            });
        },
        [createComment],
    );

    // Render the component
    return (
        <div className="relative h-[calc(100vh-3.5rem)] overflow-hidden">
            <div className="grid h-full grid-cols-[390px_1fr_390px]">
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
                    account={accountAndCommerceOrdersByEmailQuery.data?.accountPrivileged}
                    supportProfiles={supportProfilesQuery.data?.supportAllSupportProfiles}
                    isLoadingProfiles={supportProfilesQuery.loading}
                    onTicketStatusChange={handleTicketStatusChange}
                    onTicketCommentCreate={handleTicketCommentCreate}
                    refetchTickets={refetchTickets}
                />

                {/* Right Sidebar */}
                <CustomerAndTicketSidePanel
                    ticket={selectedTicket}
                    account={accountAndCommerceOrdersByEmailQuery.data?.accountPrivileged}
                    commerceOrders={accountAndCommerceOrdersByEmailQuery.data?.commerceOrdersPrivileged.items}
                />
            </div>
        </div>
    );
}

// Export - Default
export default SupportPage;
