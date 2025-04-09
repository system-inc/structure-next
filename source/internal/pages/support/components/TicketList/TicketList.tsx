'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Pagination } from '@structure/source/common/navigation/pagination/Pagination';
import { ScrollArea } from '@structure/source/common/interactions/ScrollArea';
import { TicketListHeader } from './TicketListHeader';
import { TicketListItem } from './TicketListItem';

// Dependencies - API
import { SupportTicketsPrivilegedQuery } from '@project/source/api/GraphQlGeneratedCode';
import { BorderContainer } from '../BorderContainer';

// Component - TicketList
interface TicketListInterface {
    tickets: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'];
    selectedTicketId: string | null;
    isLoading: boolean;
    isRefreshing: boolean;
    page: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    onRefresh: () => void;
    onStatusChange: (status: string) => void;
    onTicketSelect: (id: string) => void;
}
export function TicketList(properties: TicketListInterface) {
    return (
        <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden border-r border-light-3 dark:border-dark-3">
            <TicketListHeader
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
                                isSelected={ticket.id === properties.selectedTicketId}
                                isFirst={index === 0}
                                onSelect={properties.onTicketSelect}
                            />
                        ))
                    )}
                </ScrollArea>
            </div>

            <BorderContainer border="top">
                <Pagination
                    page={properties.page}
                    pagesTotal={properties.totalPages}
                    itemsTotal={properties.totalItems}
                    itemsPerPage={properties.itemsPerPage}
                    itemsPerPageControl={false}
                    pageInputControl={false}
                />
            </BorderContainer>
        </div>
    );
}
