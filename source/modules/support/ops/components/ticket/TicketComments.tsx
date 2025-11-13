// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - React and Next.js
import React from 'react';
import Image from 'next/image';

// Dependencies - Main Components
import { ScrollArea } from '@structure/source/components/interactions/ScrollArea';
import { FileCarouselProperties } from '@structure/source/components/files/FileCarousel';
import { FileCarouselDialog } from '@structure/source/components/files/FileCarouselDialog';
import { CommentAttachments } from '@structure/source/modules/support/ops/components/ticket/TicketCommentAttachments';

// Dependencies - API
import type { SupportTicketsPrivilegedQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { extractLatestEmailContent } from '@structure/source/utilities/email/Email';
import {
    dateToTimeIfTodayOrDate,
    dateToTodayYesterdayOrDate,
    dateToTimeWithTodayOrYesterday,
    timeOnly,
} from '@structure/source/utilities/time/Time';
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - TicketComments
interface TicketCommentsProperties {
    userEmailAddress: string;
    comments: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0]['comments'];
    ticketAttachments?: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0]['attachments'];
    viewer: 'User' | 'Agent';
    userFullName?: string;
}
export function TicketComments(properties: TicketCommentsProperties) {
    const isAgentViewer = properties.viewer === 'Agent';
    const isUserViewer = properties.viewer === 'User';

    // Dialog state for image carousel
    const [showInternalComments] = React.useState(false);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

    // References
    const commentsContainerReference = React.useRef<HTMLDivElement>(null);

    // Scroll to bottom when comments change
    React.useEffect(
        function () {
            if(commentsContainerReference.current) {
                commentsContainerReference.current.scrollTop = commentsContainerReference.current.scrollHeight;
            }
        },
        [properties.comments],
    );

    const allAttachments = React.useMemo(
        function () {
            const ticketAttachments: FileCarouselProperties['files'] = (properties.ticketAttachments || []).map(
                (attachment) => ({
                    url: attachment.url || '',
                    metadata: {
                        Source: 'Ticket',
                        Date: 'Ticket Attachment',
                    },
                }),
            );

            const commentAttachments: FileCarouselProperties['files'] = properties.comments.reduce(function (
                acc: FileCarouselProperties['files'],
                comment,
            ) {
                const attachments: FileCarouselProperties['files'] = (comment.attachments || []).map((attachment) => ({
                    url: attachment.url || '',
                    metadata: {
                        Source: comment.source,
                        Date: dateToTimeIfTodayOrDate(new Date(comment.createdAt)),
                    },
                }));
                return acc.concat(attachments);
            }, []);

            return ticketAttachments.concat(commentAttachments);
        },
        [properties.comments, properties.ticketAttachments],
    );

    // Function to get global index for an attachment URL
    function getGlobalAttachmentIndex(url: string): number {
        return allAttachments.findIndex((attachment) => attachment.url === url);
    }

    // Handle image click
    function handleImageClick(index: number) {
        setSelectedImageIndex(index);
        setDialogOpen(true);
    }

    // Process comments and add date information
    const filteredComments = properties.comments.filter(function (comment) {
        // Filter out internal comments if not showing them
        if(!showInternalComments && comment.visibility === 'Internal') return false;

        // Filter out comments with no content (null or empty after extraction)
        const content = extractLatestEmailContent(comment.content);
        if(!content && (!comment.attachments || comment.attachments.length === 0)) return false;

        return true;
    });

    // Track dates using reduce to avoid variable reassignment
    const commentsWithDateInformation = filteredComments.reduce(function (
        accumulator: Array<{
            comment: (typeof filteredComments)[0];
            messageDate: string;
            shouldRenderDate: boolean;
        }>,
        comment,
    ) {
        const messageDate = dateToTodayYesterdayOrDate(new Date(comment.createdAt));
        const previousDate = accumulator.length > 0 ? accumulator[accumulator.length - 1]?.messageDate : null;
        const shouldRenderDate = previousDate !== messageDate;

        accumulator.push({
            comment,
            messageDate,
            shouldRenderDate,
        });

        return accumulator;
    }, []);

    // Render the component
    return (
        <div className={`flex flex-1 flex-col overflow-hidden ${isAgentViewer && 'pb-4'}`}>
            <ScrollArea className="flex grow px-4" ref={commentsContainerReference}>
                <div className="flex grow flex-col items-center justify-end">
                    <div className="flex w-full max-w-[980px] flex-col space-y-4">
                        {commentsWithDateInformation.map(function (item, index) {
                            const comment = item.comment;
                            const messageDate = item.messageDate;
                            const shouldRenderDate = item.shouldRenderDate;

                            const commentContent = extractLatestEmailContent(comment.content);

                            // Determine classes based on viewer and comment source
                            const isAgentComment = comment.source === 'Agent';
                            const isUserComment = comment.source === 'User';

                            const alignmentClasses = isAgentViewer
                                ? isAgentComment
                                    ? 'justify-end items-end'
                                    : 'justify-start items-start'
                                : isUserComment
                                  ? 'justify-end items-end'
                                  : 'justify-start items-start';

                            const textAlignmentClasses = isAgentViewer
                                ? isUserComment
                                    ? 'ml-4 text-left'
                                    : 'mr-4 text-right justify-end'
                                : isAgentComment
                                  ? 'ml-4 text-left'
                                  : 'mr-4 text-right';

                            const backgroundColorClasses = isAgentViewer
                                ? isAgentComment
                                    ? 'bg-blue-500 content--0'
                                    : 'background--2'
                                : isUserComment
                                  ? 'bg-blue-500 content--0'
                                  : 'background--2';

                            return (
                                <div key={comment.id} className="last:pb-4">
                                    {shouldRenderDate && (
                                        <div
                                            className={mergeClassNames(
                                                'flex justify-center text-xs font-medium',
                                                index === 0 ? 'mt-4' : 'mt-6',
                                            )}
                                        >
                                            {messageDate} {timeOnly(new Date(comment.createdAt))}
                                        </div>
                                    )}
                                    <div className={mergeClassNames('flex w-full', alignmentClasses)}>
                                        <div className="flex w-full flex-col items-stretch">
                                            <div
                                                className={mergeClassNames(
                                                    'my-2 flex gap-2 text-xs content--2',
                                                    textAlignmentClasses,
                                                )}
                                            >
                                                {!(isUserViewer && isUserComment) && (
                                                    <div className="flex gap-2 text-xs font-medium">
                                                        {isUserComment ? (
                                                            <>
                                                                {properties.userFullName ?? properties.userEmailAddress}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Image
                                                                    src={ProjectSettings.assets.favicon.light.location}
                                                                    alt="Logo"
                                                                    height={16} // h-7 = 28px
                                                                    width={16} // h-7 = 28px
                                                                    priority={true}
                                                                    className="dark:hidden"
                                                                />
                                                                <Image
                                                                    src={ProjectSettings.assets.favicon.dark.location}
                                                                    alt="Logo"
                                                                    height={16}
                                                                    width={16}
                                                                    priority={true}
                                                                    className="hidden dark:block"
                                                                />
                                                                Phi
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                                {dateToTimeWithTodayOrYesterday(new Date(comment.createdAt))}
                                            </div>
                                            {!!commentContent && (
                                                <div
                                                    className={mergeClassNames(
                                                        'max-w-[70%] rounded-2xl p-4 text-sm',
                                                        isUserComment ? 'mr-auto' : 'ml-auto',
                                                        backgroundColorClasses,
                                                    )}
                                                >
                                                    <p className="whitespace-pre-wrap">{commentContent}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <CommentAttachments
                                        attachments={comment.attachments}
                                        isAgent={isAgentComment}
                                        onImageClick={handleImageClick}
                                        globalAttachmentIndex={getGlobalAttachmentIndex}
                                    />
                                    {/* Show ticket attachments after the first comment */}
                                    {index === 0 &&
                                        properties.ticketAttachments &&
                                        properties.ticketAttachments.length > 0 && (
                                            <CommentAttachments
                                                attachments={properties.ticketAttachments}
                                                isAgent={false}
                                                onImageClick={handleImageClick}
                                                globalAttachmentIndex={getGlobalAttachmentIndex}
                                            />
                                        )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </ScrollArea>

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
