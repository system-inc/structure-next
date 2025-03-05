'use client'; // This component uses client-only features

// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Dialog } from '@structure/source/common/dialogs/Dialog';
import { Alert } from '@structure/source/common/notifications/Alert';
import { ProfileImage } from './ProfileImage';
import { ImageSelector } from '@structure/source/common/images/ImageSelector';
import { ImageEditor } from '@structure/source/common/images/ImageEditor';

// Dependencies - API
import { useMutation, useQuery } from '@apollo/client';
import { AccountProfileImageRemoveDocument, AccountDocument } from '@project/source/api/GraphQlGeneratedCode';

// Component - ProfileImageUploader
export interface ProfileImageUploaderInterface {
    className?: string;
    profileImageUrl?: string | null;
    alternateText?: string;
    onImageChange?: () => void;
}
export function ProfileImageUploader(properties: ProfileImageUploaderInterface) {
    // State
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [dialogMode, setDialogMode] = React.useState<'select' | 'edit'>('select');
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [uploading, setUploading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // GraphQL query and mutation
    const { refetch } = useQuery(AccountDocument, { skip: true });
    const [removeProfileImage, removeProfileImageState] = useMutation(AccountProfileImageRemoveDocument, {
        onCompleted: function () {
            handleSuccess();
        },
        onError: function (error) {
            setError(error.message);
            setUploading(false);
        },
    });

    // Handle dialog close
    function handleDialogClose() {
        setDialogOpen(false);
        setDialogMode('select');
        setSelectedFile(null);
        setError(null);
    }

    // Handle file selection
    function handleFileSelected(file: File) {
        setSelectedFile(file);
        setDialogMode('edit');
        setError(null);
    }

    // Handle image upload
    async function handleImageUpload(imageBlob: Blob) {
        setUploading(true);
        setError(null);

        try {
            // Upload image to server
            const response = await fetch(ProjectSettings.apis.base.url + 'accounts/profiles/images', {
                method: 'POST',
                body: imageBlob,
                headers: {
                    'Content-Type': 'image/jpeg',
                },
                credentials: 'include', // Include HTTP-only cookies
            });

            if(!response.ok) {
                throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
            }

            // Handle success
            handleSuccess();
        }
        catch(error) {
            setError(error instanceof Error ? error.message : 'An error occurred while uploading the image');
            setUploading(false);
        }
    }

    // Handle image removal
    async function handleRemoveImage() {
        setUploading(true);
        setError(null);

        try {
            await removeProfileImage();
            // Success is handled by onCompleted callback
        }
        catch(err) {
            // Error is handled by onError callback
        }
    }

    // Handle success (for both upload and remove)
    function handleSuccess() {
        // Close dialog and reset state
        handleDialogClose();

        // Refetch account data to get updated profile image
        refetch();

        // Call the onImageChange callback if provided
        properties.onImageChange?.();
    }

    // Dialog content
    function getDialogContent() {
        // Show error if any
        if(error) {
            return (
                <Alert variant="error" className="mb-4">
                    {error}
                </Alert>
            );
        }

        // Select mode
        if(dialogMode === 'select') {
            return (
                <div className="flex flex-col gap-6">
                    <p className="text-neutral-500 dark:text-neutral-400 text-center text-sm">
                        Upload a profile picture to personalize your account. We recommend using a square image for best
                        results.
                    </p>

                    <ImageSelector
                        variant="DropZone"
                        onFileSelected={handleFileSelected}
                        accept="image/*"
                        maximumFileSizeInBytes={5 * 1024 * 1024} // 5MB
                    />

                    {properties.profileImageUrl && (
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={handleRemoveImage}
                                disabled={uploading || removeProfileImageState.loading}
                                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                                Remove current profile picture
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        // Edit mode
        return (
            <div className="flex flex-col gap-4">
                {selectedFile && (
                    <ImageEditor
                        image={selectedFile}
                        cropAspectRatio={1}
                        cropShape="Round"
                        onCancel={function () {
                            setDialogMode('select');
                        }}
                        onSave={handleImageUpload}
                        outputFormat="jpeg"
                        outputQuality={0.9}
                        maximumOutputSizeInBytes={1024 * 1024} // 1MB
                    />
                )}
            </div>
        );
    }

    // Render the component
    return (
        <>
            {/* Profile image that opens the dialog */}
            <div
                className={`relative cursor-pointer ${properties.className || ''}`}
                onClick={function () {
                    setDialogOpen(true);
                }}
            >
                <ProfileImage
                    profileImageUrl={properties.profileImageUrl || undefined}
                    alternateText={properties.alternateText}
                    className="h-full w-full"
                />

                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-0 transition-all hover:bg-opacity-50">
                    <span className="text-sm font-medium text-white opacity-0 transition-opacity hover:opacity-100">
                        {properties.profileImageUrl ? 'Change' : 'Upload'}
                    </span>
                </div>
            </div>

            {/* Upload dialog */}
            <Dialog
                open={dialogOpen}
                onOpenChange={handleDialogClose}
                header={dialogMode === 'select' ? 'Profile Picture' : 'Crop Profile Picture'}
                content={getDialogContent()}
            />
        </>
    );
}

// Export - Default
export default ProfileImageUploader;
