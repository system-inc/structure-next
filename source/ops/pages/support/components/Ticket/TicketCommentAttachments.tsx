'use client';

// Dependencies - React and Next.js
import React from 'react';
import Image from 'next/image';

// Dependencies - Main Components
import { isImageFile } from '@structure/source/utilities/File';

// Dependencies - API
import { SupportTicketsPrivilegedQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Assets
import { FilePdf } from '@phosphor-icons/react';

// Component - CommentAttachments
export interface CommentAttachmentsProperties {
    attachments: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0]['comments'][0]['attachments'];
    isAgent: boolean;
    onImageClick?: (index: number) => void;
    globalAttachmentIndex?: (url: string) => number;
}
export function CommentAttachments(properties: CommentAttachmentsProperties) {
    if(!properties.attachments?.length) return null;

    // Render the component
    return (
        <div className={`flex ${properties.isAgent ? 'justify-end' : 'justify-start'}`}>
            <div className={`mt-1 flex max-w-[80%] flex-wrap gap-2`}>
                {properties.attachments.map((attachment, index) => (
                    <div
                        key={index}
                        className={`rounded-lg ${
                            properties.isAgent ? 'bg-blue text-light' : 'bg-light-1 dark:bg-dark-2'
                        }`}
                    >
                        {isImageFile(attachment.url) ? (
                            <div
                                onClick={() => {
                                    if(properties.onImageClick && properties.globalAttachmentIndex) {
                                        properties.onImageClick(properties.globalAttachmentIndex(attachment.url));
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
                                className="border-opsis-border-primary flex h-[124px] w-[154px] cursor-pointer flex-col items-start justify-end rounded-lg border bg-white p-4 text-center"
                                onClick={() => window.open(attachment.url, '_blank')}
                            >
                                <FilePdf className="size-5 text-[--global-red-600]" />
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
