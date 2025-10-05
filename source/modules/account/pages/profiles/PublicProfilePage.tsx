'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/common/navigation/Link';
import { AuthorizationLayout } from '@structure/source/layouts/AuthorizationLayout';
import { ProfileImage } from '@structure/source/modules/account/components/ProfileImage';

// Dependencies - API
import { AccountProfilePublicQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Assets
import CalendarIcon from '@structure/assets/icons/time/CalendarIcon.svg';

// Dependencies - Utilities
import { monthYear, timeFromNow } from '@structure/source/utilities/Time';

// Component - PublicProfilePage
export interface PublicProfilePageProperties {
    profilePublic: AccountProfilePublicQuery['accountProfilePublic'];
}
export function PublicProfilePage(properties: PublicProfilePageProperties) {
    // Get the profile image URL
    const profileImageUrl = properties.profilePublic?.images?.find((image) => image.variant === 'profile-image')?.url;

    // Render the component
    return (
        <AuthorizationLayout>
            <div className="container pt-8 pb-32 text-center">
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
                        {timeFromNow(new Date(properties.profilePublic?.createdAt).getTime())})
                    </span>
                </p>
            </div>
        </AuthorizationLayout>
    );
}
