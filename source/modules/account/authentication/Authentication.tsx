'use client'; // This component uses client-only features

// Dependencies - Structure
import { StructureSettings } from '@project/StructureSettings';

// Dependencies - React and Next.js
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { useAccount } from '@structure/source/modules/account/AccountProvider';
import { EmailForm } from '@structure/source/modules/account/authentication/EmailForm';
import { EmailVerificationChallenge } from '@structure/source/modules/account/authentication/challenges/email-verification/EmailVerificationChallenge';
import { AccountPasswordChallenge } from '@structure/source/modules/account/authentication/challenges/account-password/AccountPasswordChallenge';
import { Duration } from '@structure/source/common/time/Duration';

// Dependencies - API
import { useApolloClient, useQuery, useMutation } from '@apollo/client';
import {
    AuthenticationCurrentDocument,
    AccountRegistrationCompleteDocument,
    AccountSignInCompleteDocument,
    AuthenticationSession,
} from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Styles
import { useTheme } from '@structure/source/theme/ThemeProvider';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/Style';

// Component - Authentication
export interface AuthenticationInterface {
    className?: string;
    variant?: 'Page' | 'Dialog' | 'App';
    scope: 'SignIn' | 'Maintenance';
}
export function Authentication(properties: AuthenticationInterface) {
    // State
    const [authenticationSession, setAuthenticationSession] = React.useState<AuthenticationSession | undefined>(
        undefined,
    );
    const [authenticationSessionStartTime] = React.useState<number>(Date.now());
    const [authenticationSessionSuccess, setAuthenticationSessionSuccess] = React.useState<boolean>(false);
    const [authenticationSessionTimedOut] = React.useState<boolean>(false);
    const [emailAddress, setEmailAddress] = React.useState<string | undefined>(undefined);
    const [redirectUrl, setRedirectUrl] = React.useState<string | null>(null);

    // Hooks
    const router = useRouter();
    const { themeClassName } = useTheme();
    const { accountState, setSignedIn, signOut, setAuthenticationDialogOpen } = useAccount();
    const apolloClient = useApolloClient();

    // Hooks - API - Queries
    useQuery(AuthenticationCurrentDocument, {
        // Immediately run the query and see if we already have an authentication session
        onCompleted: function (data) {
            if(data.authenticationCurrent) {
                setAuthenticationSession(data.authenticationCurrent);
            }
        },
    });

    // Hooks - API - Mutations
    const [accountRegistrationCompleteMutation] = useMutation(AccountRegistrationCompleteDocument);
    const [accountSignInCompleteMutation] = useMutation(AccountSignInCompleteDocument);

    // Effect to run on mount
    React.useEffect(function () {
        const urlParameters = new URLSearchParams(window.location.search);
        const redirect = urlParameters.get('redirectUrl');
        if(redirect) {
            setRedirectUrl(decodeURIComponent(redirect));
        }
    }, []);

    // Effect to run every time the authentication session changes
    React.useEffect(
        function () {
            // If the authentication session is authenticated
            if(authenticationSession?.status == 'Authenticated') {
                // If the scope is AccountRegistration
                if(authenticationSession?.scopeType == 'AccountRegistration') {
                    console.log('AccountRegistrationComplete');

                    // Run the accountRegistrationComplete mutation
                    accountRegistrationCompleteMutation({
                        variables: {
                            input: {},
                        },
                        onCompleted: function (data) {
                            console.log('accountRegistrationCompleteMutation', data);

                            // Set the authentication session success
                            setAuthenticationSessionSuccess(true);

                            // Set the account signed in
                            setSignedIn(true);
                        },
                    });
                }
                // If the scope is AccountSignIn
                else if(authenticationSession?.scopeType == 'AccountSignIn') {
                    console.log('AccountSignInComplete');

                    // Run the accountSignInComplete mutation
                    accountSignInCompleteMutation({
                        onCompleted: function (data) {
                            console.log('accountSignInCompleteMutation', data);

                            // Set the authentication session success
                            setAuthenticationSessionSuccess(true);

                            // Set the account signed in
                            setSignedIn(true);
                        },
                    });
                }
            }
        },
        [authenticationSession, accountRegistrationCompleteMutation, accountSignInCompleteMutation, setSignedIn],
    );

    // Effect to close the authentication dialog when the account is signed in
    React.useEffect(
        function () {
            // If the account is signed in
            if(accountState.account) {
                // Close the authentication dialog
                setAuthenticationDialogOpen(false);

                // If a redirect URL is provided, redirect to that URL
                if(redirectUrl) {
                    console.log('redirecting to', redirectUrl);
                    router.push(redirectUrl);
                }
                // If no redirect URL is provided
                else {
                    // Refetch queries
                    apolloClient.reFetchObservableQueries();
                }
            }
        },
        [accountState.account, setAuthenticationDialogOpen, apolloClient, redirectUrl, router],
    );

    // The current authentication component based on the authentication state
    let currentAuthenticationComponent = null;

    // Authenticated session complete
    if(accountState.account) {
        currentAuthenticationComponent = (
            <div>
                <p>You are signed in as {accountState.account.primaryAccountEmail?.emailAddress}. </p>
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
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }
    // Authenticated session success
    else if(authenticationSessionSuccess) {
        // If a redirect URL is provided, redirect to that URL
        if(redirectUrl) {
            console.log('redirecting to', redirectUrl);
            router.push(redirectUrl);
        }
        else {
            // router.push('/'); // Default redirect if no specific URL is provided
        }
    }
    // Challenge - Email Verification
    else if(authenticationSession?.currentChallenge?.challengeType == 'EmailVerification') {
        currentAuthenticationComponent = (
            <EmailVerificationChallenge
                emailAddress={emailAddress!}
                onSuccess={function (authenticationSession: AuthenticationSession) {
                    setAuthenticationSession(authenticationSession);
                }}
            />
        );
    }
    // Challenge - Account Password
    else if(authenticationSession?.currentChallenge?.challengeType == 'AccountPassword') {
        currentAuthenticationComponent = (
            <AccountPasswordChallenge
                emailAddress={emailAddress!}
                onSuccess={function (authenticationSession: AuthenticationSession) {
                    setAuthenticationSession(authenticationSession);
                }}
            />
        );
    }
    // Authenticated session authenticated and ready to complete
    else if(authenticationSession?.status == 'Authenticated') {
        currentAuthenticationComponent = (
            <div className="flex items-center space-x-1.5">
                <div>
                    <BrokenCircleIcon className="h-5 w-5 animate-spin" />
                </div>
                <div>
                    {authenticationSession?.scopeType === 'AccountRegistration'
                        ? 'Creating your account...'
                        : 'Signing you in...'}
                </div>
            </div>
        );
    }
    // No challenges
    else {
        currentAuthenticationComponent = (
            <EmailForm
                onSuccess={function (emailAddress: string, authenticationSession: AuthenticationSession) {
                    setEmailAddress(emailAddress);
                    setAuthenticationSession(authenticationSession);
                }}
            >
                {/* Previous Authentication Session Timed Out */}
                {authenticationSessionTimedOut && (
                    <p className="mb-3">Your previous authentication session timed out.</p>
                )}
            </EmailForm>
        );
    }

    // Render the component
    return (
        <div className={mergeClassNames('', properties.className)}>
            {/* Project Logo */}
            <div className="mb-8">
                <Image
                    src={
                        themeClassName == 'dark'
                            ? StructureSettings.assets.favicon.dark.location
                            : StructureSettings.assets.favicon.light.location
                    }
                    alt="Logo"
                    height={32}
                    width={32}
                    priority={true}
                />
            </div>

            {/* The current authentication based on the authentication state */}
            {currentAuthenticationComponent}

            <Duration
                className="neutral absolute bottom-5 right-5 font-mono text-sm"
                startTimeInMilliseconds={authenticationSessionStartTime}
            >
                {/* Redirect */}
                {redirectUrl && <p>Redirecting to {redirectUrl}</p>}
            </Duration>
        </div>
    );
}

// Export - Default
export default Authentication;
