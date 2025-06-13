'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { getFileTypeIconFromType } from './form/FileDropField';

// Dependencies - Assets
import { X } from '@phosphor-icons/react';

// Dependencies - Utilities
// import { formatFileSize } from '../../headless/FileDrop';

// Component - AttachmentBar
export interface AttachmentBarProperties {
    files: File[];
    onRemoveFile: (index: number) => void;
    isDiabled?: boolean;
}

export function AttachmentBar(properties: AttachmentBarProperties) {
    // Render the component
    return (
        <div className="flex flex-wrap items-center gap-4 border-b border-opsis-border-primary bg-opsis-background-secondary px-4 py-2">
            {properties.files.map((file, index) => {
                const FileTypeIcon = getFileTypeIconFromType(file.type);

                return (
                    <div key={index} className="flex items-center gap-2 rounded-small bg-white px-3 py-1 shadow-sm">
                        <FileTypeIcon className="size-4 text-opsis-content-primary" weight="regular" />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-normal text-opsis-content-primary">{file.name}</p>
                            {/* <p className="text-xs text-opsis-content-secondary">{formatFileSize(file.size)}</p> */}
                        </div>
                        <Button
                            variant="ghost"
                            // icon
                            // size="extra-small"
                            type="button"
                            onClick={() => properties.onRemoveFile(index)}
                            className="flex h-5 w-5 items-center justify-center p-1 hover:text-red-500 focus:text-red-500"
                            aria-label="Remove file"
                            disabled={properties.isDiabled}
                        >
                            <X />
                        </Button>
                    </div>
                );
            })}
        </div>
    );
}
