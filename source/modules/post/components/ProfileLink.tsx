'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';
import { ProfileImage } from '@structure/source/modules/account/components/profile-image/ProfileImage';

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
                'group flex items-center space-x-2 content--2 hover:content--1 active:content--0',
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
