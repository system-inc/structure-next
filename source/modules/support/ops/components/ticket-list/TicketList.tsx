'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Pagination as Paginator } from '@structure/source/components/navigation/pagination/Pagination';
import { ScrollArea } from '@structure/source/components/containers/ScrollArea';
import { TicketListHeader } from './TicketListHeader';
import { TicketListItem } from './TicketListItem';
import { BorderContainer } from '../BorderContainer';

// Dependencies - API
import { Pagination, SupportTicketStatus } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import type { SupportTicketsPrivilegedQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - TicketList
interface TicketListProperties {
    tickets: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'];
    selectedTicketIdentifier: string | null;
    selectedStatus: SupportTicketStatus;
    currentPagination: Pagination;
    isLoading: boolean;
    isManuallyRefreshing: boolean;
    selectedTicketIdentifiers: Set<string>;
    onPageChange: (page: number) => void;
    onTicketSelect: (ticketIdentifier: string) => void;
    onToggleTicketSelection: (ticketIdentifier: string) => void;
    onSelectAllTickets: (checked: boolean) => void;
    onBulkArchive: () => void;
    onBulkDelete: () => void;
    onStatusChange: (status: SupportTicketStatus) => void;
    onRefresh: () => void;
}
export function TicketList(properties: TicketListProperties) {
    // State
    const [hasMounted, setHasMounted] = React.useState(false);

    // Effects
    React.useEffect(function () {
        setHasMounted(true);
    }, []);

    return (
        <div className="flex h-full flex-col">
            {/* Header - Fixed at top */}
            <div className="shrink-0">
                <TicketListHeader
                    tickets={properties.tickets}
                    selectedTicketIdentifiers={properties.selectedTicketIdentifiers}
                    selectedStatus={properties.selectedStatus}
                    isManuallyRefreshing={properties.isManuallyRefreshing}
                    onSelectAllTickets={properties.onSelectAllTickets}
                    onBulkArchive={properties.onBulkArchive}
                    onBulkDelete={properties.onBulkDelete}
                    onStatusChange={properties.onStatusChange}
                    onRefresh={properties.onRefresh}
                />
            </div>

            {/* Scrollable ticket list */}
            <div
                className={mergeClassNames(
                    'relative flex-1 overflow-auto rounded-bl-lg',
                    'before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-bl-lg',
                    'before:shadow-[inset_0_0_0_1px_rgba(168,85,247,0.6),inset_0_0_6px_rgba(168,85,247,0.3)]',
                    'before:transition-opacity before:duration-300 before:content-[""]',
                    'dark:before:shadow-[inset_0_0_0_1px_rgba(168,85,247,0.8),inset_0_0_6px_rgba(168,85,247,0.4)]',
                    (properties.isManuallyRefreshing || properties.isLoading) && hasMounted
                        ? 'before:opacity-100'
                        : 'before:opacity-0',
                )}
            >
                <ScrollArea>
                    {properties.tickets.map((ticket, index) => (
                        <TicketListItem
                            key={ticket.id}
                            ticket={ticket}
                            isSelected={ticket.identifier === properties.selectedTicketIdentifier}
                            isChecked={properties.selectedTicketIdentifiers.has(ticket.identifier)}
                            isFirst={index === 0}
                            onSelect={properties.onTicketSelect}
                            onCheckboxChange={() => properties.onToggleTicketSelection(ticket.identifier)}
                        />
                    ))}
                </ScrollArea>
            </div>

            {/* Pagination - Fixed at bottom */}
            {properties.currentPagination.pagesTotal > 1 && (
                <div className="shrink-0">
                    <BorderContainer border="top">
                        <Paginator
                            page={properties.currentPagination.page}
                            pagesTotal={properties.currentPagination.pagesTotal}
                            itemsTotal={properties.currentPagination.itemsTotal}
                            itemsPerPage={properties.currentPagination.itemsPerPage}
                            itemsPerPageControl={false}
                            pageInputControl={false}
                            firstAndLastPageControl={false}
                            onChange={(_, page) => properties.onPageChange(page)}
                        />
                    </BorderContainer>
                </div>
            )}
        </div>
    );
}
