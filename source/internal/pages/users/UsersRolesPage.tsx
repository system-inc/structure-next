'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';
import { Button } from '@structure/source/common/buttons/Button';
import { Dialog } from '@structure/source/common/dialogs/Dialog';
import { Alert } from '@structure/source/common/notifications/Alert';
import { ProfileImage } from '@structure/source/modules/account/ProfileImage';
import { AccountRoleGrantForm } from '@structure/source/modules/account/AccountRoleGrantForm';

// Dependencies - Animations
import { PlaceholderAnimation } from '@structure/source/common/animations/PlaceholderAnimation';

// Dependencies - API
import { useQuery, useMutation } from '@apollo/client';
import { AccountRolesDocument, AccountRoleRevokeDocument } from '@project/source/api/GraphQlGeneratedCode';
import { apolloErrorToMessage } from '@structure/source/api/GraphQlUtilities';

// Dependencies - Utilities
import { fullDate } from '@structure/source/utilities/Time';

// Component - UsersRolesPage
export function UsersRolesPage() {
    // State
    const [revokeDialogOpen, setRevokeDialogOpen] = React.useState(false);
    const [selectedRole, setSelectedRole] = React.useState<{ id: string; type: string; username: string } | null>(null);
    const [revokeSuccess, setRevokeSuccess] = React.useState(false);

    // Hooks
    const assignedRolesQueryState = useQuery(AccountRolesDocument, {
        variables: {
            statuses: ['Active'],
        },
    });
    const [revokeMutation, revokeMutationState] = useMutation(AccountRoleRevokeDocument);

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

    // Function to handle dialog close
    function handleDialogClose() {
        setRevokeDialogOpen(false);
        setSelectedRole(null);
        setRevokeSuccess(false);
    }

    // Utility function to group roles by type
    function groupRolesByType(roles: any[]) {
        return roles.reduce((groups: { [key: string]: any[] }, role) => {
            const type = role.type;
            if(!groups[type]) {
                groups[type] = [];
            }
            groups[type].push(role);
            return groups;
        }, {});
    }

    return (
        <div className="px-6 py-4">
            <InternalNavigationTrail />

            <h1 className="mb-6">Roles</h1>

            <div className="space-y-12">
                {/* Role Granting Form */}
                <AccountRoleGrantForm onRoleGranted={() => assignedRolesQueryState.refetch()} />

                {/* Assigned Roles Section */}
                <section>
                    <h2 className="mb-4 text-lg font-medium">Assigned Roles</h2>

                    {/* Loading State */}
                    {assignedRolesQueryState.loading && (
                        <div className="divide-y divide-neutral/10">
                            {[...Array(5)].map((_, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-[40px_1fr] items-center gap-3 py-2 md:grid-cols-[40px_160px_160px_1fr_100px]"
                                >
                                    <PlaceholderAnimation className="h-10 w-10 rounded-full" />
                                    <PlaceholderAnimation className="h-5 w-40" />
                                    <PlaceholderAnimation className="hidden h-5 w-40 md:block" />
                                    <PlaceholderAnimation className="hidden h-5 w-40 md:block" />
                                    <PlaceholderAnimation className="hidden h-8 w-20 md:block" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Error State */}
                    {assignedRolesQueryState.error && (
                        <div className="mt-4 text-red-500">Error: {assignedRolesQueryState.error.message}</div>
                    )}

                    {/* Roles List Grouped by Type */}
                    {assignedRolesQueryState.data?.accountRoles && (
                        <div className="space-y-8">
                            {Object.entries(groupRolesByType(assignedRolesQueryState.data.accountRoles)).map(
                                ([type, roles]) => (
                                    <div key={type} className="space-y-4">
                                        <h3 className="text-neutral-500 text-base font-medium">
                                            {type} ({roles.length})
                                        </h3>
                                        <div className="divide-y divide-neutral/10">
                                            {roles.map((role) => (
                                                <div
                                                    key={role.id}
                                                    className="grid grid-cols-[40px_1fr] items-center gap-3 py-4 md:grid-cols-[40px_160px_1fr_100px]"
                                                >
                                                    {/* Profile Image */}
                                                    <div className="relative h-10 w-10">
                                                        <ProfileImage
                                                            profileImageUrl={role.profile?.imageUrls?.[0]?.url}
                                                            alternateText={
                                                                role.profile?.displayName ||
                                                                role.profile?.username ||
                                                                ''
                                                            }
                                                            className="h-full w-full rounded-full object-cover"
                                                        />
                                                    </div>

                                                    {/* Mobile View */}
                                                    <div className="md:hidden">
                                                        <Link
                                                            href={`/profiles/${role.profile?.username}`}
                                                            className="hover:text-blue-500 font-medium"
                                                        >
                                                            {role.profile?.displayName || role.profile?.username}
                                                        </Link>
                                                        <div className="text-neutral-500 text-sm">
                                                            @{role.profile?.username}
                                                        </div>
                                                        <div className="text-neutral-500 text-sm">
                                                            Email {role.profile?.emailAddress}
                                                        </div>
                                                        <div className="text-neutral-500 text-sm">
                                                            Added {fullDate(new Date(role.createdAt))}
                                                            {role.expiresAt && (
                                                                <div>Expires {fullDate(new Date(role.expiresAt))}</div>
                                                            )}
                                                        </div>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            className="mt-2"
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
                                                    </div>

                                                    {/* Desktop View */}
                                                    <div className="hidden md:block">
                                                        <Link
                                                            href={`/profiles/${role.profile?.username}`}
                                                            className="hover:text-blue-500 font-medium"
                                                        >
                                                            {role.profile?.displayName || role.profile?.username}
                                                        </Link>
                                                        <div className="text-neutral-500 text-sm">
                                                            @{role.profile?.username}
                                                        </div>
                                                        <div className="text-neutral-500 text-sm">
                                                            Email {role.profile?.emailAddress}
                                                        </div>
                                                    </div>

                                                    <div className="text-neutral-500 hidden text-sm md:block">
                                                        Added {fullDate(new Date(role.createdAt))}
                                                        {role.expiresAt && (
                                                            <div>Expires {fullDate(new Date(role.expiresAt))}</div>
                                                        )}
                                                    </div>

                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="hidden md:block"
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
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
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
        </div>
    );
}

// Export - Default
export default UsersRolesPage;
