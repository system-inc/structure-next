'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TicketHeader } from './TicketHeader';
import { TicketStatusAndAssignment } from './TicketStatusAndAssignment';
import { TicketComments } from './TicketComments';
import { TicketMessageForm } from './TicketMessageForm';

// Dependencies - API
import { SupportTicketsPrivilegedQuery } from '@project/source/api/GraphQlGeneratedCode';

// Component - Ticket
export interface TicketInterface {
    ticket?: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0]
}
export function Ticket(properties: TicketInterface) {
    return (
        <div className="flex flex-col w-full h-full overflow-hidden overscroll-none">
            { properties.ticket && (
                <>
                    <TicketHeader
                        subject={properties.ticket.title}
                        status={properties.ticket.status}
                    />
                    <TicketStatusAndAssignment
                        status={properties.ticket.status}
                        assignedToProfileId={properties.ticket.assignedToProfileId}
                    />
                    <TicketComments comments={properties.ticket.comments} />
                    <TicketMessageForm
                        ticketId={properties.ticket.id}
                        comments={properties.ticket.comments}
                    />
                </>
            )}
        </div>
    );
}