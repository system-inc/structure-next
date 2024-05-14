'use client'; // This component uses client-only features

// Dependencies - Structure
import StructureSettings from '@project/StructureSettings';

// Dependencies - React and Next.js
import React from 'react';
import NextImage from 'next/image';

// Dependencies - Main Components
import ProfileImage from '@structure/source/modules/account/ProfileImage';
import FormInputText from '@structure/source/common/forms/FormInputText';
import Button from '@structure/source/common/buttons/Button';
import { useNotice } from '@structure/source/common/notifications/NoticeProvider';
import Alert from '@structure/source/common/notifications/Alert';
import { useForm } from 'react-hook-form';
import { useTransition } from '@react-spring/web';
import Cropper, { Area, Point } from 'react-easy-crop';
import { useSession } from '@structure/source/modules/account/SessionProvider';

// Dependencies - Assets
import CloseIcon from '@structure/assets/icons/navigation/CloseIcon.svg';

type ChangeProfileButtonFormData = {
    profilePicture: FileList;
};

// Component - ImageUpload
export interface ImageUploadInterface {}
export function ImageUpload(properties: ImageUploadInterface) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    // Cropper state
    const [crop, setCrop] = React.useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = React.useState(1);
    const [croppedArea, setCroppedArea] = React.useState<Area | null>(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(null);

    const { sessionToken } = useSession();

    const { register, handleSubmit, reset } = useForm<ChangeProfileButtonFormData>({
        defaultValues: {
            profilePicture: {} as FileList,
        },
    });
    const [imageSource, setImageSource] = React.useState<string>();

    const closeDialog = () => {
        setIsOpen(false);
        // Reset form
        if(imageSource) {
            URL.revokeObjectURL(imageSource);
        }
        setImageSource(undefined);
        // profile.addProfilePicture.state.clear();
        reset();
    };

    // FUNCTIONS
    const addProfilePicture = async (imgData: Blob) => {
        console.log('saving profile pic!', imgData);

        // Check if the user is logged in
        if(!sessionToken) return;

        // Upload image to server via designated avatar URL

        fetch(StructureSettings.apis.base.url + 'accounts/profiles/images', {
            method: 'POST',
            body: imgData,
            headers: {
                'Content-Type': 'image/jpeg',
                Authorization: sessionToken,
            },
        })
            .then(async (response) => {
                // Check if the image was uploaded successfully
                if(!response.ok) {
                    throw new Error('Error uploading image');
                }
                console.log(`Successfully upload the image!`);
            })
            .catch((error) => {
                console.error('Error uploading image. Error making request: ', error.message);
            });
    };

    const onSubmit = async (data: ChangeProfileButtonFormData) => {
        console.log('saving pic!');

        // profile.addProfilePicture.state.clear();
        setLoading(true);

        // Create canvas of cropped image from blob url
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.src = imageSource as string;
        await image.decode();

        if(croppedArea && croppedAreaPixels && ctx) {
            // Set canvas dimensions to image dimensions
            canvas.width = image.width;
            canvas.height = image.height;

            // Draw image to canvas
            ctx?.drawImage(image, 0, 0);

            // Extract cropped image
            const croppedImageData = ctx.getImageData(
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
            );

            // Set canvas to cropped image dimensions
            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            // paste generated rotate image at the top left corner
            ctx.putImageData(croppedImageData, 0, 0);

            // Limit size to 1MB
            const maxSize = 1000000;
            let quality = 0.9;

            const getCanvasBlob = async () => {
                return new Promise<Blob | null>((resolve) => {
                    canvas.toBlob(
                        (blob) => {
                            console.log(`Check blob size: ${blob?.size}, quality: ${quality}`);
                            if(blob && blob.size > maxSize) {
                                quality -= 0.1;
                                getCanvasBlob().then((res) => resolve(res));
                            }
                            else {
                                resolve(blob);
                            }
                        },
                        'image/jpeg',
                        quality,
                    );
                });
            };
            const blob = await getCanvasBlob();

            if(!blob) {
                console.log(`Can't get blob from canvas`);
                setLoading(false);
                return;
            }

            // Upload image to server
            const state = await addProfilePicture(blob);
            // console.log(state);

            // if(state?.avatarImageUploadState.status !== 'success') {
            //     setLoading(false);
            //     return;
            // }

            // Remove data url
            URL.revokeObjectURL(image.src);

            // Close dialog
            setLoading(false);
            closeDialog();
        }
    };

    // Render the component
    return (
        <>
            <button onClick={() => setIsOpen(true)} className="h-full w-full">
                <span className="">Edit</span>
            </button>

            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
                <div className="relative mx-6 max-h-screen w-full max-w-xl overflow-x-hidden overflow-y-scroll rounded-lg border bg-dark p-6">
                    <button
                        onClick={closeDialog}
                        className="absolute right-4 top-4 flex items-center justify-center p-2"
                    >
                        <CloseIcon className="h-6 w-6" />
                    </button>

                    <h3>Change Profile Image</h3>
                    <p>Please select a new profile picture.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                        <input
                            type="file"
                            {...register('profilePicture', {
                                onChange: (e) => {
                                    const file = e.target.files?.[0];
                                    if(file) {
                                        setImageSource(URL.createObjectURL(file));
                                    }
                                },
                            })}
                            className="my-4 font-light text-dark-4 file:mr-8 file:rounded-md file:border-none file:bg-light-4 file:p-2 file:text-dark file:hover:cursor-pointer file:dark:text-white"
                        />

                        {imageSource !== undefined && (
                            <>
                                {/* Cropper */}
                                <div className="relative my-4 h-80 w-full">
                                    {imageSource && (
                                        <Cropper
                                            image={imageSource}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={1}
                                            onCropChange={setCrop}
                                            onCropAreaChange={(area, areaPixels) => {
                                                setCroppedArea(area);
                                                setCroppedAreaPixels(areaPixels);
                                            }}
                                            onZoomChange={setZoom}
                                            cropShape="round"
                                            classes={{
                                                containerClassName: 'rounded-md',
                                                cropAreaClassName: '',
                                                mediaClassName: 'rounded-md',
                                            }}
                                            showGrid={false}
                                        />
                                    )}
                                </div>

                                {/* Zoom Controls */}
                                <div className="flex items-center justify-center space-x-4">
                                    <span className="text-dark-4">Zoom</span>
                                    <input
                                        type="range"
                                        min={1}
                                        max={3}
                                        step={0.01}
                                        value={zoom}
                                        onChange={(e) => setZoom(Number(e.target.value))}
                                        className="h-2 w-3/4 appearance-none rounded-full accent-dark before:rounded-full after:rounded-full hover:cursor-pointer"
                                        style={{
                                            background: `linear-gradient(to right, #6c6c6c 0%, #2f2f2f ${
                                                ((zoom - 1) / 2) * 100
                                            }%, #E5E7EB ${((zoom - 1) / 2) * 100}%, #E5E7EB 100%)`,
                                            WebkitAppearance: 'none',
                                        }}
                                    />
                                </div>
                            </>
                        )}

                        {/* Error indicator */}
                        {/* {profile.addProfilePicture.state.avatarImageUploadState.status === 'error' && (
                                            <div className="mt-8">
                                                <p className="text-center text-sm font-light text-red-500">
                                                    There&apos;s been an error. Please try again.
                                                </p>
                                            </div>
                                        )} */}

                        <div className="mb-4 mt-8">
                            <Button type="submit" disabled={!imageSource} loading={loading}>
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

// Export - Default
export default ImageUpload;
