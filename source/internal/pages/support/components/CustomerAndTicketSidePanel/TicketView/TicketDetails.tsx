'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import Badge from '@project/source/ui/base/Badge';
import { BorderContainer } from '../../BorderContainer';

// Dependencies - API
import { SupportTicketsPrivilegedQuery } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Utils
import { formatDateToShortDateWithTime } from '@structure/source/utilities/Time';

// Dependencies - Assets
import {
    // Envelope,
    // Phone
} from '@phosphor-icons/react';

// Component - TicketDetails
interface TicketDetailsInterface {
    ticket?: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0]
}
export function TicketDetails(properties: TicketDetailsInterface) {
    console.log("TICKET DETAILS - TICKET", properties.ticket);

    // Properties
    const { ticket } = properties;

    if (!ticket) {
        return (
            <BorderContainer>
                <div className="text-neutral-500">No ticket selected</div>
            </BorderContainer>
        )
    }
    
    return (
        <div className="flex flex-col gap-4 px-4 pt-3 pb-6 border-b">
            <div className="flex flex-row items-center justify-start gap-4 text-neutral-500">
                <div className="text-neutral-500 font-medium">
                    Ticket ID
                </div>
                {ticket.identifier}
            </div>
            <div className="flex flex-row items-center justify-start gap-4 text-neutral-500">
                <div className="text-neutral-500 font-medium">
                    Created On
                </div>
                {formatDateToShortDateWithTime(new Date(ticket.createdAt))}
            </div>
            <div className="flex flex-row items-center justify-start gap-4 text-neutral-500">
                <div className="text-neutral-500 font-medium">
                    Type
                </div>
                {ticket.type}
            </div>
            <div className="flex flex-row items-center justify-start gap-4 text-neutral-500">
                <div className="text-neutral-500 font-medium">
                    Title
                </div>
                {ticket.title}
            </div>
            <div className="flex flex-row items-center justify-start gap-4 text-neutral-500">
                <div className="text-neutral-500 font-medium">
                    Description
                </div>
                {ticket.description ?? '-'}
            </div>
            <div className="flex flex-row items-center justify-start gap-4 text-neutral-500">
                <div className="text-neutral-500 font-medium">
                    Status
                </div>
                {ticket.status}
            </div>
            <div className="flex flex-row items-center justify-start gap-4 text-neutral-500">
                <div className="text-neutral-500 font-medium">
                    Assigned to
                </div>
                {ticket.assignedToProfile?.displayName || 'Unassigned'}
            </div>
            <div className="flex flex-row items-center justify-start gap-4 text-neutral-500">
                <div className="text-neutral-500 font-medium">
                    User Last Comment
                </div>
                {formatDateToShortDateWithTime(new Date(ticket.lastUserCommentedAt))}
            </div>
            <div className="flex flex-row items-center justify-start gap-4 text-neutral-500">
                <div className="text-neutral-500 font-medium">
                    Answered?
                </div>
                {ticket.answered ? 'Yes' : 'No'}
            </div>
        </div>
    );
};