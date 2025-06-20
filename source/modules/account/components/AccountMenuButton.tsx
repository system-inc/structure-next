'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { ProfileImage } from '@structure/source/modules/account/components/ProfileImage';
import { AccountMenu } from '@structure/source/modules/account/components/AccountMenu';
import { Popover } from '@structure/source/common/popovers/Popover';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';

// Dependencies - Icons
import { useUrlPath } from '@structure/source/router/Navigation';

// Component - AccountMenuButton
export function AccountMenuButton() {
    // Hooks
    const urlPath = useUrlPath();
    const { accountState } = useAccount();

    // State
    const [open, setOpen] = React.useState(false);

    // Get the profile image URL
    const profileImageUrl = accountState.account?.profile?.images?.find(
        (image) => image.variant === 'profile-image-small',
    )?.url;

    // Get the profile image alternate text
    let profileImageAlternateText = undefined;
    if(accountState.account) {
        profileImageAlternateText = accountState.account.getPublicDisplayName();
    }

    // Effect to close the popover when the pathname changes
    React.useEffect(
        function () {
            setOpen(false);
        },
        [urlPath],
    );

    // Render the component
    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
            content={<AccountMenu account={accountState.account} className="py-3 outline-none" />}
            align="end"
        >
            <div className="h-8 w-8 cursor-pointer">
                <ProfileImage profileImageUrl={profileImageUrl} alternateText={profileImageAlternateText} />
            </div>
        </Popover>
    );
}
