'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import ProfileImage from '@structure/source/modules/account/ProfileImage';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - ProfileLink
export interface ProfileLinkInterface {
    className?: string;
    username: string;
    displayName?: string;
    imageUrls?: {
        url: string;
        variant?: string;
    }[];
}
export function ProfileLink(properties: ProfileLinkInterface) {
    // Defaults
    const displayName = properties.displayName || properties.username;

    // Get the profile image URL
    const profileImageUrl = properties.imageUrls?.find((image) => image.variant === 'profile-image-small')?.url;

    // Render the component
    return (
        <Link
            className={mergeClassNames(
                'group flex items-center space-x-2 text-neutral-6 transition-colors hover:text-dark-6 active:text-dark dark:text-light-3 dark:hover:text-light-2 dark:active:text-light',
                properties.className,
            )}
            href={`/profiles/${properties.username}`}
        >
            {/* Profile Image */}
            <div className="h-7 w-7">
                <ProfileImage profileImageUrl={profileImageUrl} alternateText={displayName} />
            </div>

            {/* Display Name */}
            <div className="group-hover:underline">{displayName}</div>
        </Link>
    );
}

// Export - Default
export default ProfileLink;
