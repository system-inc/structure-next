'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import ProfileImage from '@structure/source/modules/account/ProfileImage';
import AccountMenu from '@structure/source/modules/account/AccountMenu';
import Popover from '@structure/source/common/popovers/Popover';

// Dependencies - Account
import { useAccountCurrent } from '@structure/source/modules/account/Account';

// Dependencies - Icons
import AccountIcon from '@structure/assets/icons/people/UserIcon.svg';
import { usePathname } from 'next/navigation';

// Component - AccountMenuButton
export type AccountMenuButtonProperties = {};
export function AccountMenuButton(properties: AccountMenuButtonProperties) {
    const [open, setOpen] = React.useState(false);

    // Use the current account hook
    const currentAccountState = useAccountCurrent();
    const account = currentAccountState.data;

    // Get the profile image URL
    const profileImageUrl = account?.currentProfile?.imageUrls?.find((image) => image.variant === 'profile')?.url;

    // Get the profile image alternate text
    let profileImageAlternateText = undefined;
    if(account) {
        profileImageAlternateText = account.getPublicDisplayName();
    }

    const pathname = usePathname();
    React.useEffect(() => {
        setOpen(false);
    }, [pathname]);

    // Render the component
    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
            content={<AccountMenu account={account} className="py-3 outline-none" />}
            align="end"
        >
            <div className="relative flex h-7 w-7 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-light-6 bg-light p-1 dark:border-dark-4 dark:bg-dark">
                {account && (
                    <ProfileImage profileImageUrl={profileImageUrl} alternateText={profileImageAlternateText} />
                )}
                {!account && currentAccountState.error && <AccountIcon className="h-full w-full object-cover" />}
            </div>
        </Popover>
    );
}

// Export - Default
export default AccountMenuButton;
