'use client';

import React from 'react';

// Context for file handling
export type FileContextType = {
    files: File[];
    addFiles: (newFiles: File[]) => void;
    removeFile: (index: number) => void;
    onDragChange: (isDragging: boolean) => void;
    isDragging: boolean;
    accept?: string[];
};

export const FileContext = React.createContext<FileContextType | undefined>(undefined);

// Hook to use file context
export const useFileContext = () => {
    const context = React.useContext(FileContext);
    if(!context) {
        throw new Error('useFileContext must be used within a FileProvider');
    }
    return context;
};

// Function to format file size
export const formatFileSize = (bytes: number): string => {
    if(bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};