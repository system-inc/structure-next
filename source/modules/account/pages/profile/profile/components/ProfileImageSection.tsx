'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { ProfileImageUploader } from '@structure/source/modules/account/components/ProfileImageUploader';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';

// Dependencies - Animations
import { PlaceholderAnimation } from '@structure/source/common/animations/PlaceholderAnimation';

// Component - ProfileImageSection
export function ProfileImageSection() {
    // Hooks
    const { accountState } = useAccount();

    // Get the profile image details
    const profileImageUrl = accountState.account?.profile?.images?.find((image) => image.variant === 'profile-image')
        ?.url;
    const profileImageAlternateText = accountState.account?.getPublicDisplayName();

    // Render the component
    return (
        <div className="mr-6">
            {accountState.loading ? (
                <PlaceholderAnimation className="h-32 w-32" />
            ) : (
                <ProfileImageUploader
                    className="h-32 w-32"
                    profileImageUrl={profileImageUrl}
                    alternateText={profileImageAlternateText}
                    onImageChange={() => {
                        // The account provider will handle refreshing the account data
                    }}
                />
            )}
        </div>
    );
}
