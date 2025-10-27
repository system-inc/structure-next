'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Context
import { InputFileContext } from './InputFileContext';
import { useFileFieldMetadata } from '../../providers/FileFieldMetadataProvider';

// Component - InputFileDrop
export type InputFileDropProperties = {
    children: React.ReactNode;
    files?: File[];
    onFilesChange?: (files: File[]) => void;
    maxFiles?: number;
    accept?: string[];
    isDragging?: boolean;
    onDragChange?: (isDragging: boolean) => void;
};
export function InputFileDrop(properties: InputFileDropProperties) {
    const maxFiles = properties.maxFiles ?? Infinity;

    // Get file field metadata from context (if provided by form schema)
    const fileFieldMetadata = useFileFieldMetadata();

    // Use explicit accept prop if provided, otherwise use schema metadata
    const accept = properties.accept ?? fileFieldMetadata?.mimeTypes;

    const [internalFiles, internalSetFiles] = React.useState<File[]>(properties.files || []);
    const [files, onFilesChange] = [
        properties.files ?? internalFiles,
        properties.onFilesChange ?? internalSetFiles,
    ] as const;

    const [dragging, setDragging] = React.useState(properties.isDragging ?? false);
    const [isDragging, onDragChange] = [
        properties.isDragging ?? dragging,
        properties.onDragChange ?? setDragging,
    ] as const;

    const addFiles = React.useCallback(
        function (newFiles: File[]) {
            let filteredFiles = newFiles;

            // Filter by accepted file types if specified
            if(accept && accept.length > 0) {
                filteredFiles = newFiles.filter(
                    (file) =>
                        accept?.some(
                            (type) =>
                                file.type === type ||
                                (type.endsWith('/*') && file.type.startsWith(type.replace('/*', '/'))),
                        ),
                );
            }

            const currentFiles = files;
            const updatedFiles = [...currentFiles];

            // Only add files up to maxFiles limit
            const remainingSlots = maxFiles - updatedFiles.length;
            const filesToAdd = filteredFiles.slice(0, remainingSlots);

            const result = [...updatedFiles, ...filesToAdd];
            onFilesChange(result);
        },
        [maxFiles, accept, files, onFilesChange],
    );

    const removeFile = React.useCallback(
        function (index: number) {
            const currentFiles = [...files];
            currentFiles.splice(index, 1);
            onFilesChange(currentFiles);
        },
        [files, onFilesChange],
    );

    return (
        <InputFileContext.Provider value={{ files, addFiles, removeFile, isDragging, onDragChange, accept }}>
            {properties.children}
        </InputFileContext.Provider>
    );
}
