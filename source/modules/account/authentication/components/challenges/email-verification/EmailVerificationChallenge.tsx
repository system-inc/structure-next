'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { EmailVerificationVerifyForm } from '@structure/source/modules/account/authentication/components/challenges/email-verification/EmailVerificationVerifyForm';

// Dependencies - API
import { AccountAuthenticationQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Component - EmailVerificationChallenge
export interface EmailVerificationChallengeProperties {
    emailAddress: string;
    onSuccess: (authenticationSession: AccountAuthenticationQuery['accountAuthentication']) => void;
}
export interface EmailVerificationChallengeProperties {
    emailAddress: string;
    onSuccess: (authenticationSession: AccountAuthenticationQuery['accountAuthentication']) => void;
    onChangeEmail?: () => void;
}

export function EmailVerificationChallenge(properties: EmailVerificationChallengeProperties) {
    // Render the component
    return (
        <div>
            <h1 className="mb-2">Verify Your Email</h1>

            {/* Email Sent */}
            <EmailVerificationVerifyForm emailAddress={properties.emailAddress} onSuccess={properties.onSuccess} />

            {/* Change Email Button */}
            {properties.onChangeEmail && (
                <div className="mt-4 text-center">
                    <Button variant="Ghost" onClick={properties.onChangeEmail} className="w-full">
                        Use a different email
                    </Button>
                </div>
            )}
        </div>
    );
}
