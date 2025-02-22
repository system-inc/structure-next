'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { ScrollArea } from '@structure/source/common/interactions/ScrollArea';
import { CommentAttachments } from './CommentAttachments';

// Dependencies - API
import { SupportTicketsPrivilegedQuery } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Utilities
import { extractLatestEmailContent } from '@structure/source/utilities/Email';
import { formatDateWithTimeIfToday } from '@structure/source/utilities/Time';

// Component - TicketComments
interface TicketCommentsInterface {
    comments: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0]['comments'];
    onImageClick: (index: number) => void;
    globalAttachmentIndex: (url: string) => number;
}
export function TicketComments({ comments, onImageClick, globalAttachmentIndex }: TicketCommentsInterface) {
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

    // Render the component
    return (
        <ScrollArea className="flex grow" ref={commentsContainerReference}>
            <div className="flex grow flex-col justify-end">
                <div className="flex flex-col space-y-2">
                    {comments.map((comment) => (
                        <div key={comment.id}>
                            <div className={`flex ${comment.source === 'Agent' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`min-w-96 max-w-[80%] rounded-lg p-2 text-sm
                                    ${
                                        comment.source === 'Agent'
                                            ? 'bg-blue text-light dark:bg-blue'
                                            : 'bg-light-1 dark:bg-dark-2'
                                    }`}
                                >
                                    <p className="whitespace-pre-wrap">{extractLatestEmailContent(comment.content)}</p>
                                    <div className="dark:neutral mt-1 text-right text-xs">
                                        {formatDateWithTimeIfToday(new Date(comment.createdAt))}
                                    </div>
                                </div>
                            </div>
                            <CommentAttachments
                                attachments={comment.attachments}
                                isAgent={comment.source === 'Agent'}
                                onImageClick={onImageClick}
                                globalAttachmentIndex={globalAttachmentIndex}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </ScrollArea>
    );
}
