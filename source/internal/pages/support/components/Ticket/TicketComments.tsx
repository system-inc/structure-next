// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - React and Next.js
import React from 'react';
import Image from 'next/image';

// Dependencies - Main Components
import { ScrollArea } from '@structure/source/common/interactions/ScrollArea';
import { FileCarouselInterface } from '@structure/source/common/files/FileCarousel';
import { FileCarouselDialog } from '@structure/source/common/files/FileCarouselDialog';
import { CommentAttachments } from '../CommentAttachments';

// Dependencies - API
import { SupportTicketsPrivilegedQuery } from '@project/source/api/GraphQlGeneratedCode';

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
    comments: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0]['comments'];
}
export function TicketComments(properties: TicketCommentsInterface) {
    // Properties
    const { comments } = properties;

    // Dialog state for image carousel
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

    const allAttachments =
            comments.reduce((accumulatedAttachments: FileCarouselInterface['files'], comment) => {
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

    let lastRenderedDate: string | null = null;

    // Render the component
    return (
        <div className="flex flex-col flex-1 p-10 overflow-hidden">
            <ScrollArea className="flex flex-grow" ref={commentsContainerReference}>
                <div className="flex flex-grow flex-col justify-end">
                    <div className="flex flex-col space-y-4">
                        {comments.map((comment, index) => {
                            const messageDate = formatDateToTodayYesterdayOrDate(new Date(comment.createdAt));
                            const shouldRenderDate = lastRenderedDate !== messageDate;
                            lastRenderedDate = messageDate;

                            const commentContent = extractLatestEmailContent(comment.content);

                            return (
                                <div key={comment.id}>
                                    {shouldRenderDate && (
                                        <div className={`flex justify-center text-xs font-medium ${index !== 0 && 'mt-6'}`}>
                                            {messageDate}
                                        </div>
                                    )}
                                    { index === 0 && (
                                        <div className="flex justify-center text-xs mt-2 mb-4">
                                            Conversation started at {formatDateOnlyTime(new Date(comment.createdAt))}
                                        </div>    
                                    )}
                                    <div className={`flex ${comment.source === 'Agent' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`flex flex-col ${comment.source === 'Agent' ? 'items-end' : 'items-start'}`}>
                                            <div
                                                className={`flex gap-2 dark:neutral my-2 text-xs
                                                    ${comment.source === 'User'
                                                        ? 'ml-4 text-left'
                                                        : 'mr-4 text-right'
                                                    }`}
                                            >
                                                <div className="flex gap-2 text-xs font-medium">
                                                    {comment.source === 'User' ? (
                                                        'Anakin Skywalker'
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
                                                {formatDateToTimeWithTodayOrYesterday(new Date(comment.createdAt))}
                                            </div>
                                            { !!commentContent && (
                                                <div
                                                    className={`min-w-96 max-w-[80%] rounded-lg p-4 text-xs
                                                    ${
                                                        comment.source === 'Agent'
                                                            ? 'bg-blue text-light dark:bg-blue rounded-br-none'
                                                            : 'bg-light-1 dark:bg-dark-2 rounded-bl-none'
                                                    }`}
                                                >
                                                    <p className="whitespace-pre-wrap">{commentContent}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <CommentAttachments
                                        attachments={comment.attachments}
                                        isAgent={comment.source === 'Agent'}
                                        onImageClick={handleImageClick}
                                        globalAttachmentIndex={getGlobalAttachmentIndex}
                                    />
                                </div>
                            )
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