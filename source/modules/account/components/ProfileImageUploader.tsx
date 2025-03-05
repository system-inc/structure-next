'use client'; // This component uses client-only features

// Dependencies - Project
import ProjectSettings from '@project/ProjectSettings';

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { Dialog } from '@structure/source/common/dialogs/Dialog';
import { Alert } from '@structure/source/common/notifications/Alert';
import { ProfileImage } from './ProfileImage';
import { ImageSelector } from '@structure/source/common/images/selector/ImageSelector';
import { ImageEditor } from '@structure/source/common/images/editor/ImageEditor';

// Dependencies - Assets
import EditIcon from '@structure/assets/icons/content/EditIcon.svg';

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
        // Always ensure uploading state is reset when closing the dialog
        setUploading(false);
    }

    // Handle file selection
    function handleFileSelected(file: File) {
        // Make sure uploading state is reset when selecting a new file
        setUploading(false);
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
        // Reset uploading state after image is confirmed updated
        // Note: We don't reset the uploading state here, as we want the loading indicator to continue
        // until we've confirmed the image has updated

        // Wait before starting to poll - image processing takes time on the server
        const startTime = Date.now();
        const initialDelay = 1250;     // Wait 1.25 seconds before first check
        const maxWaitTime = 6000;      // 6 seconds max wait time after starting polling
        let pollInterval = 500;        // Start with 500ms checks after initial delay
        let attemptCount = 0;
        
        // We'll use a smarter polling strategy based on actual server processing time:
        // 1. Initial delay: Wait 1.25s to allow server processing to complete
        // 2. First attempt: Check after server has had time to process (500ms interval)
        // 3. Later attempts: Back off gradually to reduce load
        
        const pollForUpdatedImage = async () => {
            attemptCount++;
            
            try {
                // Refetch account data to check for updated profile image
                const result = await refetch();
                const updatedProfile = result.data.account?.profile;
                const updatedImage = updatedProfile?.images?.find((img) => img.variant === 'profile-image');

                // Check if the image has been updated (different URL)
                const newImageUrl = updatedImage?.url;
                const hasChanged = newImageUrl !== properties.profileImageUrl;

                if(hasChanged) {
                    console.log(`Profile image updated after ${attemptCount} attempts (${Date.now() - startTime}ms)`);
                    // Image has been updated, reset uploading state and close dialog
                    setUploading(false);
                    handleDialogClose();
                    // Notify parent component
                    properties.onImageChange?.();
                    return;
                }

                // Check if we've exceeded the max wait time
                const elapsedTime = Date.now() - startTime;
                if(elapsedTime > (initialDelay + maxWaitTime)) {
                    console.warn(`Timed out waiting for profile image to update after ${attemptCount} attempts (${elapsedTime}ms)`);
                    // Even on timeout, reset uploading state and close dialog
                    setUploading(false);
                    handleDialogClose();
                    // Still call the callback
                    properties.onImageChange?.();
                    return;
                }

                // Adapt polling interval based on attempt count
                // First attempt: After initial delay, check at 500ms
                // Second attempt: Slightly longer (750ms)
                // Remaining attempts: Back off to reduce load (1000ms)
                if (attemptCount === 1) {
                    pollInterval = 500;
                } else if (attemptCount === 2) {
                    pollInterval = 750;
                } else {
                    pollInterval = 1000;
                }

                // Continue polling with adaptive interval
                setTimeout(pollForUpdatedImage, pollInterval);
            }
            catch(err) {
                console.error('Error polling for profile image update:', err);
                // On error, also reset uploading state and close dialog
                setUploading(false);
                handleDialogClose();
                // Still call the callback despite error
                properties.onImageChange?.();
            }
        };

        // Wait for the initial delay before first check to allow server processing
        console.log(`Waiting ${initialDelay}ms before first check`);
        setTimeout(pollForUpdatedImage, initialDelay);
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
                    <p className="text-sm">Upload a profile picture to personalize your account.</p>

                    <ImageSelector
                        variant="DropZone"
                        onFileSelected={handleFileSelected}
                        accept="image/*"
                        maximumFileSizeInBytes={5 * 1024 * 1024} // 5MB
                    />

                    {properties.profileImageUrl && (
                        <div className="flex justify-center pt-4">
                            <Button
                                variant="destructive"
                                onClick={handleRemoveImage}
                                disabled={uploading}
                                loading={removeProfileImageState.loading}
                            >
                                Remove Current Profile Picture
                            </Button>
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
                        loading={uploading}
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
                    className="h-full w-full border border-light-6 dark:border-dark-4"
                />

                {/* Edit icon overlay in bottom right corner */}
                <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-light-6 dark:border-dark-4 dark:bg-dark-2">
                    <EditIcon className="h-3.5 w-3.5" />
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
