'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TicketHeader } from '@structure/source/modules/support/ops/components/ticket/TicketHeader';
import { TicketComments } from '@structure/source/modules/support/ops/components/ticket/TicketComments';
import { TicketMessageForm } from '@structure/source/modules/support/ops/components/ticket/TicketMessageForm';

// Dependencies - API
import {
    SupportTicketStatus,
    SupportTicketCommentCreateInput,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';
import type {
    SupportTicketsPrivilegedQuery,
    SupportAllSupportProfilesQuery,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Component - Ticket
export interface TicketProperties {
    ticket?: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0];
    supportProfiles?: SupportAllSupportProfilesQuery['supportAllSupportProfiles'];
    isLoadingProfiles: boolean;
    onTicketStatusChange: (ticketId: string, status: SupportTicketStatus) => void;
    onTicketCommentCreate: (input: SupportTicketCommentCreateInput) => void;
    refetchTickets: () => void;
}
export function Ticket(properties: TicketProperties) {
    return (
        <div className="flex h-full w-full flex-col overflow-hidden overscroll-none">
            {properties.ticket && (
                <>
                    {/* Header - Fixed at top */}
                    <div className="shrink-0">
                        <TicketHeader subject={properties.ticket.title} status={properties.ticket.status} />
                    </div>

                    {/* Comments - Scrollable area that takes remaining space */}
                    <TicketComments
                        userEmailAddress={properties.ticket.userEmailAddress}
                        comments={properties.ticket.comments}
                        ticketAttachments={properties.ticket.attachments}
                        userFullName={undefined}
                        viewer="Agent"
                    />

                    {/* Message Form - Fixed at bottom */}
                    <div className="shrink-0">
                        <TicketMessageForm
                            ticketIdentifier={properties.ticket.identifier}
                            comments={properties.ticket.comments}
                            onTicketCommentCreate={properties.onTicketCommentCreate}
                            refetchTickets={properties.refetchTickets}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
