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
    const primaryAccountEmail = accountState.account?.primaryAccountEmail;

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
                    {primaryAccountEmail && (
                        <div className="mt-10 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{primaryAccountEmail.emailAddress}</p>
                                    <p className="neutral mt-1 text-sm">
                                        {primaryAccountEmail.type === 'Primary' ? 'Primary Email' : 'Secondary Email'}
                                        {primaryAccountEmail.isVerified ? ' • Verified' : ' • Not Verified'}
                                    </p>
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
