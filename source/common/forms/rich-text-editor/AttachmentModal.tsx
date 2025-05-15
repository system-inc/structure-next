'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Radix UI
import * as Dialog from '@radix-ui/react-dialog';

// Dependencies - Main Components
import { Button } from './Button';
import FileDropField from './form/FileDropField';

// Component - AttachmentModal
export interface AttachmentModalProperties {
    isOpen: boolean;
    onClose: () => void;
    onSave: (files: File[]) => void;
}

export function AttachmentModal(properties: AttachmentModalProperties) {
    // State
    const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);

    // Render the component
    return (
        <Dialog.Root open={properties.isOpen} onOpenChange={properties.onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                <Dialog.Content className="fixed left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">
                    <Dialog.Title className="text-lg font-medium">Upload Attachments</Dialog.Title>
                    <Dialog.Description className="mt-2 text-sm text-gray-500">
                        Drag and drop files here or click to upload.
                    </Dialog.Description>

                    {/* File Drop Field */}
                    <FileDropField
                        label="Attachments"
                        files={uploadedFiles}
                        onFilesChange={(newFiles) => setUploadedFiles(newFiles)}
                        accept={['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/json']}
                        multiple
                    />

                    <div className="mt-4 flex justify-end gap-2">
                        <Button variant="ghost" onClick={properties.onClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                properties.onSave(uploadedFiles);
                                properties.onClose();
                            }}
                        >
                            Save
                        </Button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
