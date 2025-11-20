'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useUrlPath } from '@structure/source/router/Navigation';

// Dependencies - Hooks
import { useAccount } from '@structure/source/modules/account/hooks/useAccount';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { ProfileImage } from '@structure/source/modules/account/components/profile-image/ProfileImage';

// Dependencies - Assets
import { CrownSimpleIcon } from '@phosphor-icons/react/ssr';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - AccountBannerButton
interface AccountNavigationBannerButtonProperties {
    className?: string;
    onClick?: () => void;
}
export const AccountNavigationBannerButton = React.forwardRef<
    HTMLAnchorElement,
    AccountNavigationBannerButtonProperties
>(function (properties, reference) {
    // Hooks
    const urlPath = useUrlPath();
    const account = useAccount();

    const href = '/account/profile';
    const displayName = account.data?.profile.displayName;
    const profileImage = {
        url: account.data?.profile.images?.find((image) => image.variant === 'profile-image-small')?.url,
        alt: account.data?.profileDisplayName,
    };

    // Determine if this link is active
    const isActive = urlPath === href || urlPath.startsWith(href + '/');

    if(!account) return null;

    return (
        <Button
            ref={reference}
            variant="Ghost"
            className={mergeClassNames(
                'flex w-full items-center justify-between px-2.5 hover:background--3 active:background--5! dark:hover:background--4 dark:active:background--6!',
                isActive && 'background--4! dark:background--5!',
                properties.className,
            )}
            href={href}
            onClick={properties.onClick}
        >
            <div className="flex items-center gap-3">
                <div className="aspect-square w-10 rounded-full">
                    <ProfileImage profileImageUrl={profileImage?.url} alternateText={profileImage?.alt} />
                </div>

                <div>
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className="text-xs content--4">@{account.data?.profile.username}</p>
                </div>
            </div>

            {/* Icon */}
            {account.data?.isAdministrator() && <CrownSimpleIcon weight="bold" className="h-4 w-4 content--4" />}
        </Button>
    );
});

// Set the display name on the component for debugging
AccountNavigationBannerButton.displayName = 'AccountBannerButton';
