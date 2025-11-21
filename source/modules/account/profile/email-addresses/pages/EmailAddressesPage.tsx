'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Animation
import { PlaceholderAnimation } from '@structure/source/components/animations/PlaceholderAnimation';

// Dependencies - Components
import { Badge } from '@structure/source/components/badges/Badge';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/hooks/useAccount';

// Component - EmailAddressesPage
export function EmailAddressesPage() {
    // Hooks
    const account = useAccount();
    const primaryAccountEmailAddress = account.data?.emailAddress;

    // Render the component
    return (
        <>
            <h1>Email Addresses</h1>

            {account.data ? (
                // Data
                <div>
                    {/* Email Addresses List */}
                    {primaryAccountEmailAddress && (
                        <div className="mt-10 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{primaryAccountEmailAddress}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Badge variant="Neutral" kind="Outline">
                                            Primary Email
                                        </Badge>
                                        <Badge variant="Positive" kind="Status">
                                            Verified
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : account.isLoading ? (
                // Loading State
                <div className="mt-10">
                    <PlaceholderAnimation className="h-6 w-64" />
                    <PlaceholderAnimation className="mt-2 h-4 w-40" />
                </div>
            ) : null}
        </>
    );
}
