'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { Metadata } from 'next';

// Dependencies - Main Components
import { ProfileImageSection } from '@structure/source/modules/account/pages/profile/profile/components/ProfileImageSection';
import { ProfileInformationForm } from '@structure/source/modules/account/pages/profile/profile/components/ProfileInformationForm';
import { UsernameForm } from '@structure/source/modules/account/pages/profile/profile/components/UsernameForm';
import { PlaceholderAnimation } from '@structure/source/common/animations/PlaceholderAnimation';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';

// Metadata
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Profile',
    };
}

// Component - ProfilePage
export function ProfilePage() {
    // Hooks
    const { accountState } = useAccount();

    // Render the component
    return (
        <>
            <h1>Profile</h1>

            {/* Profile Content */}
            <div className="mt-10 items-center md:flex">
                <ProfileImageSection />

                <div className="mt-4 md:mt-0">
                    {/* Display Name */}
                    {accountState.loading ? (
                        <PlaceholderAnimation className="h-8 w-48" />
                    ) : (
                        accountState.account?.getPublicDisplayName() && (
                            <h2 className="text-2xl font-bold">{accountState.account.getPublicDisplayName()}</h2>
                        )
                    )}

                    {/* Username */}
                    {accountState.loading ? (
                        <PlaceholderAnimation className="mt-2 h-4 w-32" />
                    ) : (
                        accountState.account?.profile?.username && (
                            <p className="neutral mb-2 mt-1 text-sm">@{accountState.account.profile.username}</p>
                        )
                    )}

                    {/* Joined Date */}
                    {accountState.loading ? (
                        <PlaceholderAnimation className="mt-2 h-4 w-40" />
                    ) : (
                        <p className="text-sm">
                            Joined{' '}
                            {accountState.account?.createdAt.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    )}
                </div>
            </div>

            {/* Forms */}
            <div className="mt-10 w-full space-y-10">
                <ProfileInformationForm />
                <UsernameForm />
            </div>
        </>
    );
}

export default ProfilePage;
