'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Context
import { InputFileContext } from './InputFileContext';

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
            if(properties.accept && properties.accept.length > 0) {
                filteredFiles = newFiles.filter(
                    (file) =>
                        properties.accept?.some(
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
        [maxFiles, properties.accept, files, onFilesChange],
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
        <InputFileContext.Provider
            value={{ files, addFiles, removeFile, isDragging, onDragChange, accept: properties.accept }}
        >
            {properties.children}
        </InputFileContext.Provider>
    );
}
