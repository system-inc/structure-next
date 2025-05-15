'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { Metadata } from 'next';

// Dependencies - Animation
import { PlaceholderAnimation } from '@structure/source/common/animations/PlaceholderAnimation';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';

// Metadata
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Email Addresses',
    };
}

// Component - EmailAddressesPage
export function EmailAddressesPage() {
    // Hooks
    const { accountState } = useAccount();
    const primaryAccountEmailAddress = accountState.account?.emailAddress;

    // Render the component
    return (
        <>
            <h1>Email Addresses</h1>

            {accountState.loading ? (
                // Loading State
                <div className="mt-10">
                    <PlaceholderAnimation className="h-6 w-64" />
                    <PlaceholderAnimation className="mt-2 h-4 w-40" />
                </div>
            ) : (
                // Data
                <div>
                    {/* Email Addresses List */}
                    {primaryAccountEmailAddress && (
                        <div className="mt-10 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{primaryAccountEmailAddress}</p>
                                    <p className="neutral mt-1 text-sm">Primary Email • Verified</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

// Export - Default
export default EmailAddressesPage;
