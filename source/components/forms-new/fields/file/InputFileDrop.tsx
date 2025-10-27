'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Context
import { InputFileContext } from './InputFileContext';

// Component - InputFileDrop
export type InputFileDropProperties = {
    files?: File[];
    onFilesChange?: (files: File[]) => void;
    maxFiles?: number;
    accept?: string[];
    isDragging?: boolean;
    onDragChange?: (isDragging: boolean) => void;
    children: React.ReactNode;
};
export function InputFileDrop(properties: InputFileDropProperties) {
    // Defaults
    const maxFiles = properties.maxFiles ?? Infinity;
    const accept = properties.accept;

    // State
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

    // Function to add files
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

            // Filter out duplicates (same name and size)
            filteredFiles = filteredFiles.filter(
                (newFile) =>
                    !currentFiles.some(
                        (existingFile) => existingFile.name === newFile.name && existingFile.size === newFile.size,
                    ),
            );

            const updatedFiles = [...currentFiles];

            // Only add files up to maxFiles limit
            const remainingSlots = maxFiles - updatedFiles.length;
            const filesToAdd = filteredFiles.slice(0, remainingSlots);

            const result = [...updatedFiles, ...filesToAdd];
            onFilesChange(result);
        },
        [maxFiles, accept, files, onFilesChange],
    );

    // Function to remove a file by index
    const removeFile = React.useCallback(
        function (index: number) {
            const currentFiles = [...files];
            currentFiles.splice(index, 1);
            onFilesChange(currentFiles);
        },
        [files, onFilesChange],
    );

    // Render the component
    return (
        <InputFileContext.Provider value={{ files, addFiles, removeFile, isDragging, onDragChange, accept }}>
            {properties.children}
        </InputFileContext.Provider>
    );
}
