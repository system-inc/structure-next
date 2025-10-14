'use client'; // This component uses client-only features

// Dependencies - Project
import { ProjectSettings } from '@project/ProjectSettings';

// Dependencies - React and Next.js
import React from 'react';
import Image from 'next/image';
import { useRouter } from '@structure/source/router/Navigation';
import { useUrlPath } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { EmailForm } from '@structure/source/modules/account/pages/authentication/components/EmailForm';
import { EmailVerificationChallenge } from '@structure/source/modules/account/pages/authentication/components/challenges/email-verification/EmailVerificationChallenge';
import { AccountPasswordChallenge } from '@structure/source/modules/account/pages/authentication/components/challenges/account-password/AccountPasswordChallenge';
// import { Duration } from '@structure/source/common/time/Duration';

// Dependencies - Account
import { useAccount } from '@structure/source/modules/account/providers/AccountProvider';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import { AccountAuthenticationQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';

// Dependencies - Utilities
import { mergeClassNames } from '@structure/source/utilities/style/ClassName';

// Component - Authentication
export interface AuthenticationProperties {
    className?: string;
    variant?: 'Page' | 'Dialog' | 'App';
    scope: 'SignIn' | 'Maintenance';
}
export function Authentication(properties: AuthenticationProperties) {
    // State
    const [authenticationSession, setAuthenticationSession] = React.useState<
        AccountAuthenticationQuery['accountAuthentication'] | undefined
    >(undefined);
    // const [authenticationSessionStartTime] = React.useState<number>(Date.now());
    const [authenticationSessionSuccess, setAuthenticationSessionSuccess] = React.useState<boolean>(false);
    const [authenticationSessionTimedOut] = React.useState<boolean>(false);
    const [emailAddress, setEmailAddress] = React.useState<string | undefined>(undefined);
    const [redirectUrl, setRedirectUrl] = React.useState<string | null>(null);

    // Hooks
    const router = useRouter();
    const urlPath = useUrlPath();
    const account = useAccount();

    // Hooks - API - Queries
    const accountAuthenticationRequest = networkService.useGraphQlQuery(
        gql(`
            query AccountAuthentication {
                accountAuthentication {
                    status
                    scopeType
                    currentChallenge {
                        challengeType
                        status
                    }
                    updatedAt
                    createdAt
                }
            }
        `),
    );

    // Hooks - API - Mutations
    const accountAuthenticationRegistrationCompleteRequest = networkService.useGraphQlMutation(
        gql(`
            mutation AccountAuthenticationRegistrationComplete($input: AccountRegistrationCompleteInput!) {
                accountAuthenticationRegistrationComplete(input: $input) {
                    success
                }
            }
        `),
    );

    const accountAuthenticationSignInCompleteRequest = networkService.useGraphQlMutation(
        gql(`
            mutation AccountAuthenticationSignInComplete {
                accountAuthenticationSignInComplete {
                    success
                }
            }
        `),
    );

    // Effect to run on mount
    React.useEffect(function () {
        const urlParameters = new URLSearchParams(window.location.search);
        const redirect = urlParameters.get('redirectUrl');
        if(redirect) {
            setRedirectUrl(decodeURIComponent(redirect));
        }
    }, []);

    // Effect to set authentication session when data is available
    React.useEffect(
        function () {
            if(accountAuthenticationRequest.data?.accountAuthentication) {
                setAuthenticationSession(accountAuthenticationRequest.data.accountAuthentication);
            }
        },
        [accountAuthenticationRequest.data],
    );

    // Effect to run every time the authentication session changes
    React.useEffect(
        function () {
            // If the authentication session is authenticated
            if(authenticationSession?.status == 'Authenticated') {
                // If the scope is AccountRegistration
                if(
                    authenticationSession?.scopeType == 'AccountRegistration' &&
                    !accountAuthenticationRegistrationCompleteRequest.isSuccess &&
                    !accountAuthenticationRegistrationCompleteRequest.isError &&
                    !accountAuthenticationRegistrationCompleteRequest.isLoading
                ) {
                    console.log('AccountRegistrationComplete');

                    // Run the accountRegistrationComplete mutation
                    accountAuthenticationRegistrationCompleteRequest
                        .execute({
                            input: {},
                        })
                        .then(function (data) {
                            console.log('accountAuthenticationRegistrationCompleteMutation', data);

                            // Set the authentication session success
                            setAuthenticationSessionSuccess(true);

                            // Set the account signed in
                            account.setSignedIn(true);
                        })
                        .catch(function (error) {
                            console.error('Registration complete error:', error);
                        });
                }
                // If the scope is AccountSignIn
                else if(
                    authenticationSession?.scopeType == 'AccountSignIn' &&
                    !accountAuthenticationSignInCompleteRequest.isSuccess &&
                    !accountAuthenticationSignInCompleteRequest.isError &&
                    !accountAuthenticationSignInCompleteRequest.isLoading
                ) {
                    console.log('AccountSignInComplete');

                    // Run the accountSignInComplete mutation
                    accountAuthenticationSignInCompleteRequest
                        .execute()
                        .then(function (data) {
                            console.log('accountAuthenticationSignInCompleteMutation', data);

                            // Set the authentication session success
                            setAuthenticationSessionSuccess(true);

                            // Set the account signed in
                            account.setSignedIn(true);
                        })
                        .catch(function (error) {
                            console.error('Sign in complete error:', error);
                        });
                }
            }
        },
        [
            authenticationSession,
            accountAuthenticationRegistrationCompleteRequest.isSuccess,
            accountAuthenticationRegistrationCompleteRequest.isError,
            accountAuthenticationRegistrationCompleteRequest.isLoading,
            accountAuthenticationSignInCompleteRequest.isSuccess,
            accountAuthenticationSignInCompleteRequest.isError,
            accountAuthenticationSignInCompleteRequest.isLoading,
            accountAuthenticationRegistrationCompleteRequest,
            accountAuthenticationSignInCompleteRequest,
            account,
        ],
    );

    // Effect to close the authentication dialog when the account is signed in
    React.useEffect(
        function () {
            // If the account is signed in
            if(account.data) {
                // Close the authentication dialog
                account.setAuthenticationDialogOpen(false);

                // If a redirect URL is provided, redirect to that URL
                if(redirectUrl) {
                    console.log('redirecting to', redirectUrl);
                    router.push(redirectUrl);
                }
                // If no redirect URL is provided
                else {
                    // Invalidate cached queries
                    networkService.clearCache();
                }
            }
        },
        [account, redirectUrl, router],
    );

    // Effect to handle authentication success redirects
    React.useEffect(
        function () {
            if(authenticationSessionSuccess) {
                // If a redirect URL is provided, redirect to that URL
                if(redirectUrl) {
                    console.log('Redirecting to', redirectUrl);
                    router.push(redirectUrl);
                }
                // Otherwise, redirect to root if on sign-in page
                else if(urlPath == '/sign-in') {
                    router.push('/'); // Default redirect if no specific URL is provided
                }
            }
        },
        [authenticationSessionSuccess, redirectUrl, urlPath, router],
    );

    // The current authentication component based on the authentication state
    let currentAuthenticationComponent = null;

    // Authenticated session complete
    if(account.data) {
        currentAuthenticationComponent = (
            <div>
                <p>You are signed in as {account.data.emailAddress}.</p>
                <div className="mt-8 flex flex-col space-y-4">
                    <Button
                        variant="destructive"
                        onClick={function () {
                            console.log('signing out..');
                            account.signOut('/');
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
        // Redirects are handled in the useEffect above
        currentAuthenticationComponent = (
            <div className="flex items-center space-x-1.5">
                <div>
                    <BrokenCircleIcon className="h-5 w-5 animate-spin" />
                </div>
                <div>Redirecting...</div>
            </div>
        );
    }
    // Challenge - Email Verification
    else if(
        authenticationSession?.currentChallenge?.challengeType == 'EmailVerification' &&
        emailAddress !== undefined
    ) {
        currentAuthenticationComponent = (
            <EmailVerificationChallenge
                emailAddress={emailAddress!}
                onSuccess={function (authenticationSession) {
                    setAuthenticationSession(authenticationSession);
                }}
                onChangeEmail={function () {
                    setEmailAddress(undefined);
                    setAuthenticationSession(undefined);
                }}
            />
        );
    }
    // Challenge - Account Password
    else if(authenticationSession?.currentChallenge?.challengeType == 'AccountPassword' && emailAddress !== undefined) {
        currentAuthenticationComponent = (
            <AccountPasswordChallenge
                emailAddress={emailAddress!}
                onSuccess={function (authenticationSession) {
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
                onSuccess={function (emailAddress: string, authenticationSession) {
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
                    src={ProjectSettings.assets.favicon.dark.location}
                    alt="Logo"
                    height={32}
                    width={32}
                    priority={true}
                    className="hidden dark:block"
                />
                <Image
                    src={ProjectSettings.assets.favicon.light.location}
                    alt="Logo"
                    height={32}
                    width={32}
                    priority={true}
                    className="block dark:hidden"
                />
            </div>

            {/* The current authentication based on the authentication state */}
            {currentAuthenticationComponent}

            {/* Redirect & Redirect */}
            {/* <Duration
                className="neutral absolute bottom-5 right-5 font-mono text-sm"
                startTimeInMilliseconds={authenticationSessionStartTime}
            >
              {redirectUrl && <p>Redirecting to {redirectUrl}</p>}
            </Duration> */}
        </div>
    );
}
