'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import { AuthorizationLayout } from '@structure/source/layouts/AuthorizationLayout';
import { ProfileImage } from '@structure/source/modules/account/components/ProfileImage';

// Dependencies - API
import { ProfilePublicQuery } from '@project/source/api/graphql';

// Dependencies - Assets
import CalendarIcon from '@structure/assets/icons/time/CalendarIcon.svg';

// Dependencies - Utilities
import { monthYear, timeAgo } from '@structure/source/utilities/Time';

// Component - PublicProfilePage
export interface PublicProfilePageInterface {
    profilePublic: ProfilePublicQuery['profilePublic'];
}
export function PublicProfilePage(properties: PublicProfilePageInterface) {
    // Get the profile image URL
    const profileImageUrl = properties.profilePublic?.imageUrls?.find((image) => image.variant === 'profile-image')
        ?.url;

    // Render the component
    return (
        <AuthorizationLayout>
            <div className="container pb-32 pt-8 text-center">
                <div className="mx-auto mb-4 flex h-40 w-40">
                    <ProfileImage
                        className=""
                        alternateText={properties.profilePublic?.displayName ?? undefined}
                        profileImageUrl={profileImageUrl}
                    />
                </div>
                <h1 className="mb-1 text-2xl">{properties.profilePublic?.displayName}</h1>
                <Link className="mb-2" href={'/profiles/' + properties.profilePublic?.username}>
                    @{properties.profilePublic?.username}
                </Link>
                <p className="neutral mt-2 flex items-center justify-center space-x-1.5 text-sm">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                        Joined {monthYear(new Date(properties.profilePublic?.createdAt))} (
                        {timeAgo(new Date(properties.profilePublic?.createdAt).getTime())})
                    </span>
                </p>
            </div>
        </AuthorizationLayout>
    );
}

// Export - Default
export default PublicProfilePage;