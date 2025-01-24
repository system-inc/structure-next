'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import ProfileImage from '@structure/source/modules/account/components/ProfileImage';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';

// Dependencies - Icons
import { usePathname } from 'next/navigation';
import { Popover, PopoverItem, PopoverSeparator } from '@project/source/ui/Popover';
import AccountMenuSignedIn from './AccountMenuSignedIn';
import ThemeToggle from '@structure/source/theme/ThemeToggle';
import { Button } from '@project/source/ui/Button';
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu';
import { SignOut } from '@phosphor-icons/react';

// Component - AccountMenuButton
export function AccountMenuButton() {
    // Hooks
    const pathname = usePathname();
    const {
        accountState: { account },
        signOut,
    } = useAccount();

    const containerRef = React.useRef<HTMLDivElement>(null);

    // State
    const [open, setOpen] = React.useState(false);

    // Get the profile image URL
    const profileImageUrl = account?.profile?.images?.find((image) => image.variant === 'profile-image-small')?.url;

    // Get the profile image alternate text
    let profileImageAlternateText = undefined;
    if(account) {
        profileImageAlternateText = account.getPublicDisplayName();
    }

    // Effect to close the popover when the pathname changes
    React.useEffect(
        function () {
            setOpen(false);
        },
        [pathname],
    );

    // Render the component
    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
            onOpenAutoFocus={(e) => {
                e.preventDefault(); // Prevents the default behavior of focusing the first focusable button
            }}
            align="end"
            trigger={
                <div className="h-8 w-8 cursor-pointer">
                    <ProfileImage profileImageUrl={profileImageUrl} alternateText={profileImageAlternateText} />
                </div>
            }
            content={
                <div ref={containerRef}>
                    {/* Depending on if the user is signed in...*/}
                    {account ? (
                        // Show signed in menu options
                        <AccountMenuSignedIn
                            account={account}
                            profileImage={{ url: profileImageUrl, alt: profileImageAlternateText }}
                        />
                    ) : (
                        // Show welcome message
                        <DropdownMenuLabel>Welcome to Phi</DropdownMenuLabel>
                    )}

                    {/* Divider */}
                    <PopoverSeparator />

                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between px-3 py-2.5">
                        <p className="text-sm font-medium text-opsis-content-primary">Theme</p>

                        <ThemeToggle />
                    </div>

                    <PopoverSeparator />

                    {/* If signed in */}
                    {account && (
                        <PopoverItem
                            className="w-full text-left"
                            onClick={async function () {
                                await signOut();
                            }}
                            // processingAnimation={true}
                        >
                            <SignOut className="mr-3" />
                            Sign Out
                        </PopoverItem>
                    )}
                </div>
            }
        />
    );
}

// Export - Default
export default AccountMenuButton;
