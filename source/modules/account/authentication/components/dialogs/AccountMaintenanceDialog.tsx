'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { DialogProperties, Dialog } from '@structure/source/components/dialogs/Dialog';
import {
    AccountAuthenticatedSession,
    AccountSessionScopeType,
} from '@structure/source/modules/account/authentication/AccountAuthenticatedSession';
import { LoadingAnimation } from '@structure/source/components/animations/LoadingAnimation';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import { AuthenticationSessionStatus } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Component - AccountMaintenanceDialog
// This dialog provides a secure authentication layer for sensitive account operations.
// It follows a three-phase flow:
// 1. Check if user is already authenticated for account maintenance
// 2. If not, prompt for authentication (password or email verification)
// 3. Once authenticated, execute the sensitive operation
export interface AccountMaintenanceDialogProperties
    extends Omit<DialogProperties, 'accessibilityTitle' | 'accessibilityDescription'> {
    actionText: string; // Describes the action requiring authentication (e.g., "change your password")
    onAuthenticated: () => void; // Callback executed after successful authentication
}
export function AccountMaintenanceDialog(properties: AccountMaintenanceDialogProperties) {
    // State
    const [open, setOpen] = React.useState(properties.open ?? false);
    const [checkingAuthentication, setCheckingAuthentication] = React.useState(false);
    const [hasCheckedAuthentication, setHasCheckedAuthentication] = React.useState(false);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [shouldProceed, setShouldProceed] = React.useState(true);

    // Check current authentication session - using query without cache for fresh data
    // We use cache: false to ensure we always get the latest auth status from the server
    // This is critical for security checks - we never want stale authentication data
    const accountAuthenticationQuery = networkService.useGraphQlQuery(
        gql(`
            query AccountMaintenanceDialogAuthentication {
                accountAuthentication {
                    status
                    scopeType
                    currentChallenge {
                        challengeType
                        status
                    }
                }
            }
        `),
        undefined,
        {
            cache: false, // Always fetch fresh authentication status
            enabled: false, // We'll manually trigger with refresh()
        },
    );

    // Effect to handle dialog opening and closing
    React.useEffect(
        function () {
            setOpen(properties.open ?? false);

            // Reset state when dialog closes
            if(!properties.open) {
                setCheckingAuthentication(false);
                setIsAuthenticated(false);
                setHasCheckedAuthentication(false);
                setShouldProceed(true);
            }
            else {
                // Set to true when opening
                setShouldProceed(true);
            }
        },
        [properties.open],
    );

    // Extract the specific values we need for the effect
    // With cache: false, we still get refresh() since it's a query, not a mutation
    const authenticationData = accountAuthenticationQuery.data;
    const refreshAuthentication = accountAuthenticationQuery.refresh;
    const onAuthenticated = properties.onAuthenticated;
    const onOpenChange = properties.onOpenChange;

    // Effect to check authentication when dialog opens
    // This runs when the dialog opens to determine if the user needs to authenticate
    // or if they can proceed directly (if they recently authenticated)
    React.useEffect(
        function () {
            // Only check auth if dialog is open and we haven't checked yet
            if(open && !hasCheckedAuthentication && !checkingAuthentication) {
                setCheckingAuthentication(true);
                setHasCheckedAuthentication(true);

                // Execute the authentication check with refresh to bypass cache
                refreshAuthentication();

                // Wait a bit for the refresh to complete
                setTimeout(function () {
                    // Don't proceed if dialog was closed while checking
                    // This prevents race conditions where the user closes the dialog
                    // before the auth check completes
                    if(!shouldProceed) {
                        setCheckingAuthentication(false);
                        return;
                    }

                    const currentAuthData = authenticationData?.accountAuthentication;
                    if(
                        currentAuthData?.status === AuthenticationSessionStatus.Authenticated &&
                        currentAuthData?.scopeType === 'AccountMaintenance'
                    ) {
                        // User is already authenticated for account maintenance
                        // This happens when they recently completed authentication
                        setIsAuthenticated(true);
                        // Small delay to show the success state for better UX
                        setTimeout(function () {
                            // Check again if we should still proceed
                            if(shouldProceed) {
                                onAuthenticated();
                                setOpen(false);
                                onOpenChange?.(false);
                            }
                        }, 500);
                    }
                    // Always stop checking auth after we've checked
                    setCheckingAuthentication(false);
                }, 100);
            }
        },
        [
            open,
            hasCheckedAuthentication,
            checkingAuthentication,
            shouldProceed,
            authenticationData,
            refreshAuthentication,
            onAuthenticated,
            onOpenChange,
        ],
    );

    // Function to intercept the onOpenChange event
    function onOpenChangeIntercept(open: boolean) {
        // Mark that we should not proceed if closing
        if(!open) {
            setShouldProceed(false);
        }

        // Optionally call the onOpenChange callback
        properties.onOpenChange?.(open);

        // Update the open state
        setOpen(open);
    }

    // Render the component
    let content;

    if(checkingAuthentication || isAuthenticated) {
        // Show loading state while checking authentication or when already authenticated (before closing)
        content = (
            <div className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                    <LoadingAnimation className="h-12 w-12" />
                </div>
                <h2 className="mb-2 text-lg font-semibold">Verifying Identity</h2>
                <p className="text-sm content--1">
                    {isAuthenticated
                        ? 'Identity verified. Processing your request...'
                        : 'Checking authentication status...'}
                </p>
            </div>
        );
    }
    else {
        // Show the authentication form only if not checking and not authenticated
        content = (
            <div className="p-6">
                {shouldProceed ? (
                    <AccountAuthenticatedSession
                        scopeType={AccountSessionScopeType.AccountMaintenance}
                        title="Verify Identity"
                        description={`To ${properties.actionText}, please verify your identity for security purposes.`}
                        buttonText="Continue"
                        onAuthenticated={properties.onAuthenticated}
                    >
                        {/* This will be shown after authentication completes */}
                        <div className="text-center">
                            <div className="mb-4 flex justify-center">
                                <LoadingAnimation className="h-12 w-12" />
                            </div>
                            <h2 className="mb-2 text-lg font-semibold">Authentication Successful</h2>
                            <p className="text-sm content--1">Processing your request...</p>
                        </div>
                    </AccountAuthenticatedSession>
                ) : (
                    // Dialog is closing, show empty content to prevent flash
                    <div />
                )}
            </div>
        );
    }

    return (
        <Dialog
            variant="A"
            className="max-w-md"
            accessibilityTitle="Verify Identity"
            accessibilityDescription="Verify your identity to perform this sensitive account operation"
            {...properties}
            // Spread these properties after all properties to ensure they are not overwritten
            open={open}
            onOpenChange={onOpenChangeIntercept}
            body={content}
        />
    );
}
