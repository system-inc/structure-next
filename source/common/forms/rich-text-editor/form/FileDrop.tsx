'use client';

import React from 'react';
import { FileContext } from './FileContext';

export { FileInput } from './FileInput';
export type { FileInputProperties } from './FileInput';
export { FileList } from './FileList';
export type { FileListProperties } from './FileList';
export { formatFileSize } from './FileContext';

// Component - FileDrop
type FileDropProperties = {
    children: React.ReactNode;
    files: File[];
    onFilesChange?: (files: File[]) => void;
    maxFiles?: number;
    accept?: string[];
    isDragging?: boolean;
    onDragChange?: (isDragging: boolean) => void;
};
export function FileDrop(properties: FileDropProperties) {
    const maxFiles = properties.maxFiles ?? Infinity;

    const [internalFiles, internalSetFiles] = React.useState<File[]>(properties.files);
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
        <FileContext.Provider
            value={{ files, addFiles, removeFile, isDragging, onDragChange, accept: properties.accept }}
        >
            {properties.children}
        </FileContext.Provider>
    );
}