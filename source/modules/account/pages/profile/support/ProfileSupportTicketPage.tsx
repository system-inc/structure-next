'use client';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Badge } from '@structure/source/common/notifications/Badge';
import { TicketComments } from '@structure/source/ops/pages/support/components/Ticket/TicketComments';
import { ProfileSupportTicketMessageForm } from './components/ProfileSupportTicketMessageForm';

// Dependencies - API
import { useQuery } from '@apollo/client';
import {
    ColumnFilterConditionOperator,
    ProfileSupportTicketDocument,
    SupportTicketStatus,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Component - ProfileSupportTicketPage
export interface ProfileSupportTicketPageProperties {
    ticketId: string;
}
export function ProfileSupportTicketPage(properties: ProfileSupportTicketPageProperties) {
    const pagination = {
        itemsPerPage: 1,
        filters: [
            {
                column: 'identifier',
                operator: ColumnFilterConditionOperator.Equal,
                value: properties.ticketId,
            },
        ],
    };

    const { data } = useQuery(ProfileSupportTicketDocument, {
        variables: { pagination },
        // fetchPolicy: 'cache-and-network',
        // notifyOnNetworkStatusChange: true,
        // Poll every minute
        pollInterval: 60000,
    });

    const ticket = data?.supportTickets?.items[0];

    if(!ticket) {
        return <div>Loading...</div>;
    }

    return (
        <div className="relative h-full">
            <div className="mb-8 flex items-center gap-4">
                <h2 className="text-xl font-medium">{ticket.title}</h2>
                <Badge
                    variant={ticket.status === SupportTicketStatus.Open ? 'success' : 'info'}
                    size="medium"
                    className="whitespace-nowrap"
                >
                    {ticket.status}
                </Badge>
            </div>
            <TicketComments userEmailAddress={ticket.userEmailAddress} comments={ticket.comments} viewer="User" />
            <ProfileSupportTicketMessageForm
                ticketIdentifier={ticket.identifier}
                comments={ticket.comments}
                onTicketCommentCreate={(input) => {
                    console.log('TICKET COMMENT CREATE', input);
                }}
            />
        </div>
    );
}
