'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlSearchParameters, useRouter } from '@structure/source/router/Navigation';

// Dependencies - Internal Components
import { TicketList } from '@structure/source/modules/support/ops/components/ticket-list/TicketList';

// Dependencies - Hooks
import { useSupportTickets } from '@structure/source/modules/support/ops/hooks/useSupportTickets';

// Dependencies - API
import { Pagination, SupportTicketStatus } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Component - OpsSupportPageNavigation
export interface OpsSupportPageNavigationProperties {
    currentlyViewedTicketIdentifier?: string | null;
}
export function OpsSupportPageNavigation(properties: OpsSupportPageNavigationProperties) {
    // Hooks
    const router = useRouter();
    const urlSearchParameters = useUrlSearchParameters();

    /*
     * STATE ARCHITECTURE NOTES:
     *
     * This component uses a hybrid state management approach (React state + URL parameters):
     *
     * WHY NOT "URL as single source of truth"?
     * 1. GraphQL Hook Stability: The useSupportTickets hook needs stable state values, not constantly-changing
     *    URL parameters. If we read from URL on every render, the hook would refetch on every URL change.
     * 2. Server-Derived Data: The Pagination object contains server-computed values (itemsTotal, pagesTotal,
     *    itemIndexForNextPage, etc.) that MUST live in state—they're not URL-derived.
     * 3. Synchronous Updates: State updates are synchronous and predictable for event handlers, preventing
     *    race conditions between URL updates and GraphQL responses.
     *
     * DATA FLOW:
     * User Action → Update State → Sync to URL (Effect 2) → URL changes → Browser history updated
     *                ↓
     *           GraphQL Query (with stable state inputs) → Server Response → Update Pagination State
     *
     * The ref-based deduplication (lastUrlReference) prevents infinite loops where:
     * State changes → Effect syncs to URL → URL change triggers re-render → Effect runs again → Infinite loop
     */

    // State - UI selections (initialized from URL, then managed independently)
    const [selectedStatus, setSelectedStatus] = React.useState<SupportTicketStatus>(function () {
        return (urlSearchParameters?.get('status') as SupportTicketStatus) || SupportTicketStatus.Open;
    });
    const [selectedTicketIdentifier, setSelectedTicketIdentifier] = React.useState<string | null>(function () {
        return urlSearchParameters?.get('ticket') ?? null;
    });

    // State - Pagination (server-derived data from GraphQL responses)
    const [currentPagination, setCurrentPagination] = React.useState<Pagination>(function () {
        const pageFromUrl = urlSearchParameters.get('page') ? parseInt(urlSearchParameters.get('page') as string) : 1;
        return {
            itemIndex: 0,
            itemIndexForNextPage: null,
            itemIndexForPreviousPage: null,
            itemsPerPage: 20,
            itemsTotal: 0,
            page: pageFromUrl,
            pagesTotal: 0,
        };
    });
    const [showMyTickets] = React.useState<boolean>(false);

    // State - Checkbox selections for bulk operations
    const [selectedTicketIdentifiers, setSelectedTicketIdentifiers] = React.useState<Set<string>>(new Set());

    // Ref to prevent duplicate URL updates (breaks infinite loop: state → URL → re-render → state → URL...)
    const lastUrlReference = React.useRef<string>('');

    // Hooks
    const supportTickets = useSupportTickets(
        currentPagination.page,
        currentPagination.itemsPerPage,
        selectedStatus,
        showMyTickets,
    );

    // Helper function to update URL parameters with deduplication
    // This centralizes URL construction and prevents duplicate updates via ref comparison
    const updateUrlParameters = React.useCallback(
        function (updates: { status?: SupportTicketStatus; page?: number; ticket?: string | null }) {
            const updatedParameters = new URLSearchParams(urlSearchParameters ?? undefined);

            // Apply updates (preserve current values if not specified in updates)
            updatedParameters.set('status', updates.status ?? selectedStatus);
            updatedParameters.set('page', (updates.page ?? currentPagination.page).toString());

            if(updates.ticket !== undefined) {
                if(updates.ticket) {
                    updatedParameters.set('ticket', updates.ticket);
                }
                else {
                    updatedParameters.delete('ticket');
                }
            }
            else if(selectedTicketIdentifier) {
                updatedParameters.set('ticket', selectedTicketIdentifier);
            }

            const newUrl = `?${updatedParameters.toString()}`;

            // Only update if URL actually changed (prevents infinite loops)
            if(newUrl !== lastUrlReference.current) {
                lastUrlReference.current = newUrl;
                router.replace(newUrl);
            }
        },
        [router, urlSearchParameters, selectedStatus, currentPagination.page, selectedTicketIdentifier],
    );

    // Function to handle ticket status filter changes
    function handleTicketStatusFilterChange(status: SupportTicketStatus) {
        setSelectedStatus(status);

        // Reset pagination state to page 1
        setCurrentPagination((previousCurrentPagination) => ({
            ...previousCurrentPagination,
            page: 1,
        }));

        // Clear checkbox selections when changing status
        setSelectedTicketIdentifiers(new Set());

        // Update URL: new status, reset to page 1, clear ticket selection
        updateUrlParameters({ status, page: 1, ticket: null });
    }

    // Function to handle page changes
    function handlePageChange(page: number) {
        setCurrentPagination((previousCurrentPagination) => ({
            ...previousCurrentPagination,
            page,
        }));

        // Update URL: new page, preserve status and ticket
        updateUrlParameters({ page });
    }

    // Function to handle ticket selection
    function handleTicketSelection(ticketIdentifier: string) {
        setSelectedTicketIdentifier(ticketIdentifier);

        // Update URL: new ticket, preserve status and page
        updateUrlParameters({ ticket: ticketIdentifier });
    }

    // Function to toggle ticket selection for bulk operations
    function toggleTicketSelection(ticketIdentifier: string) {
        setSelectedTicketIdentifiers(function (previous) {
            const newSelection = new Set(previous);
            if(newSelection.has(ticketIdentifier)) {
                newSelection.delete(ticketIdentifier);
            }
            else {
                newSelection.add(ticketIdentifier);
            }
            return newSelection;
        });
    }

    // Function to select or deselect all tickets in the current view
    function selectAllTickets(checked: boolean) {
        if(checked) {
            const allTicketIdentifiers = new Set(
                supportTickets.ticketsQuery.data?.supportTicketsPrivileged.items.map((ticket) => ticket.identifier) ||
                    [],
            );
            setSelectedTicketIdentifiers(allTicketIdentifiers);
        }
        else {
            setSelectedTicketIdentifiers(new Set());
        }
    }

    // Function to handle bulk archive/unarchive
    async function handleBulkArchive() {
        // Determine which tickets to archive/unarchive:
        // If checkboxes are selected, use those. Otherwise, use the currently viewed ticket.
        let ticketIdentifiersToProcess: string[] = [];

        if(selectedTicketIdentifiers.size > 0) {
            // Use checkbox selections
            ticketIdentifiersToProcess = Array.from(selectedTicketIdentifiers);
        }
        else if(properties.currentlyViewedTicketIdentifier) {
            // Use currently viewed ticket
            ticketIdentifiersToProcess = [properties.currentlyViewedTicketIdentifier];
        }
        else {
            return; // No tickets to process
        }

        // Get the tickets and their IDs
        const tickets = supportTickets.ticketsQuery.data?.supportTicketsPrivileged.items || [];
        const ticketsToProcess = ticketIdentifiersToProcess
            .map((identifier) => tickets.find((ticket) => ticket.identifier === identifier))
            .filter((ticket): ticket is NonNullable<typeof ticket> => ticket !== undefined);

        // Check if all selected tickets are Closed
        const allClosed = ticketsToProcess.every((ticket) => ticket.status === SupportTicketStatus.Closed);

        // Determine target status: if all closed, open them; otherwise close all
        const targetStatus = allClosed ? SupportTicketStatus.Open : SupportTicketStatus.Closed;

        // Update tickets to target status
        await Promise.all(
            ticketsToProcess.map((ticket) =>
                supportTickets.updateTicketStatus({
                    id: ticket.id,
                    status: targetStatus,
                }),
            ),
        );

        // Clear selection after successful action
        setSelectedTicketIdentifiers(new Set());
    }

    // Function to handle bulk delete/restore
    async function handleBulkDelete() {
        // Determine which tickets to delete/restore:
        // If checkboxes are selected, use those. Otherwise, use the currently viewed ticket.
        let ticketIdentifiersToProcess: string[] = [];

        if(selectedTicketIdentifiers.size > 0) {
            // Use checkbox selections
            ticketIdentifiersToProcess = Array.from(selectedTicketIdentifiers);
        }
        else if(properties.currentlyViewedTicketIdentifier) {
            // Use currently viewed ticket
            ticketIdentifiersToProcess = [properties.currentlyViewedTicketIdentifier];
        }
        else {
            return; // No tickets to process
        }

        // Get the tickets and their IDs
        const tickets = supportTickets.ticketsQuery.data?.supportTicketsPrivileged.items || [];
        const ticketsToProcess = ticketIdentifiersToProcess
            .map((identifier) => tickets.find((ticket) => ticket.identifier === identifier))
            .filter((ticket): ticket is NonNullable<typeof ticket> => ticket !== undefined);

        // Check if all selected tickets are Deleted
        const allDeleted = ticketsToProcess.every((ticket) => ticket.status === SupportTicketStatus.Deleted);

        // Determine target status: if all deleted, restore them to Open; otherwise delete all
        const targetStatus = allDeleted ? SupportTicketStatus.Open : SupportTicketStatus.Deleted;

        // Update tickets to target status
        await Promise.all(
            ticketsToProcess.map((ticket) =>
                supportTickets.updateTicketStatus({
                    id: ticket.id,
                    status: targetStatus,
                }),
            ),
        );

        // Clear selection after successful action
        setSelectedTicketIdentifiers(new Set());
    }

    // Auto-select first ticket when data loads or current selection becomes invalid
    // Example: Switching from "Open" to "Closed" status may invalidate the currently selected ticket
    React.useEffect(
        function () {
            if(!supportTickets.ticketsQuery.data || !selectedStatus) return;

            const filteredTickets = supportTickets.ticketsQuery.data.supportTicketsPrivileged?.items || [];
            const ticketExists = filteredTickets.some((ticket) => ticket.identifier === selectedTicketIdentifier);

            // Auto-select first ticket if no ticket is selected or current selection doesn't exist in filtered results
            if(!selectedTicketIdentifier || !ticketExists) {
                const firstTicket = filteredTickets[0];
                setSelectedTicketIdentifier(firstTicket?.identifier ?? null);
            }
        },
        [supportTickets.ticketsQuery.data, selectedStatus, selectedTicketIdentifier],
    );

    // Sync React state changes to URL parameters
    // This effect runs when state changes (from user actions or auto-selection) and updates the URL accordingly
    // The helper function (updateUrlParameters) prevents infinite loops via ref-based deduplication
    React.useEffect(
        function () {
            updateUrlParameters({
                status: selectedStatus,
                page: currentPagination.page,
                ticket: selectedTicketIdentifier,
            });
        },
        [updateUrlParameters, selectedStatus, currentPagination.page, selectedTicketIdentifier],
    );

    // Update pagination state from GraphQL responses
    // The server returns computed pagination data (itemsTotal, pagesTotal, etc.) that we store in state
    React.useEffect(
        function () {
            if(!supportTickets.ticketsQuery.data) return;

            const pagination = supportTickets.ticketsQuery.data.supportTicketsPrivileged.pagination;
            if(pagination) {
                setCurrentPagination(pagination);
            }
        },
        [supportTickets.ticketsQuery.data],
    );

    // Render the component
    return (
        <TicketList
            tickets={supportTickets.ticketsQuery.data?.supportTicketsPrivileged.items || []}
            selectedTicketIdentifier={selectedTicketIdentifier}
            selectedStatus={selectedStatus}
            currentPagination={currentPagination}
            isLoading={supportTickets.ticketsQuery.loading}
            isManuallyRefreshing={supportTickets.isManuallyRefreshing}
            selectedTicketIdentifiers={selectedTicketIdentifiers}
            onPageChange={handlePageChange}
            onTicketSelect={handleTicketSelection}
            onToggleTicketSelection={toggleTicketSelection}
            onSelectAllTickets={selectAllTickets}
            onBulkArchive={handleBulkArchive}
            onBulkDelete={handleBulkDelete}
            onStatusChange={handleTicketStatusFilterChange}
            onRefresh={supportTickets.handleManualRefresh}
        />
    );
}
