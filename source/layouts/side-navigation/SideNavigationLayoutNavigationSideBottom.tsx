'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import Button from '@structure/source/common/buttons/Button';
import ProfileImage from '@structure/source/modules/account/components/ProfileImage';

// Dependencies - Shared State
import { useAtom, useSetAtom } from 'jotai';
import {
    desktopMinimumWidth,
    getAtomForNavigationOpen,
    getAtomForNavigationManuallyClosed,
} from '@structure/source/layouts/side-navigation/SideNavigationLayoutNavigation';

// Dependencies - Hooks
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';

// Dependencies - Assets
import { Gear } from '@phosphor-icons/react';

// Component - SideNavigationLayoutNavigationBottom
export interface SideNavigationLayoutNavigationBottomInterface {
    layoutIdentifier: string; // Used to differentiate between different implementations of side navigations (and their local storage keys)
    className?: string;
}
export function SideNavigationLayoutNavigationBottom(
    properties: SideNavigationLayoutNavigationBottomInterface,
)  {
    // Shared State
    const [sideNavigationLayoutNavigationOpen, setSideNavigationLayoutNavigationOpen] = useAtom(
        getAtomForNavigationOpen(properties.layoutIdentifier),
    );
    const setSideNavigationLayoutNavigationManuallyClosed = useSetAtom(
        getAtomForNavigationManuallyClosed(properties.layoutIdentifier),
    );

    const { accountState: { account } } = useAccount();

    const displayName = account?.profile.displayName;
    const profileImage = {
        url: account?.profile.images?.find((image) => image.variant === 'profile-image-small')?.url,
        alt: account?.getPublicDisplayName(),
    };
    const role = account?.accessRoles?.[0] ?? '';

    return (
        <div className="flex items-center justify-between h-20 px-4 py-2 bg-opsis-background-secondary border-t border-opsis-border-primary">
            <div className="flex items-center justify-start gap-4 md:gap-3">
                <div className="aspect-square w-16 rounded-full md:w-10">
                    <ProfileImage profileImageUrl={profileImage?.url} alternateText={profileImage?.alt} />
                </div>

                <div>
                    <p className="mb-1 text-sm font-medium text-opsis-content-primary md:mb-0">{displayName}</p>
                    <p className="text-xs font-normal text-opsis-content-secondary">{role}</p>
                </div>
            </div>

            <Button
                variant="ghost"
                size="icon"
                className="focus:border-0"
                icon={Gear}
                onClick={async function () {
                    alert('Account Settings clicked');
                }}
            />
        </div>
    )
}

// Export - Default
export default SideNavigationLayoutNavigationBottom;