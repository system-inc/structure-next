'use client';

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import Badge from '@project/source/ui/base/Badge';
import { TicketComments } from '@structure/source/internal/pages/support/components/Ticket/TicketComments';
import { ProfileSupportTicketMessageForm } from './components/ProfileSupportTicketMessageForm';

// Dependencies - API
import { useQuery } from '@apollo/client';
import {
    ColumnFilterConditionOperator,
    ProfileSupportTicketDocument,
    SupportTicketStatus,
    SupportTicketCommentSource,
    SupportTicketCommentCreateInput,
} from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Hooks
import { useProfileSupportTicket } from './hooks/useProfileSupportTicket';

interface ProfileSupportTicketPageInterface {
    ticketIdentifier: string;
}

const ProfileSupportTicketPage = (properties: ProfileSupportTicketPageInterface) => {
    const { ticketQuery, createComment, refetchTicket } = useProfileSupportTicket(properties.ticketIdentifier);

    const ticket = ticketQuery.data?.supportTickets.items[0];

    const handleTicketCommentCreate = React.useCallback(
        async function (input: SupportTicketCommentCreateInput) {
            await createComment({
                variables: {
                    input,
                },
            });
        },
        [createComment],
    );

    if(!ticket) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            {/* Header */}
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

            {/* Scrollable comments */}
            <TicketComments
                userEmailAddress={ticket.userEmailAddress}
                comments={ticket.comments}
                viewer={SupportTicketCommentSource.User}
            />

            {/* Text input form */}
            <div className="mt-10">
                <ProfileSupportTicketMessageForm
                    ticketIdentifier={ticket.identifier}
                    comments={ticket.comments}
                    onTicketCommentCreate={createComment}
                    refetch={refetchTicket}
                />
            </div>
        </div>
    );
};
export default ProfileSupportTicketPage;
