// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { FormField } from '@project/app/_components/form/FormField';
import { getFileTypeIconFromType } from '@project/app/_components/form/FileDropField';
import { formatFileSize } from '@project/app/_components/form/FileDrop';

// Dependencies - Assets
import { CheckIcon } from '@phosphor-icons/react';

// Component - ContactMessagePreview
export interface ContactMessagePreviewProperties {
    title: string;
    content: string;
    emailAddress: string;
    attachmentFiles: File[];
}
export function ContactMessagePreview(properties: ContactMessagePreviewProperties) {
    // Render the component
    return (
        <div className="mx-auto mt-12">
            <div className="mx-auto flex size-8 items-center justify-center rounded-full bg-[#16A34A]">
                <CheckIcon className="size-5" />
            </div>

            <h2 className="mt-6 text-center text-2xl font-medium">Message delivered.</h2>
            <p className="mt-4 text-center text-balance content--b">
                Your message has been received. We will get back to you as soon as possible.
            </p>

            <FormField label="Your Message" className="mt-10">
                <div className="mb-4 flex flex-col items-stretch rounded-md border border--a px-6 py-8 transition-colors">
                    <div className="border-b border--a pb-6 text-sm font-medium content--b transition-colors">
                        <p>From: {properties.emailAddress}</p>
                        <p className="mt-2">Subject: {properties.title}</p>
                    </div>
                    <p className="pt-6 whitespace-pre-wrap">{properties.content}</p>
                </div>

                {properties.attachmentFiles.map((file, index) => {
                    const FileTypeIcon = getFileTypeIconFromType(file.type);
                    return (
                        <div
                            key={index}
                            className={
                                'mb-2 flex h-14 items-center justify-between rounded-md background--b px-5 py-3 last:mb-0'
                            }
                        >
                            <FileTypeIcon className="mr-4 size-5" />

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium content--a">{file.name}</p>
                            </div>

                            <div className="flex items-center gap-4 pl-2">
                                <p className="text-sm content--b">{formatFileSize(file.size)}</p>
                            </div>
                        </div>
                    );
                })}
            </FormField>
        </div>
    );
}
