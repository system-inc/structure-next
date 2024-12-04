'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Dialog } from '@structure/source/common/dialogs/Dialog';
import { ProfileImage } from '@structure/source/modules/account/components/ProfileImage';

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
                <Dialog content="Profile Image Upload Coming Soon">
                    <div className="flex h-32 w-32 cursor-pointer">
                        <ProfileImage profileImageUrl={profileImageUrl} alternateText={profileImageAlternateText} />
                    </div>
                </Dialog>
            )}
        </div>
    );
}
