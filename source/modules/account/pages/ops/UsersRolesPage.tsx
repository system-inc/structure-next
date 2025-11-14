'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';
import { OpsNavigationTrail } from '@structure/source/ops/layouts/navigation/OpsNavigationTrail';
import { Button } from '@structure/source/components/buttons/Button';
import { AnimatedButton } from '@structure/source/components/buttons/AnimatedButton';
import { Dialog } from '@structure/source/components/dialogs/Dialog';
import { Notice } from '@structure/source/components/notices/Notice';
import { ProfileImage } from '@structure/source/modules/account/components/ProfileImage';
import { AccountRoleGrantForm } from '@structure/source/modules/account/components/AccountRoleGrantForm';
import {
    AccountAuthenticatedSession,
    AccountSessionScopeType,
} from '@structure/source/modules/account/components/AccountAuthenticatedSession';

// Dependencies - Animations
import { PlaceholderAnimation } from '@structure/source/components/animations/PlaceholderAnimation';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import {
    AccessRoleStatus,
    OrderByDirection,
    AccountAccessRoleAssignmentsPrivilegedQuery,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Cache key constants
export const accountAccessRoleAssignmentsPrivilegedCacheKey = 'accountAccessRoleAssignmentsPrivileged';

// Dependencies - Utilities
import { dateFull } from '@structure/source/utilities/time/Time';

// Component - UsersRolesPage
export function UsersRolesPage() {
    // State
    const [revokeDialogOpen, setRevokeDialogOpen] = React.useState(false);
    const [selectedRole, setSelectedRole] = React.useState<{
        id: string;
        type: string;
        username: string;
        emailAddress: string;
    } | null>(null);
    const [revokeSuccess, setRevokeSuccess] = React.useState(false);

    // Hooks
    const accountAccessRoleAssignmentsPrivilegedRequest = networkService.useGraphQlQuery(
        gql(`
            query AccountAccessRoleAssignmentsPrivileged($statuses: [AccessRoleStatus!]!, $pagination: PaginationInput!) {
                accountAccessRoleAssignmentsPrivileged(statuses: $statuses, pagination: $pagination) {
                    items {
                        id
                        accessRole {
                            id
                            type
                            description
                        }
                        status
                        emailAddress
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
                    pagination {
                        itemsTotal
                        itemsPerPage
                        page
                        pagesTotal
                        itemIndex
                        itemIndexForNextPage
                        itemIndexForPreviousPage
                    }
                }
            }
        `),
        {
            statuses: [AccessRoleStatus.Active],
            pagination: {
                itemsPerPage: 25,
                orderBy: [
                    {
                        key: 'createdAt',
                        direction: OrderByDirection.Descending,
                    },
                ],
            },
        },
        {
            cacheKey: [accountAccessRoleAssignmentsPrivilegedCacheKey],
        },
    );

    const accountAccessRoleAssignmentRevokePrivilegedRequest = networkService.useGraphQlMutation(
        gql(`
            mutation AccountAccessRoleAssignmentRevokePrivileged($input: AccessRoleAssignmentRevokeInput!) {
                accountAccessRoleAssignmentRevokePrivileged(input: $input) {
                    success
                }
            }
        `),
    );

    // Function to handle role revocation
    async function handleRevokeConfirm() {
        if(!selectedRole) return;

        try {
            const result = await accountAccessRoleAssignmentRevokePrivilegedRequest.execute({
                input: {
                    accessRole: selectedRole.type,
                    emailAddress: selectedRole.emailAddress,
                    username: selectedRole.username,
                },
            });

            if(result?.accountAccessRoleAssignmentRevokePrivileged.success) {
                setRevokeSuccess(true);
                // Refresh the roles list
                networkService.invalidateCache([accountAccessRoleAssignmentsPrivilegedCacheKey]);
            }
        } catch {
            // Error is handled in the dialog via revokeMutation.error
        }
    }

    // Function to handle dialog close
    function handleDialogClose() {
        setRevokeDialogOpen(false);
        setSelectedRole(null);
        setRevokeSuccess(false);
    }

    // Utility function to group role assignments by type
    function groupAssignmentsByType(
        accessRoleAssignments: AccountAccessRoleAssignmentsPrivilegedQuery['accountAccessRoleAssignmentsPrivileged']['items'],
    ) {
        return accessRoleAssignments.reduce(function (
            groups: {
                [
                    key: string
                ]: AccountAccessRoleAssignmentsPrivilegedQuery['accountAccessRoleAssignmentsPrivileged']['items'];
            },
            accessRoleAssignment,
        ) {
            const type = accessRoleAssignment.accessRole?.type;
            if(type) {
                if(!groups[type]) {
                    groups[type] = [];
                }
                groups[type].push(accessRoleAssignment);
            }
            return groups;
        }, {});
    }

    // Render
    return (
        <div className="px-6 py-4">
            <OpsNavigationTrail />

            <h1 className="mb-6">Roles</h1>

            <div className="space-y-12">
                {/* Role Granting Form */}
                <AccountAuthenticatedSession
                    scopeType={AccountSessionScopeType.AdministratorPrivilege}
                    title="Grant Role"
                    description="To grant roles to users, please verify your administrator privileges."
                    buttonText="Verify Administrator Access"
                >
                    <AccountRoleGrantForm
                        onRoleGranted={function () {
                            networkService.invalidateCache([accountAccessRoleAssignmentsPrivilegedCacheKey]);
                        }}
                    />
                </AccountAuthenticatedSession>

                {/* Assigned Roles Section */}
                <section>
                    <h2 className="mb-4 text-lg font-medium">Assigned Roles</h2>

                    {/* Loading State */}
                    {accountAccessRoleAssignmentsPrivilegedRequest.isLoading && (
                        <div className="divide-y divide-gray-500/10">
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
                    {accountAccessRoleAssignmentsPrivilegedRequest.error && (
                        <div className="mt-4 text-red-500">
                            Error: {accountAccessRoleAssignmentsPrivilegedRequest.error.message}
                        </div>
                    )}

                    {/* Roles List Grouped by Type */}
                    {accountAccessRoleAssignmentsPrivilegedRequest.data?.accountAccessRoleAssignmentsPrivileged && (
                        <div className="space-y-8">
                            {Object.entries(
                                groupAssignmentsByType(
                                    accountAccessRoleAssignmentsPrivilegedRequest.data
                                        .accountAccessRoleAssignmentsPrivileged.items,
                                ),
                            ).map(([type, roles]) => (
                                <div key={type} className="space-y-4">
                                    <h3 className="text-base font-medium content--2">
                                        {type} ({roles.length})
                                    </h3>
                                    <div className="divide-y divide-gray-500/10">
                                        {roles.map((role) => (
                                            <div
                                                key={role.id}
                                                className="grid grid-cols-[40px_1fr] items-center gap-3 py-4 md:grid-cols-[40px_160px_1fr_100px]"
                                            >
                                                {/* Profile Image */}
                                                <div className="relative h-10 w-10">
                                                    <ProfileImage
                                                        profileImageUrl={role.profile?.images?.[0]?.url}
                                                        alternateText={
                                                            role.profile?.displayName || role.profile?.username || ''
                                                        }
                                                        className="h-full w-full rounded-full object-cover"
                                                    />
                                                </div>

                                                {/* Mobile View */}
                                                <div className="md:hidden">
                                                    <Link
                                                        href={`/profiles/${role.profile?.username}`}
                                                        className="font-medium hover:text-blue-500"
                                                    >
                                                        {role.profile?.displayName || role.profile?.username}
                                                    </Link>
                                                    <div className="text-sm content--2">@{role.profile?.username}</div>
                                                    <div className="text-sm content--2">{role.emailAddress}</div>
                                                    <div className="text-sm content--2">
                                                        Added {dateFull(new Date(role.createdAt))}
                                                        {role.expiresAt && (
                                                            <div>Expires {dateFull(new Date(role.expiresAt))}</div>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="Destructive"
                                                        size="Small"
                                                        className="mt-2"
                                                        onClick={function () {
                                                            setSelectedRole({
                                                                id: role.id,
                                                                type: role.accessRole?.type || '',
                                                                emailAddress: role.emailAddress || '',
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
                                                        className="font-medium hover:text-blue-500"
                                                    >
                                                        {role.profile?.displayName || role.profile?.username}
                                                    </Link>
                                                    <div className="text-sm content--2">@{role.profile?.username}</div>
                                                    <div className="text-sm content--2">{role.emailAddress}</div>
                                                </div>

                                                <div className="hidden text-sm content--2 md:block">
                                                    Added {dateFull(new Date(role.createdAt))}
                                                    {role.expiresAt && (
                                                        <div>Expires {dateFull(new Date(role.expiresAt))}</div>
                                                    )}
                                                </div>

                                                <Button
                                                    variant="Destructive"
                                                    size="Small"
                                                    className="hidden md:block"
                                                    onClick={function () {
                                                        setSelectedRole({
                                                            id: role.id,
                                                            type: role.accessRole?.type || '',
                                                            username: role.profile?.username || '',
                                                            emailAddress: role.emailAddress || '',
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
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Revoke Role Dialog */}
            <Dialog variant="A" open={revokeDialogOpen} onOpenChange={handleDialogClose}>
                <Dialog.Header>{revokeSuccess ? 'Role Revoked' : 'Confirm Role Revocation'}</Dialog.Header>
                <Dialog.Content>
                    {revokeSuccess ? (
                        <p>The role has been successfully revoked.</p>
                    ) : (
                        <>
                            <p>
                                Are you sure you want to revoke the <b>{selectedRole?.type}</b> role from{' '}
                                <b>@{selectedRole?.username}</b>?
                            </p>
                            {accountAccessRoleAssignmentRevokePrivilegedRequest.error && (
                                <Notice
                                    className="mt-4"
                                    variant="Negative"
                                    title={accountAccessRoleAssignmentRevokePrivilegedRequest.error.message}
                                />
                            )}
                        </>
                    )}
                </Dialog.Content>
                <Dialog.Footer>
                    {revokeSuccess ? (
                        <Button onClick={handleDialogClose}>Close</Button>
                    ) : (
                        <div className="flex justify-end space-x-2">
                            <Button onClick={handleDialogClose}>Cancel</Button>
                            <AnimatedButton
                                variant="Destructive"
                                onClick={handleRevokeConfirm}
                                isProcessing={accountAccessRoleAssignmentRevokePrivilegedRequest.isLoading}
                            >
                                Revoke Role
                            </AnimatedButton>
                        </div>
                    )}
                </Dialog.Footer>
            </Dialog>
        </div>
    );
}
