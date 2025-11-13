// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { BorderContainer } from '../BorderContainer';
import { Button } from '@structure/source/components/buttons/Button';
import { InputSelect } from '@structure/source/components/forms/InputSelect';
import { Checkbox } from '@project/app/_components/form/Checkbox';

// Dependencies - Assets
import { ArchiveIcon, TrashIcon, ArrowsClockwiseIcon, FolderOpen } from '@phosphor-icons/react';

// Dependencies - API
import type { SupportTicketsPrivilegedQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import { SupportTicketStatus } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Component - TicketListHeader
export interface TicketListHeaderProperties {
    tickets: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'];
    selectedTicketIdentifiers: Set<string>;
    selectedStatus: SupportTicketStatus;
    isManuallyRefreshing: boolean;
    onSelectAllTickets: (checked: boolean) => void;
    onBulkArchive: () => void;
    onBulkDelete: () => void;
    onStatusChange: (status: SupportTicketStatus) => void;
    onRefresh: () => void;
}
export function TicketListHeader(properties: TicketListHeaderProperties) {
    // Calculate if all tickets are selected
    const allSelected =
        properties.tickets.length > 0 &&
        properties.tickets.every((ticket) => properties.selectedTicketIdentifiers.has(ticket.identifier));
    const someSelected = properties.selectedTicketIdentifiers.size > 0;

    // Status options for the dropdown
    const statusOptions = [
        { value: SupportTicketStatus.Open, content: 'Open' },
        { value: SupportTicketStatus.Closed, content: 'Archived' },
        { value: SupportTicketStatus.Deleted, content: 'Deleted' },
    ];

    // Render the component
    return (
        <BorderContainer>
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Master checkbox */}
                    <Checkbox
                        size="small"
                        checked={allSelected}
                        onCheckedChange={(checked) => properties.onSelectAllTickets(checked === true)}
                        aria-label="Select all tickets"
                    />

                    {/* Action buttons group */}
                    <div className="flex items-center gap-0.5">
                        {/* Archive/Unarchive button */}
                        {properties.selectedStatus === SupportTicketStatus.Closed ? (
                            <Button
                                variant="Ghost"
                                onClick={properties.onBulkArchive}
                                aria-label="Unarchive tickets"
                                className="p-2"
                                disabled={!someSelected && properties.tickets.length === 0}
                            >
                                <FolderOpen className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                variant="Ghost"
                                onClick={properties.onBulkArchive}
                                aria-label="Archive tickets"
                                className="p-2"
                                disabled={!someSelected && properties.tickets.length === 0}
                            >
                                <ArchiveIcon className="h-4 w-4" />
                            </Button>
                        )}

                        {/* Delete/Undelete button */}
                        {properties.selectedStatus === SupportTicketStatus.Deleted ? (
                            <Button
                                variant="Ghost"
                                onClick={properties.onBulkDelete}
                                aria-label="Restore tickets"
                                className="p-2"
                                disabled={!someSelected && properties.tickets.length === 0}
                            >
                                <FolderOpen className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                variant="Ghost"
                                onClick={properties.onBulkDelete}
                                aria-label="Delete tickets"
                                className="p-2"
                                disabled={!someSelected && properties.tickets.length === 0}
                            >
                                <TrashIcon className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Right side - Dropdown and Refresh */}
                <div className="flex items-center gap-1">
                    {/* Status filter dropdown */}
                    <InputSelect
                        defaultValue={properties.selectedStatus}
                        items={statusOptions}
                        onChange={(value) => value && properties.onStatusChange(value as SupportTicketStatus)}
                        className="min-w-[120px]"
                    />

                    {/* Refresh button */}
                    <Button variant="Ghost" onClick={properties.onRefresh} aria-label="Refresh tickets" className="p-2">
                        {properties.isManuallyRefreshing ? (
                            <ArrowsClockwiseIcon className="h-4 w-4 animate-spin" />
                        ) : (
                            <ArrowsClockwiseIcon className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>
        </BorderContainer>
    );
}
