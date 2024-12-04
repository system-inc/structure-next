'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { AccountPasswordForm } from '@structure/source/modules/account/pages/authentication/components/challenges/account-password/AccountPasswordForm';

// Dependencies - API
import { AccountAuthenticationQuery } from '@project/source/api/GraphQlGeneratedCode';

// Component - AccountPasswordChallenge
export interface AccountPasswordChallengeInterface {
    emailAddress: string;
    onSuccess: (authenticationSession: AccountAuthenticationQuery['accountAuthentication']) => void;
}
export function AccountPasswordChallenge(properties: AccountPasswordChallengeInterface) {
    // Render the component
    return (
        <div>
            <h1 className="mb-2 text-xl">Enter Your Password</h1>

            <AccountPasswordForm emailAddress={properties.emailAddress} onSuccess={properties.onSuccess} />
        </div>
    );
}

// Export - Default
export default AccountPasswordChallenge;
