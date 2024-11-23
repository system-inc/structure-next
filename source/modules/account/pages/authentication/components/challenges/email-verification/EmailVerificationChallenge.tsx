'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

import { Button } from '@structure/source/common/buttons/Button';
// Dependencies - Main Components
import { EmailVerificationVerifyForm } from '@structure/source/modules/account/pages/authentication/components/challenges/email-verification/EmailVerificationVerifyForm';

// Dependencies - API
import { useQuery } from '@apollo/client';
import {
    EmailVerificationDocument,
    // EmailVerificationSendDocument,
    // EmailVerificationVerifyDocument,
    // AuthenticationEmailVerification,
    AuthenticationCurrentQuery,
} from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets
// import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';

// Component - EmailVerificationChallenge
export interface EmailVerificationChallengeInterface {
    emailAddress: string;
    onSuccess: (authenticationSession: AuthenticationCurrentQuery['authenticationCurrent']) => void;
}
export interface EmailVerificationChallengeInterface {
    emailAddress: string;
    onSuccess: (authenticationSession: AuthenticationCurrentQuery['authenticationCurrent']) => void;
    onChangeEmail?: () => void;
}

export function EmailVerificationChallenge(properties: EmailVerificationChallengeInterface) {
    // Hooks - API - Queries
    const emailVerificationQuery = useQuery(EmailVerificationDocument, {
        skip: false,
    });
    console.log('emailVerificationQuery', emailVerificationQuery);

    // Render the component
    return (
        <div>
            <h1 className="mb-2 text-xl">Verify Your Email</h1>

            {/* Email Sent */}
            <EmailVerificationVerifyForm emailAddress={properties.emailAddress} onSuccess={properties.onSuccess} />

            {/* Change Email Button */}
            <div className="mt-4 text-center">
                <Button variant="ghost" onClick={properties.onChangeEmail} className="w-full">
                    Use a different email
                </Button>
            </div>
        </div>
    );
}

// Export - Default
export default EmailVerificationChallenge;
