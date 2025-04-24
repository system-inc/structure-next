// Dependencies - React and Next.js
import React from 'react';
import Image from 'next/image';

// Dependencies - Main Components
import { isImageFile } from '@structure/source/utilities/File';

// Dependencies - API
import { SupportTicketsPrivilegedQuery } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets
import { FilePdf } from '@phosphor-icons/react';

// Component - CommentAttachments
export interface CommentAttachmentsInterface {
    attachments: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0]['comments'][0]['attachments'];
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
                                    width={154}
                                    height={124}
                                    className="h-[124px] w-[154px] rounded-lg object-cover"
                                />
                            </div>
                        ) : (
                            <div
                                className="flex h-[124px] w-[154px] cursor-pointer flex-col items-start justify-end rounded-lg bg-white p-4 text-center border border-opsis-border-primary"
                                onClick={() => window.open(attachment.url, '_blank')}
                            >
                                {/* Opsis variable for this red? */}
                                <FilePdf width={20} height={20} color="#DC2626" />
                                <p className="mt-2 truncate text-xs text-black">{attachment.type}</p>
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
