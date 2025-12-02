'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Dialog } from '@structure/source/components/dialogs/Dialog';
import { InputFile } from '@structure/source/components/forms-new/fields/file/InputFile';
import { Button } from '@structure/source/components/buttons/Button';

// Component - InputMarkupAttachmentsDialog
export interface InputMarkupAttachmentsDialogProperties {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (files: File[]) => void;
}
export function InputMarkupAttachmentsDialog(properties: InputMarkupAttachmentsDialogProperties) {
    // Generate unique ID for InputFile
    const inputFileId = React.useId();

    // State
    const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);

    // Function to handle save action
    function handleSave() {
        properties.onSave(uploadedFiles);
        properties.onOpenChange(false);
        setUploadedFiles([]);
    }

    // Function to handle cancel/close
    function handleClose() {
        properties.onOpenChange(false);
        setUploadedFiles([]);
    }

    // Render the component
    return (
        <Dialog
            variant="A"
            open={properties.open}
            onOpenChange={properties.onOpenChange}
            accessibilityTitle="Upload Attachments"
            accessibilityDescription="Upload files to attach to your content"
        >
            <Dialog.Header>Upload Attachments</Dialog.Header>
            <Dialog.Body>
                <InputFile
                    id={inputFileId}
                    files={uploadedFiles}
                    onFilesChange={setUploadedFiles}
                    accept={['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/json']}
                    multiple={true}
                />
            </Dialog.Body>
            <Dialog.Footer>
                <div className="flex justify-end gap-2">
                    <Button variant="Ghost" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="A" onClick={handleSave} disabled={uploadedFiles.length === 0}>
                        Save
                    </Button>
                </div>
            </Dialog.Footer>
        </Dialog>
    );
}
