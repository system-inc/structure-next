'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { Metadata } from 'next';
import { useRouter } from 'next/navigation';

// Dependencies - Main Components
import Button from '@structure/source/common/buttons/Button';

// Dependencies - Accounts
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';

// Metadata
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Sign Out',
    };
}

// Component - SignOutPage
export function SignOutPage() {
    // Hooks
    const { signOut } = useAccount();
    const router = useRouter();

    // Render the component
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <div className="rounded-medium border p-8">
                <div className="flex w-80 flex-col">
                    <p className="font-medium">Sign Out</p>
                    <p className="mt-4 text-sm">Would you like to sign out?</p>
                    <div className="mt-8 flex flex-col space-y-4">
                        <Button
                            variant="destructive"
                            onClick={function () {
                                console.log('signing out..');
                                signOut('/');
                            }}
                        >
                            Sign Out
                        </Button>
                        <Button
                            onClick={function () {
                                router.back();
                            }}
                        >
                            No, Go Back
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
