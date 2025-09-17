'use client'; // This component uses client-only features

// Dependencies - React
import React from 'react';

// Dependencies - Main Components
import { DialogProperties, Dialog } from '@structure/source/common/dialogs/Dialog';
import { AccountMaintenanceSession } from '@structure/source/modules/account/components/AccountMaintenanceSession';
import { LoadingAnimation } from '@structure/source/common/animations/LoadingAnimation';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import { AuthenticationSessionStatus } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Component - AccountMaintenanceDialog
export interface AccountMaintenanceDialogProperties extends DialogProperties {
    actionText: string;
    onAuthenticated: () => void;
}

export function AccountMaintenanceDialog(properties: AccountMaintenanceDialogProperties) {
    // State
    const [open, setOpen] = React.useState(properties.open ?? false);
    const [checkingAuth, setCheckingAuth] = React.useState(false);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [hasCheckedAuth, setHasCheckedAuth] = React.useState(false);

    // Check current authentication session - using mutation to get fresh data
    const accountAuthenticationCheck = networkService.useGraphQlMutation(
        gql(`
            query AccountAuthentication {
                accountAuthentication {
                    status
                    scopeType
                    currentChallenge {
                        challengeType
                        status
                    }
                }
            }
        `)
    );

    // Effect to handle dialog opening and closing
    React.useEffect(
        function () {
            setOpen(properties.open ?? false);

            // Reset state when dialog closes
            if(!properties.open) {
                setCheckingAuth(false);
                setIsAuthenticated(false);
                setHasCheckedAuth(false);
            }
        },
        [properties.open],
    );

    // Ref to track if we should proceed with auth callback
    const shouldProceedRef = React.useRef(true);

    // Effect to check authentication when dialog opens
    React.useEffect(
        function () {
            // Reset the flag when dialog state changes
            shouldProceedRef.current = open;

            // Only check auth if dialog is open and we haven't checked yet
            if(open && !hasCheckedAuth && !checkingAuth) {
                setCheckingAuth(true);
                setHasCheckedAuth(true);

                // Execute the authentication check
                accountAuthenticationCheck.execute().then(function(result) {
                    // Don't proceed if dialog was closed while checking
                    if(!shouldProceedRef.current) {
                        setCheckingAuth(false);
                        return;
                    }

                    const authData = result?.accountAuthentication;
                    if(
                        authData?.status === AuthenticationSessionStatus.Authenticated &&
                        authData?.scopeType === 'AccountMaintenance'
                    ) {
                        // Already authenticated
                        setIsAuthenticated(true);
                        // Small delay to show the success state
                        setTimeout(function () {
                            // Check again if we should still proceed
                            if(shouldProceedRef.current) {
                                properties.onAuthenticated();
                                setOpen(false);
                                properties.onOpenChange?.(false);
                            }
                        }, 500);
                    }
                    // Always stop checking auth after we've checked
                    setCheckingAuth(false);
                }).catch(function(error) {
                    console.error('Failed to check authentication:', error);
                    setCheckingAuth(false);
                });
            }
        },
        [open, hasCheckedAuth, checkingAuth],
    );

    // Function to intercept the onOpenChange event
    function onOpenChangeIntercept(open: boolean) {
        // Mark that we should not proceed if closing
        if(!open) {
            shouldProceedRef.current = false;
        }

        // Optionally call the onOpenChange callback
        properties.onOpenChange?.(open);

        // Update the open state
        setOpen(open);
    }

    // Render the component
    let content;

    if(checkingAuth || isAuthenticated) {
        // Show loading state while checking authentication or when already authenticated (before closing)
        content = (
            <div className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                    <LoadingAnimation className="h-12 w-12" />
                </div>
                <h2 className="mb-2 text-lg font-semibold">Verifying Identity</h2>
                <p className="text-sm text-foreground-secondary">
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
                <AccountMaintenanceSession
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
                        <p className="text-sm text-foreground-secondary">Processing your request...</p>
                    </div>
                </AccountMaintenanceSession>
            </div>
        );
    }

    return (
        <Dialog
            className="max-w-md"
            accessibilityTitle="Verify Identity"
            content={content}
            {...properties}
            // Spread these properties after all properties to ensure they are not overwritten
            open={open}
            onOpenChange={onOpenChangeIntercept}
        />
    );
}
