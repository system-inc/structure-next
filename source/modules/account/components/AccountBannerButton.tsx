'use client';

import React from 'react';
import ProfileImage from './ProfileImage';
import { CrownSimple } from '@phosphor-icons/react';
import { useAccount } from '../providers/AccountProvider';
import { mergeClassNames } from '@structure/source/utilities/Style';

type AccountBannerButtonProps = React.HTMLAttributes<HTMLButtonElement>;
const AccountBannerButton = React.forwardRef<HTMLButtonElement, AccountBannerButtonProps>(
    ({ className, ...props }, ref) => {
        const {
            accountState: { account },
        } = useAccount();
        const displayName = account?.profile.displayName;
        const profileImage = {
            url: account?.profile.images?.find((image) => image.variant === 'profile-image-small')?.url,
            alt: account?.getPublicDisplayName(),
        };

        if(!account) return null;
        return (
            <button
                ref={ref}
                className={mergeClassNames(
                    'flex w-full items-center justify-between text-left transition-colors hover:bg-opsis-action-ghost-hover active:bg-opsis-action-ghost-pressed',
                    className,
                )}
                {...props}
            >
                <div className="flex items-center justify-start gap-4 md:gap-3">
                    <div className="aspect-square w-16 rounded-full md:w-10">
                        <ProfileImage profileImageUrl={profileImage?.url} alternateText={profileImage?.alt} />
                    </div>

                    <div>
                        <p className="mb-1 text-sm font-medium text-opsis-content-primary md:mb-0">{displayName}</p>
                        <p className="text-xs font-normal text-opsis-content-secondary">@{account?.profile.username}</p>
                    </div>
                </div>

                {/* Icon */}
                {account?.isAdministator() && <CrownSimple className="h-4 w-4 text-opsis-content-secondary" />}
            </button>
        );
    },
);

AccountBannerButton.displayName = 'AccountBannerButton';

export default AccountBannerButton;
