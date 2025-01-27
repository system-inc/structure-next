'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import ProfileImage from '@structure/source/modules/account/components/ProfileImage';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';

// Dependencies - Icons
import { usePathname } from 'next/navigation';
import { Popover, PopoverItem, PopoverLabel, PopoverSeparator } from '@project/source/ui/Popover';
import AccountMenuSignedIn from './AccountMenuSignedIn';
import ThemeToggle from '@structure/source/theme/ThemeToggle';
import { Button, buttonVariants } from '@project/source/ui/Button';
import { SignOut } from '@phosphor-icons/react';
import Link from 'next/link';

// Component - AccountMenuButton
export function AccountMenuButton() {
    // Hooks
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

    function closePopover() {
        setOpen(false);
    }

    // Render the component
    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
            align="end"
            trigger={
                <Button variant="secondary" size="small" icon>
                    <ProfileImage profileImageUrl={profileImageUrl} alternateText={profileImageAlternateText} />
                </Button>
            }
            content={
                <div ref={containerRef}>
                    {/* Depending on if the user is signed in...*/}
                    {account ? (
                        // Show signed in menu options
                        <AccountMenuSignedIn
                            account={account}
                            profileImage={{ url: profileImageUrl, alt: profileImageAlternateText }}
                            closePopover={closePopover}
                        />
                    ) : (
                        // Show welcome message
                        <PopoverLabel>Welcome to Phi</PopoverLabel>
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
                    {account ? (
                        <PopoverItem
                            className="w-full text-left"
                            onClick={async function () {
                                await signOut();
                                closePopover();
                            }}
                            // processingAnimation={true}
                        >
                            <SignOut className="mr-3" />
                            Sign Out
                        </PopoverItem>
                    ) : (
                        // If not signed in
                        <div className="px-2 py-1">
                            <Link href="/sign-in" className={buttonVariants({ className: 'block w-full' })}>
                                Sign In
                            </Link>
                        </div>
                    )}
                </div>
            }
        />
    );
}

// Export - Default
export default AccountMenuButton;
