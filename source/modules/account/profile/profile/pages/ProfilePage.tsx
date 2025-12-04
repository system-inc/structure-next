'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Card } from '@structure/source/components/containers/Card';
import { ProfileImageSection } from '@structure/source/modules/account/profile/profile/components/ProfileImageSection';
import { ProfileDetailsForm } from '@structure/source/modules/account/profile/profile/components/ProfileDetailsForm';
import { UsernameForm } from '@structure/source/modules/account/profile/profile/components/UsernameForm';
import { Placeholder } from '@structure/source/components/animations/Placeholder';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/hooks/useAccount';

// Component - ProfilePage
export function ProfilePage() {
    // Hooks
    const account = useAccount();

    // Render the component
    return (
        <>
            <h1>Profile</h1>

            {/* Profile Content */}
            <div className="mt-10 items-center md:flex">
                <ProfileImageSection />

                <div className="mt-4 md:mt-0">
                    {/* Display Name */}
                    {account.data?.profileDisplayName ? (
                        <h2 className="text-2xl font-semibold">{account.data.profileDisplayName}</h2>
                    ) : (
                        account.isLoading && <Placeholder className="h-8 w-48" />
                    )}

                    {/* Username */}
                    {account.data?.profile?.username ? (
                        <p className="mt-1 mb-2 text-sm content--1">@{account.data.profile.username}</p>
                    ) : (
                        account.isLoading && <Placeholder className="mt-2 h-4 w-32" />
                    )}

                    {/* Joined Date */}
                    {account.data?.createdAt ? (
                        <p className="text-sm">
                            Joined{' '}
                            {account.data.createdAt.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    ) : (
                        account.isLoading && <Placeholder className="mt-2 h-4 w-40" />
                    )}
                </div>
            </div>

            {/* Forms */}
            <div className="mt-10 w-full space-y-10">
                <Card variant="A">
                    <h2 className="mb-6 text-base font-medium">Details</h2>
                    <ProfileDetailsForm />
                </Card>

                <Card variant="A">
                    <h2 className="mb-6 text-base font-medium">Change Username</h2>
                    <UsernameForm />
                </Card>
            </div>
        </>
    );
}
