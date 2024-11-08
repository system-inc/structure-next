// Dependencies - React and Next.js
import React from 'react';
import Image from 'next/image';

// Dependencies - Main Components
import { isImageFile } from '@structure/source/utilities/File';

// Dependencies - API
import { SupportTicketsAdminQuery } from '@project/source/api/GraphQlGeneratedCode';

// Component - CommentAttachments
export interface CommentAttachmentsInterface {
    attachments: SupportTicketsAdminQuery['supportTicketsAdmin']['items'][0]['comments'][0]['attachments'];
    isAgent: boolean;
    onImageClick?: (index: number) => void;
    globalAttachmentIndex?: (url: string) => number;
}
export function CommentAttachments({
    attachments,
    isAgent,
    onImageClick,
    globalAttachmentIndex,
}: CommentAttachmentsInterface) {
    if(!attachments?.length) return null;

    // Render the component
    return (
        <div className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
            <div className={`mt-1 flex max-w-[80%] flex-wrap gap-2`}>
                {attachments.map((attachment, index) => (
                    <div
                        key={index}
                        className={`rounded-lg ${isAgent ? 'bg-blue text-light' : 'bg-light-1 dark:bg-dark-2'}`}
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
                ))}
            </div>
        </div>
    );
}

// Export - Default
export default CommentAttachments;
