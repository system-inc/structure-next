'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import ProfileImage from './ProfileImage';
import AccountMenu from './AccountMenu';
import Popover from '@structure/source/common/interactions/Popover';

// Dependencies - Account
import { useAccountCurrent } from '@structure/source/modules/account/Account';

// Component - AccountMenuButton
export type AccountMenuButtonProperties = {};
export function AccountMenuButton(properties: AccountMenuButtonProperties) {
    // Use the current account hook
    const currentAccountState = useAccountCurrent();
    const account = currentAccountState.data;

    // Get the profile image URL
    const profileImageUrl = account?.currentProfile?.imageUrls?.find((image) => image.variant === 'profile')?.url;

    // Get the profile image alternate text
    let profileImageAlternateText = 'Profile Image';
    if(account) {
        profileImageAlternateText = account.getPublicDisplayName();
    }

    // Render the component
    return (
        <Popover content={<AccountMenu account={account} className="py-3 outline-none" />}>
            <div className="relative flex h-7 w-7 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-light-6 bg-light p-1 text-xs dark:border-dark-4 dark:bg-dark">
                <ProfileImage profileImageUrl={profileImageUrl} alternateText={profileImageAlternateText} />
            </div>
        </Popover>
    );
}

// Export - Default
export default AccountMenuButton;
