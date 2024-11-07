'use client';

// Dependencies - React and Next.js
import React from 'react';
import Image from 'next/image';
import { useUrlSearchParameters, useRouter } from '@structure/source/utilities/next/NextNavigation';

// Dependencies - Main Components
import { Form } from '@structure/source/common/forms/Form';
import { FormInputTextArea } from '@structure/source/common/forms/FormInputTextArea';
import { Pagination } from '@structure/source/common/navigation/Pagination';
import { ScrollArea } from '@structure/source/common/interactions/ScrollArea';
import { InputSelect } from '@structure/source/common/forms/InputSelect';
import { FileCarouselInterface } from '@structure/source/common/files/FileCarousel';
import { FileCarouselDialog } from '@structure/source/common/files/FileCarouselDialog';

// Dependencies - API
import { useQuery, useMutation } from '@apollo/client';
import {
    ColumnFilterConditionOperator,
    OrderByDirection,
    SupportTicketsAdminQuery,
    SupportTicketsAdminDocument,
    SupportTicketCommentCreateAdminDocument,
} from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Utilities
import { fullDate } from '@structure/source/utilities/Time';
import { extractLatestEmailContent } from '@structure/source/utilities/Email';
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';

// Status filter options
const STATUS_OPTIONS = [
    { value: 'Open', content: 'Open Tickets' },
    { value: 'Closed', content: 'Closed Tickets' },
    { value: 'Deleted', content: 'Deleted Tickets' },
];

// Helper function to determine if URL is an image
function isImageUrl(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
}

// Component - CommentAttachments
interface CommentAttachmentsProps {
    attachments: SupportTicketsAdminQuery['supportTicketsAdmin']['items'][0]['comments'][0]['attachments'];
    isAgent: boolean;
}

