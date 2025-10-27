'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Interface - FileFieldMetadata
// Metadata extracted from FileSchema to configure file input components
export interface FileFieldMetadata {
    mimeTypes?: string[];
    maximumSizeInBytes?: number;
    minimumSizeInBytes?: number;
}

// Context - FileFieldMetadataContext
const FileFieldMetadataContext = React.createContext<FileFieldMetadata | undefined>(undefined);

// Provider - FileFieldMetadataProvider
export interface FileFieldMetadataProviderProperties {
    metadata: FileFieldMetadata;
    children: React.ReactNode;
}
export function FileFieldMetadataProvider(properties: FileFieldMetadataProviderProperties) {
    return (
        <FileFieldMetadataContext.Provider value={properties.metadata}>
            {properties.children}
        </FileFieldMetadataContext.Provider>
    );
}

// Hook - useFileFieldMetadata
// Returns file field metadata from context (if available)
export function useFileFieldMetadata(): FileFieldMetadata | undefined {
    return React.useContext(FileFieldMetadataContext);
}
