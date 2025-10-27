'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useFieldContext, useStore } from '../../useForm';
import { useFileFieldMetadata } from '../../providers/FileFieldMetadataProvider';

// Dependencies - Main Components
import { InputFile, type DropZoneRenderProperties, type FileListItemRenderProperties } from './InputFile';

// Component - FormInputFile
export interface FormInputFileProperties {
    className?: string;
    multiple?: boolean;
    renderDropZone?: (properties: DropZoneRenderProperties) => React.ReactNode;
    renderFileListItem?: (properties: FileListItemRenderProperties) => React.ReactNode;
}
export function FormInputFile(properties: FormInputFileProperties) {
    // Get field state and handlers from form context
    const fieldContext = useFieldContext<File[]>();

    // Get file field metadata from schema (MIME types, size limits)
    const fileFieldMetadata = useFileFieldMetadata();

    // Subscribe to value reactively
    const storeValue = useStore(fieldContext.store, function (state) {
        return state.value;
    });

    // Pass everything to InputFile
    return (
        <InputFile
            files={storeValue}
            onFilesChange={function (newFiles) {
                fieldContext.handleChange(newFiles);
            }}
            accept={fileFieldMetadata?.mimeTypes}
            multiple={properties.multiple}
            className={properties.className}
            renderDropZone={properties.renderDropZone}
            renderFileListItem={properties.renderFileListItem}
        />
    );
}
