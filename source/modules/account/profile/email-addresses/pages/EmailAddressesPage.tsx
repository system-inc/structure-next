'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Animation
import { Placeholder } from '@structure/source/components/animations/Placeholder';

// Dependencies - Components
import { Badge } from '@structure/source/components/badges/Badge';
import { Card } from '@structure/source/components/containers/Card';

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
            <h1 className="mb-10">Email Addresses</h1>

            <Card variant="A">
                <h2 className="mb-4 text-base font-medium">Primary Email</h2>
                <p className="mb-6 text-sm content--4">
                    Your primary email address is used for account notifications and sign-in.
                </p>

                {account.data ? (
                    primaryAccountEmailAddress && (
                        <div className="flex items-center gap-2">
                            <p className="font-medium">{primaryAccountEmailAddress}</p>
                            <Badge variant="Positive" kind="Status">
                                Verified
                            </Badge>
                        </div>
                    )
                ) : account.isLoading ? (
                    <div>
                        <Placeholder className="h-6 w-64" />
                        <Placeholder className="mt-2 h-4 w-40" />
                    </div>
                ) : null}
            </Card>
        </>
    );
}
