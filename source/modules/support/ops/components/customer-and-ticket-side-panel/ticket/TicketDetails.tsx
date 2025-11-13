'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
// import { Badge } from '@structure/source/components/notifications/Badge';
import { BorderContainer } from '../../BorderContainer';

// Dependencies - API
import type { SupportTicketsPrivilegedQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utils
import { dateTimeCompact } from '@structure/source/utilities/time/Time';

// Component - TicketDetails
export interface TicketDetailsProperties {
    ticket?: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0];
}
export function TicketDetails(properties: TicketDetailsProperties) {
    console.log('TICKET DETAILS - TICKET', properties.ticket);

    if(!properties.ticket) {
        return (
            <BorderContainer>
                <div className="content--2">No ticket selected</div>
            </BorderContainer>
        );
    }

    return (
        <div className="flex flex-col gap-4 border-b border--0 px-4 pt-3 pb-6">
            <div className="flex flex-row items-center justify-start gap-4 content--2">
                <div className="font-medium content--2">Ticket ID</div>
                {properties.ticket.identifier}
            </div>
            <div className="flex flex-row items-center justify-start gap-4 content--2">
                <div className="font-medium content--2">Created On</div>
                {dateTimeCompact(new Date(properties.ticket.createdAt))}
            </div>
            <div className="flex flex-row items-center justify-start gap-4 content--2">
                <div className="font-medium content--2">Type</div>
                {properties.ticket.type}
            </div>
            <div className="flex flex-row items-center justify-start gap-4 content--2">
                <div className="font-medium content--2">Title</div>
                {properties.ticket.title}
            </div>
            <div className="flex flex-row items-center justify-start gap-4 content--2">
                <div className="font-medium content--2">Description</div>
                {properties.ticket.description ?? '-'}
            </div>
            <div className="flex flex-row items-center justify-start gap-4 content--2">
                <div className="font-medium content--2">Status</div>
                {properties.ticket.status}
            </div>
            <div className="flex flex-row items-center justify-start gap-4 content--2">
                <div className="font-medium content--2">Assigned to</div>
                {properties.ticket.assignedToProfile?.displayName || 'Unassigned'}
            </div>
            <div className="flex flex-row items-center justify-start gap-4 content--2">
                <div className="font-medium content--2">User Last Comment</div>
                {dateTimeCompact(new Date(properties.ticket.lastUserCommentedAt))}
            </div>
            <div className="flex flex-row items-center justify-start gap-4 content--2">
                <div className="font-medium content--2">Answered?</div>
                {properties.ticket.answered ? 'Yes' : 'No'}
            </div>
        </div>
    );
}
