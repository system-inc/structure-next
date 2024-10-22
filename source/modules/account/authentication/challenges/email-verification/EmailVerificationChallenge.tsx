'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { EmailVerificationVerifyForm } from '@structure/source/modules/account/authentication/challenges/email-verification/EmailVerificationVerifyForm';

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
export function EmailVerificationChallenge(properties: EmailVerificationChallengeInterface) {
    // Hooks - API - Queries
    const emailVerificationQuery = useQuery(EmailVerificationDocument, {
        skip: false,
    });
    console.log('emailVerificationQuery', emailVerificationQuery);

    // Hooks - API - Mutations
    // const [emailVerificationSendMutation, emailVerificationSendMutationState] =
    //     useMutation(EmailVerificationSendDocument);
    // const [emailVerificationVerifyMutation, emailVerificationVerifyMutationState] = useMutation(
    //     EmailVerificationVerifyDocument,
    // );

    // Render the component
    return (
        <div>
            <h1 className="mb-2 text-xl">Verify Your Email</h1>

            {/* Sending Email */}
            {/* {emailVerificationSendStatus === 'NotSent' && (
                <div className="neutral flex items-center space-x-1.5">
                    <div>
                        <BrokenCircleIcon className="h-4 w-4 animate-spin" />
                    </div>
                    <div>Sending email to {properties.emailAddress}...</div>
                </div>
            )} */}

            {/* Failed to Send Email */}
            {/* {emailVerificationSendStatus === 'FailedToSend' && (
                <div className="neutral">
                    <div>
                        Failed to send email to {properties.emailAddress}. This could be for one of these reasons:
                    </div>
                    <ul className="ml-2 mt-2 list-inside list-disc">
                        <li>The email address entered is invalid.</li>
                        <li>There is a problem with your email provider.</li>
                        <li>There is a problem with our system.</li>
                    </ul>
                    <div className="mt-2">
                        Please{' '}
                        <Link className="primary" href="/support">
                            contact us
                        </Link>{' '}
                        if you believe the issue is on our end.
                    </div>
                </div>
            )} */}

            {/* Email Sent */}
            <EmailVerificationVerifyForm emailAddress={properties.emailAddress} onSuccess={properties.onSuccess} />
        </div>
    );
}

// Export - Default
export default EmailVerificationChallenge;
