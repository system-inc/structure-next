'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { TicketHeader } from './TicketHeader';
import { TicketStatusAndAssignment } from './TicketStatusAndAssignment';
import { TicketComments } from './TicketComments';
import { TicketMessageForm } from './TicketMessageForm';

// Dependencies - API
import {
    SupportTicketsPrivilegedQuery,
    SupportTicketAccountAndCommerceOrdersPrivelegedQuery,
    SupportTicketStatus,
    SupportAllSupportProfilesQuery,
    SupportTicketCommentCreateInput,
} from '@project/source/api/GraphQlGeneratedCode';

// Component - Ticket
export interface TicketInterface {
    ticket?: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0]
    ticketIndex?: number;
    account?: SupportTicketAccountAndCommerceOrdersPrivelegedQuery['accountPrivileged']
    supportProfiles?: SupportAllSupportProfilesQuery['supportAllSupportProfiles']
    isLoadingProfiles: boolean;
    onTicketStatusChange: ({ ticketId, status }: { ticketId: string; status: SupportTicketStatus; }) => void;
    onTicketAssignSupportProfile: ({ ticketId, supportProfileUsername }: {
        ticketId: string;
        supportProfileUsername: string;
    }) => void;
    onTicketCommentCreate: (input: SupportTicketCommentCreateInput) => void;
    onTicketIndexChange: (ticketIndex: number) => void;
    refetchTickets: () => void;
}
export function Ticket(properties: TicketInterface) {
    // Properties
    const { account } = properties;

    const userDisplayName = account?.defaultProfile.preferredName ||
        account?.defaultProfile.displayName ||
        (account?.defaultProfile.givenName && account?.defaultProfile.familyName
            ? `${account.defaultProfile.givenName} ${account.defaultProfile.familyName}`
            : undefined);

    return (
        <div className="flex h-full w-full flex-col overflow-hidden overscroll-none">
            {properties.ticket && (
                <>
                    <TicketHeader
                        subject={properties.ticket.title}
                        ticketIndex={properties.ticketIndex}
                        onTicketIndexChange={properties.onTicketIndexChange}
                    />
                    <TicketStatusAndAssignment
                        ticketId={properties.ticket.id}
                        ticketIdentifier={properties.ticket.identifier}
                        ticketStatus={properties.ticket.status}
                        supportProfiles={properties.supportProfiles}
                        isLoadingProfiles={properties.isLoadingProfiles}
                        assignedToProfile={properties.ticket.assignedToProfile}
                        onTicketStatusChange={properties.onTicketStatusChange}
                        onTicketAssignSupportProfile={properties.onTicketAssignSupportProfile}
                    />
                    <TicketComments
                        userEmailAddress={properties.ticket.userEmailAddress}
                        comments={properties.ticket.comments}
                        userFullName={userDisplayName}
                        viewer="Agent"
                    />
                    <TicketMessageForm
                        ticketIdentifier={properties.ticket.identifier}
                        comments={properties.ticket.comments}
                        onTicketCommentCreate={properties.onTicketCommentCreate}
                        refetchTickets={properties.refetchTickets}
                    />
                </>
            )}
        </div>
    );
}
