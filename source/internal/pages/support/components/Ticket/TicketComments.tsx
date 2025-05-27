// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - React and Next.js
import React from 'react';
import Image from 'next/image';

// Dependencies - Main Components
import { ScrollArea } from '@structure/source/common/interactions/ScrollArea';
import { FileCarouselInterface } from '@structure/source/common/files/FileCarousel';
import { FileCarouselDialog } from '@structure/source/common/files/FileCarouselDialog';
import { CommentAttachments } from './TicketCommentAttachments';

// Dependencies - API
import {
    SupportTicketsPrivilegedQuery,
    SupportTicketCommentSource,
} from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Utilities
import { extractLatestEmailContent } from '@structure/source/utilities/Email';
import {
    formatDateWithTimeIfToday,
    formatDateToTodayYesterdayOrDate,
    formatDateToTimeWithTodayOrYesterday,
    formatDateOnlyTime,
} from '@structure/source/utilities/Time';

// Component - TicketComments
interface TicketCommentsInterface {
    userEmailAddress: string;
    comments: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0]['comments'];
    viewer: SupportTicketCommentSource;
    userFullName?: string;
}
export function TicketComments(properties: TicketCommentsInterface) {
    // Properties
    const { comments } = properties;

    const isAgentViewer = properties.viewer === SupportTicketCommentSource.Agent;
    const isUserViewer = properties.viewer === SupportTicketCommentSource.User;

    // Dialog state for image carousel
    const [showInternalComments, setShowInternalComments] = React.useState(false);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

    const commentsContainerReference = React.useRef<HTMLDivElement>(null);

    // Scroll to bottom when comments change
    React.useEffect(
        function () {
            if(commentsContainerReference.current) {
                commentsContainerReference.current.scrollTop = commentsContainerReference.current.scrollHeight;
            }
        },
        [comments],
    );

    const allAttachments = React.useMemo(() => {
        return comments.reduce((acc: FileCarouselInterface['files'], comment) => {
            const attachments = (comment.attachments || []).map((attachment) => ({
                url: attachment.url || '',
                metadata: {
                    Source: comment.source,
                    Date: formatDateWithTimeIfToday(new Date(comment.createdAt)),
                },
            }));
            return acc.concat(attachments);
        }, []);
    }, [comments]);

    // Function to get global index for an attachment URL
    function getGlobalAttachmentIndex(url: string): number {
        return allAttachments.findIndex((attachment) => attachment.url === url);
    }

    // Handle image click
    function handleImageClick(index: number) {
        setSelectedImageIndex(index);
        setDialogOpen(true);
    }

    let lastRenderedDate: string | null = null;

    // Render the component
    return (
        <div className={`flex flex-col flex-1 overflow-hidden${isAgentViewer ? ' p-10' : ''}`}>
            <ScrollArea className="flex flex-grow" ref={commentsContainerReference}>
                <div className="flex flex-grow flex-col justify-end">
                    <div className="flex flex-col space-y-4">
                        {comments
                            .filter(comment => showInternalComments || comment.visibility !== 'Internal')
                            .map((comment, index) => {
                                const messageDate = formatDateToTodayYesterdayOrDate(new Date(comment.createdAt));
                                const shouldRenderDate = lastRenderedDate !== messageDate;
                                lastRenderedDate = messageDate;

                                const commentContent = extractLatestEmailContent(comment.content);

                                const isViewerComment =
                                    (isAgentViewer && comment.source === SupportTicketCommentSource.Agent) ||
                                    (isUserViewer && comment.source === SupportTicketCommentSource.User);

                                const isOtherComment = !isViewerComment;

                                const alignmentClasses = isViewerComment
                                    ? 'justify-end items-end'
                                    : 'justify-start items-start';

                                const textAlignmentClasses = isViewerComment
                                    ? 'mr-4 text-right justify-end'
                                    : 'ml-4 text-left';

                                const backgroundColorClasses = isViewerComment
                                    ? 'bg-blue text-light dark:bg-blue rounded-br-none'
                                    : 'bg-light-1 dark:bg-dark-2 rounded-bl-none';

                                return (
                                    <div key={comment.id} className={index === comments.length - 1 ? 'pb-2' : ''}>
                                        {shouldRenderDate && (
                                            <div className={`flex justify-center text-xs font-medium ${index !== 0 && 'mt-6'}`}>
                                                {messageDate}
                                            </div>
                                        )}
                                        {index === 0 && (
                                            <div className="flex justify-center text-xs mt-2 mb-4">
                                                Conversation started at {formatDateOnlyTime(new Date(comment.createdAt))}
                                            </div>
                                        )}
                                        <div className={`flex ${alignmentClasses}`}>
                                            <div className={`flex flex-col${isViewerComment ? ' items-end' : ''}`}>
                                                <div className={`flex gap-2 dark:neutral my-2 text-xs ${textAlignmentClasses}`}>
                                                    {!(isUserViewer && comment.source === 'User') && (
                                                        <div className="flex gap-2 text-xs font-medium">
                                                            {comment.source === 'User' ? (
                                                                <>{properties.userFullName ?? properties.userEmailAddress}</>
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
                                                    {formatDateToTimeWithTodayOrYesterday(new Date(comment.createdAt))}
                                                </div>
                                                {!!commentContent && (
                                                    <div className={`min-w-96 max-w-[80%] rounded-lg p-4 text-xs ${backgroundColorClasses}`}>
                                                        <p className="whitespace-pre-wrap">{commentContent}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <CommentAttachments
                                            attachments={comment.attachments}
                                            viewer={properties.viewer}
                                            commenter={comment.source}
                                            onImageClick={handleImageClick}
                                            globalAttachmentIndex={getGlobalAttachmentIndex}
                                        />
                                    </div>
                                );
                            })
                        }
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