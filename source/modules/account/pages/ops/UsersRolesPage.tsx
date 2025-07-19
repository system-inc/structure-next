'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Link } from '@structure/source/common/navigation/Link';
import { OpsNavigationTrail } from '@structure/source/ops/layouts/navigation/OpsNavigationTrail';
import { Button } from '@structure/source/common/buttons/Button';
import { Dialog } from '@structure/source/common/dialogs/Dialog';
import { Alert } from '@structure/source/common/notifications/Alert';
import { ProfileImage } from '@structure/source/modules/account/components/ProfileImage';
import { AccountRoleGrantForm } from '@structure/source/modules/account/components/AccountRoleGrantForm';

// Dependencies - Animations
import { PlaceholderAnimation } from '@structure/source/common/animations/PlaceholderAnimation';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import {
    AccessRoleStatus,
    OrderByDirection,
    AccountAccessRoleAssignmentsPrivilegedQuery,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Utilities
import { fullDate } from '@structure/source/utilities/Time';

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
                networkService.invalidateCache(['accountAccessRoleAssignmentsPrivileged']);
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
        return accessRoleAssignments.reduce(
            (
                groups: {
                    [
                        key: string
                    ]: AccountAccessRoleAssignmentsPrivilegedQuery['accountAccessRoleAssignmentsPrivileged']['items'];
                },
                accessRoleAssignment,
            ) => {
                const type = accessRoleAssignment.accessRole.type;
                if(!groups[type]) {
                    groups[type] = [];
                }
                groups[type].push(accessRoleAssignment);
                return groups;
            },
            {},
        );
    }

    // Render
    return (
        <div className="px-6 py-4">
            <OpsNavigationTrail />

            <h1 className="mb-6">Roles</h1>

            <div className="space-y-12">
                {/* Role Granting Form */}
                <AccountRoleGrantForm
                    onRoleGranted={() => networkService.invalidateCache(['accountAccessRoleAssignmentsPrivileged'])}
                />

                {/* Assigned Roles Section */}
                <section>
                    <h2 className="mb-4 text-lg font-medium">Assigned Roles</h2>

                    {/* Loading State */}
                    {accountAccessRoleAssignmentsPrivilegedRequest.isLoading && (
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
                                                        className="hover:text-blue-500 font-medium"
                                                    >
                                                        {role.profile?.displayName || role.profile?.username}
                                                    </Link>
                                                    <div className="text-neutral-500 text-sm">
                                                        @{role.profile?.username}
                                                    </div>
                                                    <div className="text-neutral-500 text-sm">{role.emailAddress}</div>
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
                                                                type: role.accessRole.type,
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
                                                        className="hover:text-blue-500 font-medium"
                                                    >
                                                        {role.profile?.displayName || role.profile?.username}
                                                    </Link>
                                                    <div className="text-neutral-500 text-sm">
                                                        @{role.profile?.username}
                                                    </div>
                                                    <div className="text-neutral-500 text-sm">{role.emailAddress}</div>
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
                                                            type: role.accessRole.type,
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
                            {accountAccessRoleAssignmentRevokePrivilegedRequest.error && (
                                <Alert
                                    className="mt-4"
                                    variant="error"
                                    title={accountAccessRoleAssignmentRevokePrivilegedRequest.error.message}
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
                                processing={accountAccessRoleAssignmentRevokePrivilegedRequest.isLoading}
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
