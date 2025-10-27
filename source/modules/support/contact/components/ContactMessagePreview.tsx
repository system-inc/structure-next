// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Utilities
import { iconForFileType, bytesToScaledUnits } from '@structure/source/utilities/file/File';

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
            <p className="mt-4 text-center text-balance content--1">
                Your message has been received. We will get back to you as soon as possible.
            </p>

            <div className="mt-10 flex w-full flex-col gap-2">
                <label className="text-sm font-medium">Your Message</label>

                <div className="mb-4 flex flex-col items-stretch rounded-md border border--0 px-6 py-8 transition-colors">
                    <div className="border-b border--0 pb-6 text-sm font-medium content--1 transition-colors">
                        <p>From: {properties.emailAddress}</p>
                        <p className="mt-2">Subject: {properties.title}</p>
                    </div>
                    <p className="pt-6 whitespace-pre-wrap">{properties.content}</p>
                </div>

                {properties.attachmentFiles.map(function (file, index) {
                    const FileTypeIcon = iconForFileType(file.type);
                    return (
                        <div
                            key={index}
                            className={
                                'mb-2 flex h-14 items-center justify-between rounded-md background--1 px-5 py-3 last:mb-0'
                            }
                        >
                            <FileTypeIcon className="mr-4 size-5" />

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium content--0">{file.name}</p>
                            </div>

                            <div className="flex items-center gap-4 pl-2">
                                <p className="text-sm content--1">{bytesToScaledUnits(file.size)}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
