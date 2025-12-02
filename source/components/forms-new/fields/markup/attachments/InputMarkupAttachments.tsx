'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';

// Dependencies - Assets
import { XIcon } from '@phosphor-icons/react';

// Dependencies - Utilities
import { iconForFileType } from '@structure/source/utilities/file/File';

// Component - InputMarkupAttachments
export interface InputMarkupAttachmentsProperties {
    files: File[];
    isDisabled?: boolean;
    onRemoveFile: (index: number) => void;
}
export function InputMarkupAttachments(properties: InputMarkupAttachmentsProperties) {
    // Render the component
    return (
        <div className="flex flex-wrap items-center gap-4 border-b border--0 background--1 px-4 py-2">
            {properties.files.map(function (file, index) {
                const FileTypeIcon = iconForFileType(file.type);

                return (
                    <div key={index} className="flex items-center gap-2 rounded-sm bg-white px-3 py-1 shadow-sm">
                        <FileTypeIcon className="size-4 content--0" />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-normal content--0">{file.name}</p>
                        </div>
                        <Button
                            variant="Ghost"
                            size="Icon"
                            icon={XIcon}
                            onClick={function () {
                                properties.onRemoveFile(index);
                            }}
                            className="flex h-5 w-5 items-center justify-center p-1 hover:text-red-500 focus:text-red-500"
                            aria-label="Remove file"
                            disabled={properties.isDisabled}
                        />
                    </div>
                );
            })}
        </div>
    );
}
