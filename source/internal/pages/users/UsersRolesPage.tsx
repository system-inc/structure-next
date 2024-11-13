'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';
import { GraphQlQueryTable } from '@structure/source/common/tables/GraphQlQueryTable';

// Dependencies - Main Components
import { Button } from '@structure/source/common/buttons/Button';
import { Dialog } from '@structure/source/common/dialogs/Dialog';
import { Alert } from '@structure/source/common/notifications/Alert';
import { ProfileImage } from '@structure/source/modules/account/ProfileImage';
import { ProfileLink } from '@structure/source/modules/post/ProfileLink';
import { InputText } from '@structure/source/common/forms/InputText';
import { InputSelect } from '@structure/source/common/forms/InputSelect';

// Dependencies - API
import { useQuery, useMutation } from '@apollo/client';
import {
    AccountAssignableRolesDocument,
    AccountRolesDocument,
    AccountRoleRevokeDocument,
    AccountsAdminDocument,
    AccountByEmailAddressAdminDocument,
    AccountRoleGrantDocument,
} from '@project/source/api/GraphQlGeneratedCode';
import { apolloErrorToMessage } from '@structure/source/api/GraphQlUtilities';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';

// Dependencies - Utilities
import { fullDate } from '@structure/source/utilities/Time';

// Component - UsersRolesPage
export function UsersRolesPage() {
    // State
    const [revokeDialogOpen, setRevokeDialogOpen] = React.useState(false);
    const [selectedRole, setSelectedRole] = React.useState<{ id: string; type: string; username: string } | null>(null);
    const [revokeSuccess, setRevokeSuccess] = React.useState(false);
    const [emailInput, setEmailInput] = React.useState('');
    const [selectedUsername, setSelectedUsername] = React.useState('');
    const [selectedRoleType, setSelectedRoleType] = React.useState('');
    const [grantDialogOpen, setGrantDialogOpen] = React.useState(false);
    const [grantSuccess, setGrantSuccess] = React.useState(false);

    // Hooks
    const assignableRolesQueryState = useQuery(AccountAssignableRolesDocument);
    const assignedRolesQueryState = useQuery(AccountRolesDocument, {
        variables: {
            statuses: ['Active'],
        },
    });
    const [revokeMutation, revokeMutationState] = useMutation(AccountRoleRevokeDocument);
    const accountByEmailQueryState = useQuery(AccountByEmailAddressAdminDocument, {
        variables: { emailAddress: emailInput },
        skip: !emailInput,
    });
    const [grantRoleMutation, grantRoleMutationState] = useMutation(AccountRoleGrantDocument);

    // Function to handle role revocation
    async function handleRevokeConfirm() {
        if(!selectedRole) return;

        try {
            const result = await revokeMutation({
                variables: {
                    roleId: selectedRole.id,
                },
            });

            if(result.data?.accountRoleRevoke.success) {
                setRevokeSuccess(true);
                // Refresh the roles list
                await assignedRolesQueryState.refetch();
            }
        }
        catch(error) {
            // Error is handled in the dialog via revokeMutationState.error
        }
    }

    // Function to handle role grant confirmation
    async function handleGrantConfirm() {
        try {
            const result = await grantRoleMutation({
                variables: {
                    input: {
                        username: selectedUsername,
                        emailAddress: emailInput,
                        type: selectedRoleType,
                    },
                },
            });

            if(result.data?.accountRoleGrant) {
                setGrantSuccess(true);
                // Refresh the roles list
                await assignedRolesQueryState.refetch();
            }
        }
        catch(error) {
            // Error is handled in the dialog via grantRoleMutationState.error
        }
    }

    // Function to handle dialog close
    function handleDialogClose() {
        setRevokeDialogOpen(false);
        setSelectedRole(null);
        setRevokeSuccess(false);
    }

    // Function to handle grant dialog close
    function handleGrantDialogClose() {
        setGrantDialogOpen(false);
        setGrantSuccess(false);
        setSelectedRoleType('');
        setSelectedUsername('');
    }

    return (
        <div className="px-6 py-4">
            <InternalNavigationTrail />

            <h1 className="mb-6">Roles</h1>

            <div className="space-y-12">
                {/* Accounts Section */}
                <section>
                    <h2 className="mb-4 text-base font-medium">Accounts</h2>
                    <GraphQlQueryTable className="mb-6" queryDocument={AccountsAdminDocument} />
                </section>

                {/* Assignable Roles Section */}
                <section>
                    <h2 className="mb-4 text-base font-medium">Assignable Roles</h2>

                    {/* Loading State */}
                    {assignableRolesQueryState.loading && (
                        <div className="mt-4">
                            <BrokenCircleIcon className="h-4 w-4 animate-spin" />
                        </div>
                    )}

                    {/* Error State */}
                    {assignableRolesQueryState.error && (
                        <div className="mt-4 text-red-500">Error: {assignableRolesQueryState.error.message}</div>
                    )}

                    {/* Roles List */}
                    {assignableRolesQueryState.data?.accountAssignableRoles && (
                        <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {assignableRolesQueryState.data.accountAssignableRoles.map((role) => (
                                <li
                                    key={role}
                                    className="border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 rounded-md border px-4 py-3"
                                >
                                    {role}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* Role Granting Section */}
                <section>
                    <h2 className="mb-4 text-base font-medium">Grant Role</h2>

                    {/* Email Input */}
                    <div className="mb-4 flex items-center gap-2">
                        <InputText
                            id="email"
                            type="email"
                            placeholder="Enter email address"
                            defaultValue={emailInput}
                            onChange={(value) => setEmailInput(value || '')}
                        />
                        <Button
                            onClick={() => {
                                accountByEmailQueryState.refetch();
                            }}
                        >
                            Search
                        </Button>
                    </div>

                    {/* Loading State */}
                    {accountByEmailQueryState.loading && (
                        <div className="mt-4">
                            <BrokenCircleIcon className="h-4 w-4 animate-spin" />
                        </div>
                    )}

                    {/* Error State */}
                    {accountByEmailQueryState.error && (
                        <div className="mt-4 text-red-500">Error: {accountByEmailQueryState.error.message}</div>
                    )}

                    {/* Usernames and Role Selection */}
                    {accountByEmailQueryState.data?.accountByEmailAddressAdmin && (
                        <div className="mt-4 space-y-4">
                            {accountByEmailQueryState.data.accountByEmailAddressAdmin.profiles.map((profile) => (
                                <div key={profile.username} className="flex items-center gap-4">
                                    {/* <ProfileImage
                                        src={profile.imageUrls?.[0]?.url}
                                        alt={profile.displayName || profile.username}
                                        className="h-10 w-10"
                                    /> */}
                                    {/* <ProfileLink username={profile.username} displayName={profile.displayName} /> */}
                                    <InputSelect
                                        className="w-48"
                                        defaultValue={selectedRoleType}
                                        items={
                                            assignableRolesQueryState.data?.accountAssignableRoles.map(function (item) {
                                                return {
                                                    value: item,
                                                };
                                            }) || []
                                        }
                                        onChange={(value) => setSelectedRoleType(value || '')}
                                    />
                                    <Button
                                        onClick={() => {
                                            setSelectedUsername(profile.username);
                                            setGrantDialogOpen(true);
                                        }}
                                        disabled={!selectedRoleType}
                                    >
                                        Grant
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Assigned Roles Section */}
                <section>
                    <h2 className="mb-4 text-base font-medium">Assigned Roles</h2>

                    {/* Loading State */}
                    {assignedRolesQueryState.loading && (
                        <div className="mt-4">
                            <BrokenCircleIcon className="h-4 w-4 animate-spin" />
                        </div>
                    )}

                    {/* Error State */}
                    {assignedRolesQueryState.error && (
                        <div className="mt-4 text-red-500">Error: {assignedRolesQueryState.error.message}</div>
                    )}

                    {/* Roles List */}
                    {assignedRolesQueryState.data?.accountRoles && (
                        <ul className="divide-neutral-200 dark:divide-neutral-800 mt-4 divide-y">
                            {assignedRolesQueryState.data.accountRoles.map((role) => (
                                <li key={role.id} className="flex items-center gap-4 py-4">
                                    {/* Profile Image */}
                                    {role.profile?.imageUrls?.[0]?.url ? (
                                        <Image
                                            src={role.profile.imageUrls[0].url}
                                            alt={role.profile.displayName || role.profile.username}
                                            width={40}
                                            height={40}
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="bg-neutral-200 dark:bg-neutral-800 h-10 w-10 rounded-full" />
                                    )}

                                    {/* User Info */}
                                    <div className="flex-grow">
                                        <Link
                                            href={`/profiles/${role.profile?.username}`}
                                            className="hover:text-blue-500 font-medium"
                                        >
                                            {role.profile?.displayName
                                                ? `${role.profile.displayName} (@${role.profile.username})`
                                                : role.profile?.username}
                                        </Link>
                                        <div className="text-neutral-500 mt-1 flex items-center gap-2 text-sm">
                                            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full px-2 py-0.5 text-xs font-medium">
                                                {role.type}
                                            </span>
                                            {role.expiresAt && (
                                                <span className="text-xs">
                                                    Expires {fullDate(new Date(role.expiresAt))}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="text-neutral-500 text-sm">
                                        {role.status} &bull; Added {fullDate(new Date(role.createdAt))}
                                    </div>

                                    {/* Actions */}
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            setSelectedRole({
                                                id: role.id,
                                                type: role.type,
                                                username: role.profile?.username || '',
                                            });
                                            setRevokeDialogOpen(true);
                                        }}
                                    >
                                        Revoke
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>

            {/* Revoke Role Dialog */}
            <Dialog
                open={revokeDialogOpen}
                onOpenChange={handleDialogClose}
                header={revokeSuccess ? 'Role Revoked' : 'Confirm Role Revocation'}
                content={
                    revokeSuccess ? (
                        <p>The role has been successfully revoked.</p>
                    ) : (
                        <>
                            <p>
                                Are you sure you want to revoke the <b>{selectedRole?.type}</b> role from{' '}
                                <b>@{selectedRole?.username}</b>?
                            </p>
                            {revokeMutationState.error && (
                                <Alert
                                    className="mt-4"
                                    variant="error"
                                    title={apolloErrorToMessage(revokeMutationState.error)}
                                />
                            )}
                        </>
                    )
                }
                footer={
                    revokeSuccess ? (
                        <Button onClick={handleDialogClose}>Close</Button>
                    ) : (
                        <div className="flex justify-end space-x-2">
                            <Button onClick={handleDialogClose}>Cancel</Button>
                            <Button
                                variant="destructive"
                                onClick={handleRevokeConfirm}
                                processing={revokeMutationState.loading}
                            >
                                Revoke Role
                            </Button>
                        </div>
                    )
                }
            />

            {/* Grant Role Dialog */}
            <Dialog
                open={grantDialogOpen}
                onOpenChange={handleGrantDialogClose}
                header={grantSuccess ? 'Role Granted' : 'Confirm Role Grant'}
                content={
                    grantSuccess ? (
                        <p>The role has been successfully granted.</p>
                    ) : (
                        <>
                            <p>
                                Are you sure you want to grant the <b>{selectedRoleType}</b> role to{' '}
                                <b>@{selectedUsername}</b>?
                            </p>
                            {grantRoleMutationState.error && (
                                <Alert
                                    className="mt-4"
                                    variant="error"
                                    title={apolloErrorToMessage(grantRoleMutationState.error)}
                                />
                            )}
                        </>
                    )
                }
                footer={
                    grantSuccess ? (
                        <Button onClick={handleGrantDialogClose}>Close</Button>
                    ) : (
                        <div className="flex justify-end space-x-2">
                            <Button onClick={handleGrantDialogClose}>Cancel</Button>
                            <Button onClick={handleGrantConfirm} processing={grantRoleMutationState.loading}>
                                Grant Role
                            </Button>
                        </div>
                    )
                }
            />
        </div>
    );
}

// Export - Default
export default UsersRolesPage;