function CommentAttachments({ attachments, isAgent }: CommentAttachmentsProps) {
    if(!attachments?.length) return null;

    return (
        <div className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
            <div className={`mt-1 flex max-w-[80%] flex-wrap gap-2`}>
                {attachments.map((attachment, index) => {
                    const globalIndex = attachments.findIndex((a) => a.url === attachment.url);
                    return (
                        <div
                            key={index}
                            className={`rounded-lg ${isAgent ? 'bg-blue text-light' : 'bg-light-1 dark:bg-dark-2'}`}
                        >
                            {isImageUrl(attachment.url) ? (
                                <div
                                    onClick={() => {
                                        // setSelectedImageIndex(globalIndex);
                                        // setDialogOpen(true);
                                    }}
                                    className="cursor-pointer"
                                >
                                    <Image
                                        src={attachment.url}
                                        alt="Attachment"
                                        width={200}
                                        height={200}
                                        className="rounded-lg object-cover"
                                    />
                                </div>
                            ) : (
                                <a
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block p-3 text-sm hover:underline"
                                >
                                    📎 Download {attachment.type}
                                </a>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Component - SupportPage
export function SupportPage() {
    // URL Parameters
    const urlSearchParameters = useUrlSearchParameters();
    const page = parseInt(urlSearchParameters.get('page') as string) || 1;
    const itemsPerPage = 20;

    // Add router
    const router = useRouter();

    // State & Refs
    const [selectedTicketId, setSelectedTicketId] = React.useState<string | null>(urlSearchParameters.get('ticket'));
    const ticketDetailsRef = React.useRef<HTMLDivElement>(null);
    const commentsContainerRef = React.useRef<HTMLDivElement>(null);

    // Add status filter state
    const [selectedStatus, setSelectedStatus] = React.useState<string>('Open');

    // Queries
    const ticketsQuery = useQuery(SupportTicketsAdminDocument, {
        variables: {
            pagination: {
                itemsPerPage,
                itemIndex: (page - 1) * itemsPerPage,
                filters: [
                    {
                        column: 'status',
                        operator: ColumnFilterConditionOperator.Equal,
                        value: selectedStatus,
                    },
                ],
            },
            orderBy: {
                key: 'createdAt',
                direction: OrderByDirection.Descending,
            },
        },
    });

    // Modify the createComment mutation to include refetch
    const [createComment] = useMutation(SupportTicketCommentCreateAdminDocument, {
        refetchQueries: ['SupportTicketsAdmin'],
    });

    // Add loading state for manual refresh
    const [isManuallyRefreshing, setIsManuallyRefreshing] = React.useState(false);

    // Function to handle manual refresh
    const handleManualRefresh = React.useCallback(
        function () {
            setIsManuallyRefreshing(true);
            ticketsQuery.refetch().finally(() => {
                setIsManuallyRefreshing(false);
            });
        },
        [ticketsQuery],
    ); // Add ticketsQuery as a dependency

    // Add auto-refresh interval
    React.useEffect(
        function () {
            // Set up auto-refresh every minute
            const intervalId = setInterval(function () {
                handleManualRefresh();
            }, 60000); // 60000ms = 1 minute

            // Cleanup on unmount
            return function () {
                clearInterval(intervalId);
            };
        },
        [ticketsQuery, handleManualRefresh], // Add ticketsQuery as dependency to avoid stale closure
    );

    // Function to format date without leading zeros
    function formatDate(date: Date): string {
        const today = new Date();
        const isToday =
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();

        if(isToday) {
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const hour = hours % 12 || 12; // Convert 0 to 12
            return `${hour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    // Selected Ticket
    const selectedTicket = ticketsQuery.data?.supportTicketsAdmin?.items?.find(
        (ticket) => ticket.id === selectedTicketId,
    );

    // Function to select ticket and update URL
    const handleTicketSelection = React.useCallback(
        function (ticketId: string) {
            setSelectedTicketId(ticketId);
            const newParams = new URLSearchParams(urlSearchParameters);
            newParams.set('ticket', ticketId);
            router.replace(`?${newParams.toString()}`);
        },
        [router, urlSearchParameters],
    );

    // Modify the auto-select effect to respect URL parameter
    React.useEffect(
        function () {
            const items = ticketsQuery.data?.supportTicketsAdmin?.items;
            const urlTicketId = urlSearchParameters.get('ticket');

            const firstTicket = items?.[0];

            if(firstTicket) {
                if(urlTicketId) {
                    // Check if the ticket from URL exists in the list
                    const ticketExists = items.some((ticket) => ticket.id === urlTicketId);
                    if(ticketExists) {
                        setSelectedTicketId(urlTicketId);
                    }
                    else {
                        // If ticket doesn't exist, select first one and update URL
                        handleTicketSelection(firstTicket.id);
                    }
                }
                else if(!selectedTicketId) {
                    // No ticket in URL and none selected, select first one
                    handleTicketSelection(firstTicket.id);
                }
            }
        },
        [ticketsQuery.data, urlSearchParameters, handleTicketSelection, selectedTicketId],
    );

    // Scroll to bottom when selecting ticket or when new comments appear
    React.useEffect(
        function () {
            if(commentsContainerRef.current && selectedTicket?.comments) {
                commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
            }
        },
        [selectedTicket],
    );

    // Add dialog state
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

    // Get all attachments from comments
    const allAttachments =
        selectedTicket?.comments.reduce((acc: FileCarouselInterface['files'], comment) => {
            const attachments: FileCarouselInterface['files'] = (comment.attachments || []).map(function (attachment) {
                return {
                    url: attachment.url || '',
                    metadata: {
                        Source: comment.source,
                        Date: formatDate(new Date(comment.createdAt)),
                    },
                };
            });
            return acc.concat(attachments);
        }, []) || [];

    // Render the component
    return (
        <>
            <div className="grid h-full grid-cols-[390px_1fr] gap-6">
                {/* Left Navigation */}
                <div className="flex h-full flex-col border-r border-light-3 dark:border-dark-3">
                    {/* Title and Refresh */}
                    <div className="flex items-center justify-between pb-3 pl-4 pr-4 pt-3">
                        <div className="group flex cursor-pointer items-center" onClick={handleManualRefresh}>
                            <h2 className="text-xl font-medium">Support Tickets</h2>
                            {isManuallyRefreshing && <BrokenCircleIcon className="ml-2 h-4 w-4 animate-spin" />}
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="mb-3 px-4">
                        <InputSelect
                            className="w-full"
                            items={STATUS_OPTIONS}
                            defaultValue="Open"
                            onChange={function (value) {
                                setSelectedStatus(value || 'Open');
                            }}
                        />
                    </div>

                    {/* Tickets ScrollArea */}
                    <div className="flex-grow">
                        <ScrollArea className="">
                            {/* Loading State */}
                            {ticketsQuery.loading && !isManuallyRefreshing && (
                                <div className="flex items-center justify-center py-8">
                                    <BrokenCircleIcon className="h-6 w-6 animate-spin" />
                                </div>
                            )}
                            {/* Tickets */}
                            {ticketsQuery.data?.supportTicketsAdmin.items.map(function (ticket, index) {
                                const lastTicketComment = ticket.comments[ticket.comments.length - 1];
                                const createdAtDate = new Date(ticket.createdAt);

                                return (
                                    <div
                                        key={ticket.id}
                                        className={`cursor-pointer border-b py-2 pl-12 pr-3 transition-colors hover:bg-light-1 active:bg-light-1 dark:active:bg-dark-2 ${
                                            selectedTicketId === ticket.id
                                                ? 'bg-light-1 dark:bg-dark-2'
                                                : 'border-light-3 dark:border-dark-3 dark:hover:bg-dark-1'
                                        } ${index === 0 ? 'border-t' : ''}`}
                                        onClick={() => handleTicketSelection(ticket.id)}
                                    >
                                        <div className="mb-1.5 flex items-center justify-between">
                                            <p className="neutral text-xs">{ticket.userEmailAddress}</p>
                                            <p className="neutral text-xs">{formatDate(createdAtDate)}</p>
                                        </div>
                                        <h4 className="text-sm font-medium">{ticket.title}</h4>
                                        {lastTicketComment?.content && (
                                            <p className="neutral mt-1.5 overflow-hidden overflow-ellipsis whitespace-nowrap text-xs">
                                                {extractLatestEmailContent(lastTicketComment?.content)}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </ScrollArea>
                    </div>

                    {/* Pagination */}
                    {ticketsQuery.data && (
                        <Pagination
                            className="mr-4 mt-4"
                            page={page}
                            itemsPerPage={itemsPerPage}
                            itemsTotal={ticketsQuery.data?.supportTicketsAdmin.pagination?.itemsTotal ?? 0}
                            pagesTotal={ticketsQuery.data?.supportTicketsAdmin.pagination?.pagesTotal ?? 0}
                            useLinks={true}
                            itemsPerPageControl={false}
                            pageInputControl={false}
                        />
                    )}
                </div>

                {/* Ticket Detail */}
                <div className="mt-3 flex h-full flex-col overflow-hidden pb-12 pr-6" ref={ticketDetailsRef}>
                    {selectedTicket ? (
                        <div className="flex h-full flex-col">
                            <h2 className="mb-4 text-2xl font-medium">{selectedTicket.title}</h2>

                            {/* Ticket Information */}
                            <div className="mb-6 rounded-lg border border-light-3 p-2 text-sm dark:border-dark-3">
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
                            <ScrollArea className="flex flex-grow" ref={commentsContainerRef}>
                                <div className="flex flex-grow flex-col justify-end">
                                    <div className="flex flex-col space-y-2">
                                        {selectedTicket.comments.map((comment) => (
                                            <div key={comment.id}>
                                                <div
                                                    className={`flex ${
                                                        comment.source === 'Agent' ? 'justify-end' : 'justify-start'
                                                    }`}
                                                >
                                                    <div
                                                        className={`min-w-96 max-w-[80%] rounded-lg p-2 text-sm
                                                ${
                                                    comment.source === 'Agent'
                                                        ? 'bg-blue text-light dark:bg-blue'
                                                        : 'bg-light-1 dark:bg-dark-2'
                                                }`}
                                                    >
                                                        <p className="whitespace-pre-wrap">
                                                            {extractLatestEmailContent(comment.content)}
                                                        </p>
                                                        <div className="dark:neutral mt-1 text-right text-xs">
                                                            {formatDate(new Date(comment.createdAt))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <CommentAttachments
                                                    attachments={comment.attachments}
                                                    isAgent={comment.source === 'Agent'}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </ScrollArea>

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
                                resetOnSubmitSuccess={true}
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
                                    return {
                                        success: true,
                                    };
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

            {/* Add FileCarouselDialog */}
            <FileCarouselDialog
                // open={dialogOpen}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                files={allAttachments}
                startIndex={selectedImageIndex}
            />
        </>
    );
}

// Export - Default
export default SupportPage;
