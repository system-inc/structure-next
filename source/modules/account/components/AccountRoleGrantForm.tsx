'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Button } from '@structure/source/components/buttons/Button';
import { AnimatedButton } from '@structure/source/components/buttons/AnimatedButton';
import { Dialog } from '@structure/source/components/dialogs/Dialog';
import { Notice } from '@structure/source/components/notices/Notice';
import { InputText } from '@structure/source/components/forms/InputText';
import { InputSelect } from '@structure/source/components/forms/InputSelect';
import { ProfileImage } from '@structure/source/modules/account/components/ProfileImage';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';

// Dependencies - Utilities
import { isEmailAddress } from '@structure/source/utilities/validation/Validation';
import { useDebounce } from '@structure/source/utilities/react/React';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';

// Role Information Map
const RoleInformation = {
    Administrator: 'Full access to all features and user management.',
    Moderator: 'Can moderate content and manage basic user actions.',
    User: 'Standard user access to basic features.',
    // Add more roles as needed
};

// Component - AccountRoleGrantForm
export function AccountRoleGrantForm(properties: { onRoleGranted?: () => void }) {
    // State
    const [emailInput, setEmailInput] = React.useState('');
    const [emailError, setEmailError] = React.useState('');
    const [selectedUsername, setSelectedUsername] = React.useState('');
    const [selectedRoleType, setSelectedRoleType] = React.useState('');
    const [grantDialogOpen, setGrantDialogOpen] = React.useState(false);
    const [grantSuccess, setGrantSuccess] = React.useState<{ username: string; role: string } | null>(null);
    const [isSearching, setIsSearching] = React.useState(false);

    // Debounced email for API calls
    const debouncedEmail = useDebounce(emailInput, 500);

    // Queries and Mutations
    const accountAccessRolesPrivilegedRequest = networkService.useGraphQlQuery(
        gql(`
            query AccountAccessRolesPrivileged {
                accountAccessRolesPrivileged {
                    type
                    description
                }
            }
        `),
    );

    const accountPrivilegedRequest = networkService.useGraphQlQuery(
        gql(`
            query AccountPrivileged($input: AccountInput!) {
                accountPrivileged(input: $input) {
                    profiles {
                        username
                        displayName
                        images {
                            url
                            variant
                        }
                    }
                }
            }
        `),
        {
            input: {
                emailAddress: debouncedEmail,
            },
        },
        {
            enabled: Boolean(debouncedEmail && isEmailAddress(debouncedEmail)),
        },
    );

    const accountAccessRoleAssignmentCreatePrivilegedRequest = networkService.useGraphQlMutation(
        gql(`
            mutation AccountAccessRoleAssignmentCreatePrivileged($input: AccessRoleAssignmentCreateInput!) {
                accountAccessRoleAssignmentCreatePrivileged(input: $input) {
                    id
                    accessRole {
                        id
                        type
                        description
                    }
                    status
                    profile {
                        username
                        displayName
                        images {
                            url
                            variant
                        }
                        createdAt
                    }
                    expiresAt
                    createdAt
                    updatedAt
                }
            }
        `),
    );

    // Effect to handle email validation
    React.useEffect(
        function () {
            if(emailInput && !isEmailAddress(emailInput)) {
                setEmailError('Please enter a valid email address');
            }
            else {
                setEmailError('');
            }
        },
        [emailInput],
    );

    // Effect to set searching state
    React.useEffect(
        function () {
            setIsSearching(
                debouncedEmail === emailInput &&
                    !!emailInput &&
                    isEmailAddress(emailInput) &&
                    accountPrivilegedRequest.isLoading,
            );
        },
        [debouncedEmail, emailInput, accountPrivilegedRequest.isLoading],
    );

    // Function to handle role grant confirmation
    async function handleGrantConfirm() {
        try {
            const result = await accountAccessRoleAssignmentCreatePrivilegedRequest.execute({
                input: {
                    username: selectedUsername,
                    emailAddress: emailInput,
                    accessRole: selectedRoleType,
                },
            });

            if(result?.accountAccessRoleAssignmentCreatePrivileged) {
                setGrantSuccess({ username: selectedUsername, role: selectedRoleType });
                setGrantDialogOpen(false);
                properties.onRoleGranted?.();

                // Reset success message after 5 seconds
                setTimeout(() => setGrantSuccess(null), 5000);
            }
        } catch {
            // Error is handled in the dialog via mutation error state
        }
    }

    // Render the component
    return (
        <section className="space-y-4">
            <h2 className="text-base font-medium">Grant Role</h2>

            {/* Success Message */}
            {grantSuccess && (
                <Notice
                    variant="Positive"
                    title={`Successfully granted ${grantSuccess.role} role to @${grantSuccess.username}`}
                    className="mb-4"
                />
            )}

            {/* Email Input */}
            <div className="space-y-2">
                <InputText
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    defaultValue={emailInput}
                    onChange={(value) => setEmailInput(value || '')}
                />
                {emailError && <p className="text-sm text-red-500">{emailError}</p>}
            </div>

            {/* Loading State */}
            {isSearching && (
                <div className="flex items-center space-x-2 content--2">
                    <BrokenCircleIcon className="h-4 w-4 animate-spin" />
                    <span>Searching...</span>
                </div>
            )}

            {/* Error State */}
            {accountPrivilegedRequest.error && (
                <Notice variant="Negative" title={accountPrivilegedRequest.error.message} />
            )}

            {/* Empty State */}
            {!accountPrivilegedRequest.isLoading &&
                !accountPrivilegedRequest.error &&
                debouncedEmail &&
                accountPrivilegedRequest.data?.accountPrivileged?.profiles.length === 0 && (
                    <Notice variant="Warning" title="No user found">
                        We couldn&apos;t find any user with this email address.
                    </Notice>
                )}

            {/* User Preview and Role Selection */}
            {accountPrivilegedRequest.data?.accountPrivileged?.profiles.map(function (profile) {
                return (
                    <div key={profile.username} className="space-y-4 rounded-lg border border--3 p-4">
                        {/* User Preview */}
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10">
                                <ProfileImage
                                    profileImageUrl={profile.images?.[0]?.url}
                                    alternateText={profile.displayName || ''}
                                    className="h-full w-full rounded-full object-cover"
                                />
                            </div>
                            <div>
                                <div className="font-medium">{profile.displayName || '-'}</div>
                                <div className="text-sm content--2">@{profile.username}</div>
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-2">
                            <InputSelect
                                className="w-full"
                                defaultValue={selectedRoleType}
                                items={
                                    accountAccessRolesPrivilegedRequest.data?.accountAccessRolesPrivileged.map(
                                        function (item) {
                                            return {
                                                value: item.type,
                                            };
                                        },
                                    ) || []
                                }
                                onChange={(value) => setSelectedRoleType(value || '')}
                            />
                            {selectedRoleType && (
                                <p className="text-sm content--2">
                                    {RoleInformation[selectedRoleType as keyof typeof RoleInformation]}
                                </p>
                            )}
                            <Button
                                className="w-full"
                                variant="A"
                                onClick={function () {
                                    setSelectedUsername(profile.username);
                                    setGrantDialogOpen(true);
                                }}
                                disabled={!selectedRoleType}
                            >
                                Grant Role
                            </Button>
                        </div>
                    </div>
                );
            })}

            {/* Grant Role Dialog */}
            <Dialog variant="A" open={grantDialogOpen} onOpenChange={setGrantDialogOpen}>
                <Dialog.Header>Confirm Role Grant</Dialog.Header>
                <Dialog.Content>
                    <>
                        <p>
                            Are you sure you want to grant the <b>{selectedRoleType}</b> role to{' '}
                            <b>@{selectedUsername}</b>?
                        </p>
                        {accountAccessRoleAssignmentCreatePrivilegedRequest.error && (
                            <Notice
                                className="mt-4"
                                variant="Negative"
                                title={accountAccessRoleAssignmentCreatePrivilegedRequest.error.message}
                            />
                        )}
                    </>
                </Dialog.Content>
                <Dialog.Footer>
                    <div className="flex justify-end space-x-2">
                        <Button onClick={() => setGrantDialogOpen(false)}>Cancel</Button>
                        <AnimatedButton
                            onClick={handleGrantConfirm}
                            isProcessing={accountAccessRoleAssignmentCreatePrivilegedRequest.isLoading}
                        >
                            Grant Role
                        </AnimatedButton>
                    </div>
                </Dialog.Footer>
            </Dialog>
        </section>
    );
}
