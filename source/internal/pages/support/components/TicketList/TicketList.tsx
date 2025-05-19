'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Pagination } from '@structure/source/common/navigation/pagination/Pagination';
import { ScrollArea } from '@structure/source/common/interactions/ScrollArea';
import { TicketListHeader } from './TicketListHeader';
import { TicketListItem } from './TicketListItem';
import { BorderContainer } from '../BorderContainer';

// Dependencies - API
import {
    SupportTicketsPrivilegedQuery,
    SupportTicketStatus,
    Pagination as PaginationType,
} from '@project/source/api/GraphQlGeneratedCode';

// Component - TicketList
interface TicketListInterface {
    tickets: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'];
    selectedTicketIdentifier: string | null;
    selectedStatus: SupportTicketStatus;
    currentPagination: PaginationType;
    isLoading: boolean;
    isRefreshing: boolean;
    onRefresh: () => void;
    onStatusChange: (status: SupportTicketStatus) => void;
    onPageChange: (page: number) => void;
    onTicketSelect: (id: string) => void;
}
export function TicketList(properties: TicketListInterface) {
    return (
        <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden border-r border-light-3 dark:border-dark-3">
            <TicketListHeader
                selectedStatus={properties.selectedStatus}
                isRefreshing={properties.isRefreshing}
                onRefresh={properties.onRefresh}
                onStatusChange={properties.onStatusChange}
            />

            <div className="h-full overflow-hidden">
                <ScrollArea>
                    {properties.isLoading ? (
                        <div className="flex h-32 items-center justify-center">
                            <p className="neutral">Loading tickets...</p>
                        </div>
                    ) : properties.tickets.length === 0 ? (
                        <div className="flex h-32 items-center justify-center">
                            <p className="neutral">No tickets found.</p>
                        </div>
                    ) : (
                        properties.tickets.map((ticket, index) => (
                            <TicketListItem
                                key={ticket.id}
                                ticket={ticket}
                                isSelected={ticket.identifier === properties.selectedTicketIdentifier}
                                isFirst={index === 0}
                                onSelect={properties.onTicketSelect}
                            />
                        ))
                    )}
                </ScrollArea>
            </div>

            { properties.currentPagination.pagesTotal > 1 && (
                <BorderContainer border="top">
                    <Pagination
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
            )}

            
        </div>
    );
}
