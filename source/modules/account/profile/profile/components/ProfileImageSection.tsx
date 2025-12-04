'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { ProfileImageUploader } from '@structure/source/modules/account/components/profile-image/ProfileImageUploader';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/hooks/useAccount';

// Dependencies - Animations
import { Placeholder } from '@structure/source/components/animations/Placeholder';

// Component - ProfileImageSection
export function ProfileImageSection() {
    // Hooks
    const account = useAccount();

    // Get the profile image details
    const profileImageUrl = account.data?.profile?.images?.find((image) => image.variant === 'profile-image')?.url;
    const profileImageAlternateText = account.data?.profileDisplayName;

    // Render the component
    return (
        <div className="mr-6">
            {account.data ? (
                <ProfileImageUploader
                    className="h-24 w-24"
                    profileImageUrl={profileImageUrl}
                    alternateText={profileImageAlternateText}
                    onImageChange={function () {
                        // The account provider will handle refreshing the account data
                    }}
                />
            ) : (
                <Placeholder className="h-24 w-24" />
            )}
        </div>
    );
}
