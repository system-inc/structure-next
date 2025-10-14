'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/common/navigation/Link';
import { ProfileImage } from '@structure/source/modules/account/components/ProfileImage';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - ProfileLink
export interface ProfileLinkProperties {
    className?: string;
    username: string;
    displayName?: string;
    imageUrls?: {
        url: string;
        variant?: string;
    }[];
}
export function ProfileLink(properties: ProfileLinkProperties) {
    // Defaults
    const displayName = properties.displayName || properties.username;

    // Get the profile image URL
    const profileImageUrl = properties.imageUrls?.find((image) => image.variant === 'profile-image-small')?.url;

    // Render the component
    return (
        <Link
            className={mergeClassNames(
                'group flex items-center space-x-2 text-neutral-6 hover:text-dark-6 active:text-dark dark:text-light-3 dark:hover:text-light-2 dark:active:text-light',
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
