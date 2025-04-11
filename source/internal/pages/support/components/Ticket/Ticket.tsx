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
} from '@project/source/api/GraphQlGeneratedCode';

// Component - Ticket
export interface TicketInterface {
    ticket?: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0]
    account?: SupportTicketAccountAndCommerceOrdersPrivelegedQuery['accountPrivileged']
    supportProfiles?: SupportAllSupportProfilesQuery['supportAllSupportProfiles']
    isLoadingProfiles: boolean;
    onTicketStatusChange: (ticketId: string, status: SupportTicketStatus) => void;
}
export function Ticket(properties: TicketInterface) {
    // Properties
    const { account } = properties;
    const defaultProfile = account?.defaultProfile;
    
    const getUserDisplayName = () => {
        if (!properties.account) return undefined;

        if (properties.account.defaultProfile.preferredName) {
            return properties.account.defaultProfile.preferredName;
        }
        if (properties.account.defaultProfile.displayName) {
            return properties.account.defaultProfile.displayName;
        }
        if (defaultProfile?.givenName && defaultProfile?.familyName) {
            return `${defaultProfile?.givenName} ${defaultProfile?.familyName}`;
        }

        return defaultProfile?.username;
    }

    return (
        <div className="flex flex-col w-full h-full overflow-hidden overscroll-none">
            { properties.ticket && (
                <>
                    <TicketHeader
                        subject={properties.ticket.title}
                        status={properties.ticket.status}
                    />
                    <TicketStatusAndAssignment
                        ticketId={properties.ticket.id}
                        ticketStatus={properties.ticket.status}
                        supportProfiles={properties.supportProfiles}
                        isLoadingProfiles={properties.isLoadingProfiles}
                        assignedToProfileId={properties.ticket.assignedToProfileId}
                        onTicketStatusChange={properties.onTicketStatusChange}
                    />
                    <TicketComments
                        userEmailAddress={properties.ticket.userEmailAddress}
                        comments={properties.ticket.comments}
                        userFullName={getUserDisplayName()}
                    />
                    <TicketMessageForm
                        ticketId={properties.ticket.id}
                        comments={properties.ticket.comments}
                    />
                </>
            )}
        </div>
    );
}