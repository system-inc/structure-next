'use client';

// Dependencies - React and Next.js
import React from 'react';
import { useUrlSearchParameters } from '@structure/source/utilities/next/NextNavigation';

// Dependencies - Main Components
// import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';
import { Form } from '@structure/source/common/forms/Form';
import { FormInputTextArea } from '@structure/source/common/forms/FormInputTextArea';
import { Pagination } from '@structure/source/common/navigation/Pagination';

// Dependencies - API
import { useQuery, useMutation } from '@apollo/client';
import {
    SupportTicketsAdminDocument,
    SupportTicketCommentCreateAdminDocument,
} from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Utilities
import { fullDate } from '@structure/source/utilities/Time';
import { extractLatestEmailContent } from '@structure/source/utilities/Email';

// Component - SupportPage
export function SupportPage() {
    // State
    const [selectedTicketId, setSelectedTicketId] = React.useState<string | null>(null);

    // URL Parameters
    const urlSearchParameters = useUrlSearchParameters();
    const page = parseInt(urlSearchParameters.get('page') as string) || 1;
    const itemsPerPage = 20;

    // Queries
    const ticketsQuery = useQuery(SupportTicketsAdminDocument, {
        variables: {
            pagination: {
                itemsPerPage,
                itemIndex: (page - 1) * itemsPerPage,
            },
        },
    });

    const [createComment] = useMutation(SupportTicketCommentCreateAdminDocument);

    // Selected Ticket
    const selectedTicket = ticketsQuery.data?.supportTicketsAdmin.items.find(
        (ticket) => ticket.id === selectedTicketId,
    );

    // Render the component
    return (
        <>
            {/* <InternalNavigationTrail /> */}
            <div className="grid h-[calc(100vh-64px)] grid-cols-[390px_1fr] gap-6">
                {/* Ticket List */}
                <div className="overflow-y-auto border-r border-light-3 dark:border-dark-3">
                    <h2 className="mb-3 mt-3 pl-4 text-xl font-medium">Support Tickets</h2>

                    {ticketsQuery.data?.supportTicketsAdmin.items.map(function (ticket) {
                        const lastTicketComment = ticket.comments[ticket.comments.length - 1];

                        // If the createdAt date is today, show the time of day, e.g. 12:30 PM
                        // Otherwise, show short month and day, e.g, Nov 5
                        const createdAtDate = new Date(ticket.createdAt);
                        const today = new Date();
                        const isToday =
                            createdAtDate.getDate() === today.getDate() &&
                            createdAtDate.getMonth() === today.getMonth() &&
                            createdAtDate.getFullYear() === today.getFullYear();
                        const createdAtText = isToday
                            ? createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : createdAtDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                        return (
                            <div
                                key={ticket.id}
                                className={`cursor-pointer border-b py-3 pl-12 pr-3 hover:bg-light-1 dark:hover:bg-dark-2 ${
                                    selectedTicketId === ticket.id
                                        ? 'border-primary-5 bg-light-1 dark:bg-dark-2'
                                        : 'border-light-3 dark:border-dark-3'
                                }`}
                                onClick={() => setSelectedTicketId(ticket.id)}
                            >
                                <div className="mb-2 flex items-center justify-between">
                                    <p className="neutral text-xs">{ticket.userEmailAddress}</p>
                                    <p className="neutral text-xs">{createdAtText}</p>
                                    {/* <span className="text-xs">{ticket.status}</span> */}
                                </div>
                                <h4 className="text-base font-medium">{ticket.title}</h4>
                                {lastTicketComment?.content && (
                                    <p className="neutral mt-2 text-sm">
                                        {extractLatestEmailContent(lastTicketComment?.content)}
                                    </p>
                                )}
                            </div>
                        );
                    })}

                    <Pagination
                        className="mr-4 mt-6"
                        page={page}
                        itemsPerPage={itemsPerPage}
                        itemsTotal={ticketsQuery.data?.supportTicketsAdmin.pagination?.itemsTotal ?? 0}
                        pagesTotal={ticketsQuery.data?.supportTicketsAdmin.pagination?.pagesTotal ?? 0}
                        useLinks={true}
                        itemsPerPageControl={false}
                        pageInputControl={false}
                    />
                </div>

                {/* Ticket Detail */}
                <div className="mt-3 overflow-y-auto pb-12 pr-6">
                    {selectedTicket ? (
                        <div>
                            <h2 className="mb-4 text-2xl font-medium">{selectedTicket.title}</h2>

                            {/* Ticket Information */}
                            <div className="mb-6 rounded-lg border border-light-3 p-4 dark:border-dark-3">
                                <p>
                                    <strong>Email:</strong> {selectedTicket.userEmailAddress}
                                </p>
                                <p>
                                    <strong>Status:</strong> {selectedTicket.status}
                                </p>
                                <p>
                                    <strong>Created:</strong> {fullDate(new Date(selectedTicket.createdAt))}
                                </p>
                            </div>

                            {/* Comments */}
                            <div className="space-y-4">
                                {selectedTicket.comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className={`rounded-lg p-4 ${
                                            comment.source === 'Agent'
                                                ? 'bg-primary-1 dark:bg-primary-9/20'
                                                : 'bg-light-1 dark:bg-dark-2'
                                        }`}
                                    >
                                        <div className="mb-2 flex justify-between text-xs">
                                            <span>{comment.source}</span>
                                            <span>{fullDate(new Date(comment.createdAt))}</span>
                                        </div>
                                        <p className="whitespace-pre-wrap">
                                            {extractLatestEmailContent(comment.content)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Reply Form */}
                            <Form
                                className="mt-6"
                                formInputs={[
                                    <FormInputTextArea
                                        key="reply"
                                        id="reply"
                                        label="Reply"
                                        placeholder="Type your reply..."
                                        rows={4}
                                        required={true}
                                    />,
                                ]}
                                buttonProperties={{
                                    children: 'Send Reply',
                                }}
                                onSubmit={async function (formValues) {
                                    await createComment({
                                        variables: {
                                            input: {
                                                ticketId: selectedTicket.id,
                                                content: formValues.reply,
                                                replyToCommentId: selectedTicket.comments[0]?.id || '',
                                            },
                                        },
                                    });
                                    return { success: true };
                                }}
                            />
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <p className="neutral">Select a ticket to view details.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

// Export - Default
export default SupportPage;
