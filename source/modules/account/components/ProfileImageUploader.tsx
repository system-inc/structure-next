'use client'; // This component uses client-only features

// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { Dialog } from '@structure/source/components/dialogs/Dialog';
import { Alert } from '@structure/source/components/notifications/Alert';
import { ProfileImage } from './ProfileImage';
import { ImageSelector } from '@structure/source/components/images/selector/ImageSelector';
import { ImageEditor } from '@structure/source/components/images/editor/ImageEditor';

// Dependencies - Assets
import EditIcon from '@structure/assets/icons/content/EditIcon.svg';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import { AccountQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Types - Profile Image Upload Response
interface StoredObject {
    id: string;
    createdAt: string;
    updatedAt: string;
    storedObjectGroupId: string;
    status: string;
    name: string;
    source: string;
    extension: string;
    isTemporary: boolean;
    key: string;
    version: string;
    size: number;
    etag: string;
    httpEtag: string;
    uploadedAt: string;
    purgedAt: null | string;
    meta: null | unknown;
    url: string;
}
interface ProfileImageUploadResponse {
    original: StoredObject;
    transformed?: StoredObject[];
}

// Component - ProfileImageUploader
export interface ProfileImageUploaderProperties {
    className?: string;
    profileImageUrl?: string | null;
    alternateText?: string;
    onImageChange?: () => void;
}
export function ProfileImageUploader(properties: ProfileImageUploaderProperties) {
    // State
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [dialogMode, setDialogMode] = React.useState<'select' | 'edit'>('select');
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [uploading, setUploading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // GraphQL mutation
    const removeProfileImageMutation = networkService.useGraphQlMutation(
        gql(`
            mutation AccountProfileImageRemove {
                accountProfileImageRemove {
                    images {
                        url
                        variant
                    }
                }
            }
        `),
        {
            onSuccess: function () {
                handleSuccess();
            },
            onError: function (error) {
                setError(error.message);
                setUploading(false);
            },
        },
    );

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
            // Upload image to server via NetworkService
            const response = await networkService.request(
                'https://' + ProjectSettings.apis.base.host + '/accounts/profiles/images',
                {
                    method: 'POST',
                    body: imageBlob,
                    headers: {
                        'Content-Type': 'image/jpeg',
                    },
                },
            );

            // Parse the response JSON
            const profileImageUploadResponse = (await response.json()) as ProfileImageUploadResponse;

            // Handle success with the image data
            handleSuccess(profileImageUploadResponse);
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
            await removeProfileImageMutation.execute();
            // Success is handled by onSuccess callback
        } catch {
            // Error is handled by onError callback
        }
    }

    // Handle success (for both upload and remove)
    async function handleSuccess(profileImageUploadResponse?: ProfileImageUploadResponse) {
        if(
            profileImageUploadResponse &&
            profileImageUploadResponse.original &&
            profileImageUploadResponse.transformed &&
            profileImageUploadResponse.transformed.length > 0
        ) {
            // Get cached account data
            const accountData = networkService.getCache<AccountQuery>(['account']);

            if(accountData && accountData.account) {
                // Create new images array from the upload response
                const newImages = [
                    // Original image
                    {
                        url: profileImageUploadResponse.original.url,
                        variant: profileImageUploadResponse.original.name,
                    },
                    // All transformed images
                    ...profileImageUploadResponse.transformed.map((transformedImage) => ({
                        url: transformedImage.url,
                        variant: transformedImage.name,
                    })),
                ];

                // Create updated account data with new image URLs
                const updatedAccount = {
                    ...accountData.account,
                    profile: {
                        ...accountData.account.profile,
                        images: newImages,
                    },
                };

                // Update the cache with new data
                networkService.setCache(['account'], { account: updatedAccount });
            }
        }
        else if(removeProfileImageMutation.data) {
            // For image removal, update the cache with the mutation result
            const removeResult = removeProfileImageMutation.data.accountProfileImageRemove;
            const accountData = networkService.getCache<AccountQuery>(['account']);

            if(removeResult && accountData && accountData.account) {
                // Create updated account data with the response
                const updatedAccount = {
                    ...accountData.account,
                    profile: {
                        ...accountData.account.profile,
                        images: removeResult.images || [],
                    },
                };

                // Update the cache with new data
                networkService.setCache(['account'], { account: updatedAccount });
            }
        }

        // Image has been updated, reset uploading state and close dialog
        setUploading(false);
        handleDialogClose();
        // Notify parent component
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
                                variant="Destructive"
                                onClick={handleRemoveImage}
                                isLoading={uploading || removeProfileImageMutation.isLoading}
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
                    className="h-full w-full border border--d"
                />

                {/* Edit icon overlay in bottom right corner */}
                <div className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border border--d">
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
