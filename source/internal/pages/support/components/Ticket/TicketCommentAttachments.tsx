'use client';

// Dependencies - React and Next.js
import React from 'react';
import Image from 'next/image';

// Dependencies - Main Components
import { isImageFile } from '@structure/source/utilities/File';

// Dependencies - Assets
import { FilePdf, FileText } from '@phosphor-icons/react';

// Dependencies - API
import {
    SupportTicketsPrivilegedQuery,
    SupportTicketCommentSource,
} from '@project/source/api/GraphQlGeneratedCode';
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - CommentAttachments
export interface CommentAttachmentsInterface {
    attachments: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0]['comments'][0]['attachments'];
    viewer: SupportTicketCommentSource;
    commenter: SupportTicketCommentSource;
    onImageClick?: (index: number) => void;
    globalAttachmentIndex?: (url: string) => number;
}
export function CommentAttachments({
    attachments,
    viewer,
    commenter,
    onImageClick,
    globalAttachmentIndex,
}: CommentAttachmentsInterface) {
    if(!attachments?.length) return null;

    const isViewerAttachment =
        (viewer === SupportTicketCommentSource.Agent && commenter === SupportTicketCommentSource.Agent) ||
        (viewer === SupportTicketCommentSource.User && commenter === SupportTicketCommentSource.User);

    // Render the component
    return (
        <div className={`flex ${isViewerAttachment ? 'justify-end' : 'justify-start'}`}>
            <div className={`mt-1 flex max-w-[80%] flex-wrap gap-2`}>
                {attachments.map((attachment, index) => (
                    <div
                        key={index}
                        className={`rounded-lg ${isViewerAttachment ? 'bg-blue text-light' : 'bg-light-1 dark:bg-dark-2'}`}
                    >
                        {isImageFile(attachment.url) ? (
                            <div
                                onClick={() => {
                                    if(onImageClick && globalAttachmentIndex) {
                                        onImageClick(globalAttachmentIndex(attachment.url));
                                    }
                                }}
                                className="cursor-pointer"
                            >
                                <Image
                                    src={attachment.url}
                                    alt="Attachment"
                                    width={154}
                                    height={124}
                                    className="h-[124px] w-[154px] rounded-lg object-cover"
                                />
                            </div>
                        ) : (
                            <div
                                className={mergeClassNames([
                                    'flex h-[124px] w-[154px] cursor-pointer flex-col items-start justify-end rounded-lg',
                                    'bg-white dark:bg-dark-3 border border-opsis-border-primary shadow-01',
                                    'p-4 text-center',
                                ])}
                            >
                                {attachment.url.includes('.pdf') ? (
                                    <FilePdf className="size-5 text-[--global-red-600]" />
                                ) : attachment.url.includes('.json') ? (
                                    <FileText className="size-5 text-[--global-grey-600]" />
                                ) : null}
                                <span className="text-sm truncate max-w-[120px]">{attachment.type}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// Export - Default
export default CommentAttachments;