'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Hooks
import { useFieldContext, useStore } from '../../useForm';
import { useFormSchema } from '../../providers/FormSchemaProvider';
import { useFieldId } from '../../providers/FormIdProvider';

// Dependencies - Main Components
import { InputFile, type DropZoneRenderProperties, type FileListItemRenderProperties } from './InputFile';

// Dependencies - Utilities
import { ArraySchema } from '@structure/source/utilities/schema/schemas/ArraySchema';
import { FileSchema } from '@structure/source/utilities/schema/schemas/FileSchema';

// Component - FieldInputFile
export interface FieldInputFileProperties {
    className?: string;
    multiple?: boolean;
    description?: string;
    renderDropZone?: (properties: DropZoneRenderProperties) => React.ReactNode;
    renderFileListItem?: (properties: FileListItemRenderProperties) => React.ReactNode;
}
export function FieldInputFile(properties: FieldInputFileProperties) {
    // Get field state and handlers from form context
    const fieldContext = useFieldContext<File[]>();
    const fieldId = useFieldId(fieldContext.name);

    // Get schema from context
    const formSchemaContext = useFormSchema();
    const schema = formSchemaContext.schema;

    // Extract file field metadata directly from schema
    const fileFieldMetadata = React.useMemo(
        function () {
            if(!schema || !fieldContext.name) return undefined;

            const fieldSchema = schema.shape[fieldContext.name as string];
            if(!fieldSchema) return undefined;

            // Check if this is an array of files
            if(fieldSchema instanceof ArraySchema) {
                if(fieldSchema.itemSchema instanceof FileSchema) {
                    return {
                        mimeTypes: fieldSchema.itemSchema.allowedMimeTypes,
                        maximumSizeInBytes: fieldSchema.itemSchema.allowedMaximumSizeInBytes,
                        minimumSizeInBytes: fieldSchema.itemSchema.allowedMinimumSizeInBytes,
                    };
                }
            }

            return undefined;
        },
        [schema, fieldContext.name],
    );

    // Subscribe to value reactively
    const storeValue = useStore(fieldContext.store, function (state) {
        return state.value;
    });

    // Pass everything to InputFile
    return (
        <InputFile
            id={fieldId}
            files={storeValue}
            onFilesChange={function (newFiles) {
                fieldContext.handleChange(newFiles);
            }}
            accept={fileFieldMetadata?.mimeTypes}
            multiple={properties.multiple}
            className={properties.className}
            description={properties.description}
            renderDropZone={properties.renderDropZone}
            renderFileListItem={properties.renderFileListItem}
        />
    );
}
