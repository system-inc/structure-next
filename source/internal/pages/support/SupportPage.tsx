'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlSearchParameters, useRouter } from '@structure/source/utilities/next/NextNavigation';

// Dependencies - Main Components
import { Form } from '@structure/source/common/forms/Form';
import { FormInputTextArea } from '@structure/source/common/forms/FormInputTextArea';
import { ScrollArea } from '@structure/source/common/interactions/ScrollArea';
import { FileCarouselInterface } from '@structure/source/common/files/FileCarousel';
import { FileCarouselDialog } from '@structure/source/common/files/FileCarouselDialog';

// Dependencies - Internal Components
import { TicketList } from './components/TicketList/TicketList';
import { TicketInformation } from './components/TicketInformation';
import { CommentAttachments } from './components/CommentAttachments';

// Dependencies - Hooks
import { useSupportTickets } from './hooks/useSupportTickets';

// Dependencies - Utilities
import { extractLatestEmailContent } from '@structure/source/utilities/Email';
import { formatDateWithTimeIfToday } from '@structure/source/utilities/Time';

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
    const [selectedStatus, setSelectedStatus] = React.useState<string>('Open');

    // Hooks
    const { ticketsQuery, createComment, isManuallyRefreshing, handleManualRefresh } = useSupportTickets(
        page,
        itemsPerPage,
        selectedStatus,
    );

    // Dialog state for image carousel
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

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

    // Get all attachments from comments
    const allAttachments =
        selectedTicket?.comments.reduce((accumulatedAttachments: FileCarouselInterface['files'], comment) => {
            const attachments = (comment.attachments || []).map(function (attachment) {
                return {
                    url: attachment.url || '',
                    metadata: {
                        Source: comment.source,
                        Date: formatDateWithTimeIfToday(new Date(comment.createdAt)),
                    },
                };
            });
            return accumulatedAttachments.concat(attachments);
        }, []) || [];

    // Function to get global index for an attachment URL
    function getGlobalAttachmentIndex(url: string): number {
        return allAttachments.findIndex((attachment) => attachment.url === url);
    }

    // Handle image click
    function handleImageClick(index: number) {
        setSelectedImageIndex(index);
        setDialogOpen(true);
    }

    // Render the component
    return (
        <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
            <div className="grid h-full grid-cols-[390px_1fr] gap-6">
                {/* Left Navigation */}
                <TicketList
                    tickets={ticketsQuery.data?.supportTicketsAdmin.items || []}
                    selectedTicketId={selectedTicketId}
                    isLoading={ticketsQuery.loading}
                    isRefreshing={isManuallyRefreshing}
                    page={page}
                    itemsPerPage={itemsPerPage}
                    totalItems={ticketsQuery.data?.supportTicketsAdmin.pagination?.itemsTotal ?? 0}
                    totalPages={ticketsQuery.data?.supportTicketsAdmin.pagination?.pagesTotal ?? 0}
                    onRefresh={handleManualRefresh}
                    onStatusChange={setSelectedStatus}
                    onTicketSelect={handleTicketSelection}
                />

                {/* Ticket Detail */}
                <div className="mt-3 flex h-full flex-col overflow-hidden pb-12 pr-6" ref={ticketDetailsRef}>
                    {selectedTicket ? (
                        <div className="flex h-full flex-col">
                            <h2 className="mb-4 text-2xl font-medium">{selectedTicket.title}</h2>

                            {/* Ticket Information */}
                            <TicketInformation
                                email={selectedTicket.userEmailAddress}
                                status={selectedTicket.status}
                                createdAt={selectedTicket.createdAt}
                                // assignedTo={selectedTicket.assignedTo}
                            />

                            {/* Comments */}
                            <ScrollArea className="flex flex-grow" ref={commentsContainerRef}>
                                <div className="flex flex-grow flex-col justify-end">
                                    <div className="flex flex-col space-y-2">
                                        {selectedTicket.comments.map(function (comment) {
                                            const latestEmailContent = extractLatestEmailContent(comment.content);

                                            return (
                                                <div key={comment.id}>
                                                    {latestEmailContent.length > 0 && (
                                                        <div
                                                            className={`flex ${
                                                                comment.source === 'Agent'
                                                                    ? 'justify-end'
                                                                    : 'justify-start'
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
                                                                    {latestEmailContent}
                                                                </p>
                                                                <div className="dark:neutral mt-1 text-right text-xs">
                                                                    {formatDateWithTimeIfToday(
                                                                        new Date(comment.createdAt),
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <CommentAttachments
                                                        attachments={comment.attachments}
                                                        isAgent={comment.source === 'Agent'}
                                                        onImageClick={handleImageClick}
                                                        globalAttachmentIndex={getGlobalAttachmentIndex}
                                                    />
                                                </div>
                                            );
                                        })}
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

            {/* Image Carousel Dialog */}
            <FileCarouselDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                files={allAttachments}
                startIndex={selectedImageIndex}
            />
        </div>
    );
}

// Export - Default
export default SupportPage;
