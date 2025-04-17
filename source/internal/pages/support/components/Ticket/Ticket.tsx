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
} from '@project/source/api/GraphQlGeneratedCode';

// Component - Ticket
export interface TicketInterface {
    ticket?: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0];
    account?: SupportTicketAccountAndCommerceOrdersPrivelegedQuery['accountPrivileged'];
}
export function Ticket(properties: TicketInterface) {
    // Properties
    const { ticket, account } = properties;
    const defaultProfile = account?.defaultProfile;

    const getUserDisplayName = () => {
        if(!properties.account) return undefined;

        if(properties.account.defaultProfile.preferredName) {
            return properties.account.defaultProfile.preferredName;
        }
        if(properties.account.defaultProfile.displayName) {
            return properties.account.defaultProfile.displayName;
        }
        if(defaultProfile?.givenName && defaultProfile?.familyName) {
            return `${defaultProfile?.givenName} ${defaultProfile?.familyName}`;
        }

        return defaultProfile?.username;
    };

    return (
        <div className="flex h-full w-full flex-col overflow-hidden overscroll-none">
            {properties.ticket && (
                <>
                    <TicketHeader subject={properties.ticket.title} status={properties.ticket.status} />
                    <TicketStatusAndAssignment
                        status={properties.ticket.status}
                        assignedToProfileId={properties.ticket.assignedToProfileId}
                    />
                    <TicketComments
                        userEmailAddress={properties.ticket.userEmailAddress}
                        comments={properties.ticket.comments}
                        userFullName={getUserDisplayName()}
                    />
                    <TicketMessageForm ticketIdentifier={properties.ticket.id} comments={properties.ticket.comments} />
                </>
            )}
        </div>
    );
}
