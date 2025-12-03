'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Hooks
import { useAccount } from '@structure/source/modules/account/hooks/useAccount';
import { useAccountProfileImageUploadRequest } from '@structure/source/modules/account/hooks/useAccountProfileImageUploadRequest';
import { useAccountProfileImageRemoveRequest } from '@structure/source/modules/account/hooks/useAccountProfileImageRemoveRequest';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { Dialog } from '@structure/source/components/dialogs/Dialog';
import { Notice } from '@structure/source/components/notices/Notice';
import { ImageSelector } from '@structure/source/components/images/selector/ImageSelector';
import { ImageEditor } from '@structure/source/components/images/editor/ImageEditor';

// Dependencies - Assets
import { TrashIcon } from '@phosphor-icons/react';

// Component - ProfileImageUploadDialog
export interface ProfileImageUploadDialogProperties {
    trigger: React.ReactElement;
    profileImageUrl?: string | null;
    onImageChange?: () => void;
}
export function ProfileImageUploadDialog(properties: ProfileImageUploadDialogProperties) {
    // Hooks
    const account = useAccount();
    const accountProfileImageUploadRequest = useAccountProfileImageUploadRequest();
    const accountProfileImageRemoveRequest = useAccountProfileImageRemoveRequest({
        onSuccess: function (data) {
            // Update account atom with removed images
            if(data?.accountProfileImageRemove && account.data?.profile) {
                account.setData({
                    profile: {
                        ...account.data.profile,
                        images: data.accountProfileImageRemove.images || [],
                    },
                });
            }
            handleSuccess();
        },
        onError: function (mutationError) {
            setError(mutationError.message);
        },
    });

    // State
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [dialogMode, setDialogMode] = React.useState<'select' | 'edit'>('select');
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [error, setError] = React.useState<string | null>(null);

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
        setError(null);

        try {
            await accountProfileImageUploadRequest.execute(imageBlob);
            handleSuccess();
        }
        catch(uploadError) {
            setError(
                uploadError instanceof Error ? uploadError.message : 'An error occurred while uploading the image',
            );
        }
    }

    // Handle image removal
    async function handleRemoveImage() {
        setError(null);

        try {
            await accountProfileImageRemoveRequest.execute();
            // Success is handled by onSuccess callback
        } catch {
            // Error is handled by onError callback
        }
    }

    // Handle success (for both upload and remove)
    function handleSuccess() {
        handleDialogClose();
        // Notify parent component
        properties.onImageChange?.();
    }

    // Dialog content
    function getDialogContent() {
        // Show error if any
        if(error) {
            return (
                <Notice variant="Negative" className="mb-4">
                    {error}
                </Notice>
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
                        loading={accountProfileImageUploadRequest.isLoading}
                    />
                )}
            </div>
        );
    }

    // Get footer content (remove button shown in select mode when profile image exists)
    function getFooterContent() {
        if(dialogMode === 'select' && properties.profileImageUrl) {
            return (
                <div className="flex flex-1 justify-start">
                    <Button
                        variant="Destructive"
                        icon={TrashIcon}
                        onClick={handleRemoveImage}
                        isLoading={accountProfileImageRemoveRequest.isLoading}
                    >
                        Delete Current Picture
                    </Button>
                </div>
            );
        }
        return null;
    }

    // Render the component
    return (
        <Dialog
            variant="A"
            accessibilityTitle={dialogMode === 'select' ? 'Profile Picture' : 'Crop Profile Picture'}
            accessibilityDescription={
                dialogMode === 'select'
                    ? 'Upload or remove your profile picture'
                    : 'Crop and adjust your profile picture'
            }
            open={dialogOpen}
            onOpenChange={function (open) {
                if(!open) {
                    handleDialogClose();
                }
                else {
                    setDialogOpen(true);
                }
            }}
            trigger={properties.trigger}
            header={dialogMode === 'select' ? 'Profile Picture' : 'Crop Profile Picture'}
            body={getDialogContent()}
            footer={getFooterContent()}
            footerCloseButton={true}
        />
    );
}
