'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { ProfileImage } from './ProfileImage';
import { ProfileImageUploadDialog } from './ProfileImageUploadDialog';

// Dependencies - Assets
import EditIcon from '@structure/assets/icons/content/EditIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - ProfileImageUploader
export interface ProfileImageUploaderProperties {
    className?: string;
    profileImageUrl?: string | null;
    alternateText?: string;
    onImageChange?: () => void;
}
export function ProfileImageUploader(properties: ProfileImageUploaderProperties) {
    // Render the component
    return (
        <ProfileImageUploadDialog
            profileImageUrl={properties.profileImageUrl}
            onImageChange={properties.onImageChange}
            trigger={
                <div className={mergeClassNames('relative shrink-0 cursor-pointer', properties.className)}>
                    <ProfileImage
                        profileImageUrl={properties.profileImageUrl || undefined}
                        alternateText={properties.alternateText}
                        className="h-full w-full border border--3"
                    />

                    {/* Edit icon overlay in bottom right corner */}
                    <div className="absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full border border--3 background--0">
                        <EditIcon className="h-2.5 w-2.5" />
                    </div>
                </div>
            }
        />
    );
}
