'use client'; // This hook uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Context - InputFileContext
export type InputFileContextType = {
    files: File[];
    addFiles: (newFiles: File[]) => void;
    removeFile: (index: number) => void;
    onDragChange: (isDragging: boolean) => void;
    isDragging: boolean;
    accept?: string[];
};

export const InputFileContext = React.createContext<InputFileContextType | undefined>(undefined);

// Hook to use file context
export const useInputFileContext = function () {
    const context = React.useContext(InputFileContext);
    if(!context) {
        throw new Error('useInputFileContext must be used within an InputFileDrop');
    }
    return context;
};
