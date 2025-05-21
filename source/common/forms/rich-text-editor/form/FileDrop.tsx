'use client';

import { mergeClassNames } from '@structure/source/utilities/Style';
import React from 'react';

// Context for file handling
type FileContextType = {
    files: File[];
    addFiles: (newFiles: File[]) => void;
    removeFile: (index: number) => void;
    onDragChange: (isDragging: boolean) => void;
    isDragging: boolean;
    accept?: string[];
};

const FileContext = React.createContext<FileContextType | undefined>(undefined);

// Hook to use file context
const useFileContext = () => {
    const context = React.useContext(FileContext);
    if(!context) {
        throw new Error('useFileContext must be used within a FileProvider');
    }
    return context;
};

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
const FileDrop: React.FC<FileDropProperties> = function (properties) {
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
};

// Component - FileInput
type FileInputProperties = {
    multiple?: boolean;
    children?: React.ReactNode;
    className?: string;
};
const FileInput: React.FC<FileInputProperties> = (properties) => {
    const multiple = properties.multiple ?? false;
    const { addFiles, onDragChange, accept } = useFileContext();
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if(fileList) {
            addFiles(Array.from(fileList));
        }

        // Reset the input value so the same file can be selected again
        if(inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        onDragChange(true);
    };

    const handleDragLeave = () => {
        onDragChange(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        onDragChange(false);

        if(event.dataTransfer.files) {
            addFiles(Array.from(event.dataTransfer.files));
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <div
            className={mergeClassNames(`relative`, properties.className)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            <input
                type="file"
                ref={inputRef}
                className="sr-only"
                onChange={handleFileChange}
                accept={`${accept?.join(',')}`}
                multiple={multiple}
            />
            {properties.children}
        </div>
    );
};

// Function to format file size
export const formatFileSize = (bytes: number): string => {
    if(bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Component - FileList
type FileListProperties = {
    className?: string;
    component: React.ComponentType<{ file: File; removeFile: (index: number) => void; index: number }>;
};
const FileList: React.FC<FileListProperties> = (properties) => {
    const { files, removeFile } = useFileContext();
    const Component = properties.component;

    if(files.length === 0) {
        return null;
    }

    return (
        <ul className={mergeClassNames('', properties.className)}>
            {files.map((file, index) => (
                <li key={index}>
                    <Component file={file} removeFile={removeFile} index={index} />
                </li>
            ))}
        </ul>
    );
};

export { FileDrop, FileInput, FileList, useFileContext, type FileDropProperties };
