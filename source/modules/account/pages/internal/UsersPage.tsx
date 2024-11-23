'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';
import { useUrlSearchParameters } from '@structure/source/utilities/next/NextNavigation';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';
import { Pagination } from '@structure/source/common/navigation/Pagination';
import { PlaceholderAnimation } from '@structure/source/common/animations/PlaceholderAnimation';
import { ProfileImage } from '@structure/source/modules/account/components/ProfileImage';
import { Dialog } from '@structure/source/common/dialogs/Dialog';
import { Button } from '@structure/source/common/buttons/Button';
import { Alert } from '@structure/source/common/notifications/Alert';

// Dependencies - API
import { useQuery, useMutation } from '@apollo/client';
import { AccountsAdminDocument, AccountDeleteAdminDocument } from '@project/source/api/GraphQlGeneratedCode';
import { apolloErrorToMessage } from '@structure/source/api/GraphQlUtilities';

// Component - UsersPage
export function UsersPage() {
    // Hooks and State
    const urlSearchParameters = useUrlSearchParameters();
    const page = parseInt(urlSearchParameters.get('page') as string) || 1;
    const itemsPerPage = 10;
    const [totalUsers, setTotalUsers] = React.useState<number>(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState<{ emailAddress: string; username: string } | null>(null);
    const [deleteSuccess, setDeleteSuccess] = React.useState(false);

    // Query
    const usersQueryState = useQuery(AccountsAdminDocument, {
        variables: {
            pagination: {
                itemsPerPage: itemsPerPage,
                itemIndex: (page - 1) * itemsPerPage,
            },
        },
    });

    // Mutation
    const [deleteMutation, deleteMutationState] = useMutation(AccountDeleteAdminDocument);

    // Effects
    React.useEffect(
        function () {
            if(usersQueryState.data?.accountsAdmin.pagination?.itemsTotal) {
                setTotalUsers(usersQueryState.data.accountsAdmin.pagination.itemsTotal);
            }
        },
        [usersQueryState.data?.accountsAdmin.pagination?.itemsTotal],
    );

    // Function to handle user deletion
    async function handleDeleteConfirm() {
        if(!selectedUser) return;

        try {
            const result = await deleteMutation({
                variables: {
                    emailAddress: selectedUser.emailAddress,
                },
            });

            if(result.data?.accountDeleteAdmin.success) {
                setDeleteSuccess(true);
                // Refresh the users list
                await usersQueryState.refetch();
            }
        }
        catch(error) {
            // Error is handled in the dialog via deleteMutationState.error
        }
    }

    // Function to handle dialog close
    function handleDialogClose() {
        setDeleteDialogOpen(false);
        setSelectedUser(null);
        setDeleteSuccess(false);
    }

    // Render the component
    return (
        <div className="px-6 py-4">
            {/* Header */}
            <InternalNavigationTrail />
            <h1 className="mb-6">Users</h1>

            {/* Content */}
            <div className="divide-y divide-neutral/10">
                {/* Loading and Error States */}
                {usersQueryState.loading && (
                    <div className="divide-y divide-neutral/10">
                        {[...Array(itemsPerPage)].map((_, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-[40px_1fr] items-center gap-3 py-2 md:grid-cols-[40px_160px_160px_1fr]"
                            >
                                {/* Avatar Placeholder */}
                                <PlaceholderAnimation className="h-8 w-8 rounded-full" />

                                {/* Mobile: Stacked Info Placeholders */}
                                <div className="flex flex-col space-y-2 md:hidden">
                                    <PlaceholderAnimation className="h-5 w-40" />
                                    <PlaceholderAnimation className="h-3.5 w-40" />
                                    <PlaceholderAnimation className="h-3.5 w-40" />
                                </div>

                                {/* Desktop: Column Info Placeholders */}
                                <PlaceholderAnimation className="md/block hidden h-5 w-40" />
                                <PlaceholderAnimation className="md/block hidden h-5 w-40" />
                                <PlaceholderAnimation className="md/block hidden h-5 w-40" />
                            </div>
                        ))}
                    </div>
                )}
                {usersQueryState.error && <div>Error: {usersQueryState.error.message}</div>}

                {/* Users List */}
                {usersQueryState.data?.accountsAdmin.items && (
                    <>
                        {usersQueryState.data.accountsAdmin.items.map((account) => (
                            <div
                                key={account.emailAddress}
                                className="grid grid-cols-[40px_1fr] items-center gap-3 py-2 md:grid-cols-[40px_160px_160px_1fr_100px]"
                            >
                                {/* Use ProfileImage instead of UserAvatar */}
                                <div className="relative h-8 w-8">
                                    <ProfileImage
                                        profileImageUrl={account.profiles[0]?.imageUrls?.[0]?.url}
                                        alternateText={account.profiles[0]?.displayName || ''}
                                        className="h-full w-full rounded-full object-cover"
                                    />
                                </div>

                                {/* Mobile View */}
                                <div className="md:hidden">
                                    <div className="truncate">
                                        {account.profiles[0]?.username ? (
                                            <Link
                                                href={`/profiles/${account.profiles[0].username}`}
                                                target="_blank"
                                                className="hover:underline"
                                            >
                                                {account.profiles[0]?.displayName || '-'}
                                            </Link>
                                        ) : (
                                            account.profiles[0]?.displayName || '-'
                                        )}
                                    </div>
                                    <div className="neutral truncate text-sm">
                                        {account.profiles[0]?.username && `@${account.profiles[0].username}`}
                                    </div>
                                    <div className="neutral truncate text-sm">{account.emailAddress}</div>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="mt-2"
                                        onClick={() => {
                                            setSelectedUser({
                                                emailAddress: account.emailAddress,
                                                username: account.profiles[0]?.username || '',
                                            });
                                            setDeleteDialogOpen(true);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>

                                {/* Desktop View */}
                                <div className="hidden truncate md:block">
                                    {account.profiles[0]?.username ? (
                                        <Link
                                            href={`/profiles/${account.profiles[0].username}`}
                                            target="_blank"
                                            className="hover:underline"
                                        >
                                            {account.profiles[0]?.displayName || '-'}
                                        </Link>
                                    ) : (
                                        account.profiles[0]?.displayName || '-'
                                    )}
                                </div>
                                <div className="neutral hidden truncate text-sm md:block">
                                    {account.profiles[0]?.username && `@${account.profiles[0].username}`}
                                </div>
                                <div className="neutral hidden truncate text-sm md:block">{account.emailAddress}</div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="hidden md:block"
                                    onClick={() => {
                                        setSelectedUser({
                                            emailAddress: account.emailAddress,
                                            username: account.profiles[0]?.username || '',
                                        });
                                        setDeleteDialogOpen(true);
                                    }}
                                >
                                    Delete
                                </Button>
                            </div>
                        ))}
                    </>
                )}

                {/* Pagination */}
                {(usersQueryState.loading || usersQueryState.data) && (
                    <div className="flex items-center space-x-4 pt-6">
                        <Pagination
                            className="justify-start"
                            page={page}
                            itemsPerPage={itemsPerPage}
                            itemsTotal={totalUsers}
                            pagesTotal={usersQueryState.data?.accountsAdmin.pagination?.pagesTotal ?? 0}
                            useLinks={true}
                            itemsPerPageControl={false}
                            pageInputControl={false}
                        />
                        {/* Total Items */}
                        {totalUsers !== 0 && <div>{totalUsers} users</div>}
                    </div>
                )}
            </div>

            {/* Delete User Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onOpenChange={handleDialogClose}
                header={deleteSuccess ? 'User Deleted' : 'Confirm User Deletion'}
                content={
                    deleteSuccess ? (
                        <p>The user has been successfully deleted.</p>
                    ) : (
                        <>
                            <p>
                                Are you sure you want to delete the user <b>@{selectedUser?.username}</b> with email{' '}
                                <b>{selectedUser?.emailAddress}</b>?
                            </p>
                            {deleteMutationState.error && (
                                <Alert
                                    className="mt-4"
                                    variant="error"
                                    title={apolloErrorToMessage(deleteMutationState.error)}
                                />
                            )}
                        </>
                    )
                }
                footer={
                    deleteSuccess ? (
                        <Button onClick={handleDialogClose}>Close</Button>
                    ) : (
                        <div className="flex justify-end space-x-2">
                            <Button onClick={handleDialogClose}>Cancel</Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteConfirm}
                                processing={deleteMutationState.loading}
                            >
                                Delete User
                            </Button>
                        </div>
                    )
                }
            />
        </div>
    );
}

// Export - Default
export default UsersPage;
