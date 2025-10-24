'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { useRouter, useUrlPath, useUrlSearchParameters } from '@structure/source/router/Navigation';

// Dependencies - Main Components
import { Link } from '@structure/source/components/navigation/Link';
import { OpsNavigationTrail } from '@structure/source/ops/layouts/navigation/OpsNavigationTrail';
import { Pagination } from '@structure/source/components/navigation/pagination/Pagination';
import { PlaceholderAnimation } from '@structure/source/components/animations/PlaceholderAnimation';
import { ProfileImage } from '@structure/source/modules/account/components/ProfileImage';
import { Dialog } from '@structure/source/components/dialogs/Dialog';
import { Button } from '@structure/source/components/buttons/Button';
import { AnimatedButton } from '@structure/source/components/buttons/AnimatedButton';
import { Alert } from '@structure/source/components/notifications/Alert';

// Dependencies - API
import { networkService, gql } from '@structure/source/services/network/NetworkService';
import { OrderByDirection } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Cache key constants
export const accountsPrivilegedCacheKey = 'accountsPrivileged';

// Dependencies - Utilities
import { dateIso8601, timeFromNow } from '@structure/source/utilities/time/Time';

// Function to convert a country code to a flag emoji
function countryCodeToFlagEmoji(countryCode?: string | null): string {
    if(!countryCode) return '🌐'; // Globe emoji for unknown country

    // Country codes are two-letter ISO 3166-1 codes
    // Flag emojis are created by converting each letter to regional indicator symbols
    // Each letter is mapped to a Unicode regional indicator symbol (base + letter position)
    const base = 127397; // Regional indicator symbol base (127462 - 65)

    try {
        const letterPair = countryCode.toUpperCase();
        if(letterPair.length !== 2) return '🌐';

        // Convert each letter to regional indicator symbol and join
        return (
            String.fromCodePoint(letterPair.charCodeAt(0) + base) +
            String.fromCodePoint(letterPair.charCodeAt(1) + base)
        );
    } catch {
        return '🌐'; // Fallback to globe emoji
    }
}

// Component - UsersPage
export function UsersPage() {
    // Hooks and State
    const router = useRouter();
    const urlPath = useUrlPath();
    const urlSearchParameters = useUrlSearchParameters();

    // Get pagination parameters from URL
    const page = parseInt(urlSearchParameters?.get('page') as string) || 1;
    const defaultItemsPerPage = 10;
    const itemsPerPage = parseInt(urlSearchParameters?.get('itemsPerPage') as string) || defaultItemsPerPage;

    const [totalUsers, setTotalUsers] = React.useState<number>(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState<{ emailAddress: string; username: string } | null>(null);
    const [deleteSuccess, setDeleteSuccess] = React.useState(false);

    // Query
    const accountsPrivilegedRequest = networkService.useGraphQlQuery(
        gql(`
            query AccountsPrivileged($pagination: PaginationInput!) {
                accountsPrivileged(pagination: $pagination) {
                    items {
                        emailAddress
                        profiles {
                            username
                            displayName
                            givenName
                            familyName
                            countryCode
                            images {
                                url
                                variant
                            }
                            updatedAt
                            createdAt
                        }
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
            pagination: {
                itemsPerPage: itemsPerPage,
                itemIndex: (page - 1) * itemsPerPage,
                orderBy: [
                    {
                        key: 'createdAt',
                        direction: OrderByDirection.Descending,
                    },
                ],
            },
        },
        {
            cacheKey: [accountsPrivilegedCacheKey, page, itemsPerPage],
        },
    );

    // Mutation
    const accountDeletePrivilegedRequest = networkService.useGraphQlMutation(
        gql(`
            mutation AccountDeletePrivileged($input: AccountDeleteInput!) {
                accountDeletePrivileged(input: $input) {
                    success
                }
            }
        `),
    );

    // Effects
    React.useEffect(
        function () {
            if(accountsPrivilegedRequest.data?.accountsPrivileged.pagination?.itemsTotal) {
                setTotalUsers(accountsPrivilegedRequest.data.accountsPrivileged.pagination.itemsTotal);
            }
        },
        [accountsPrivilegedRequest.data?.accountsPrivileged.pagination?.itemsTotal],
    );

    // Function to handle pagination changes
    async function handlePaginationChange(newItemsPerPage: number, newPage: number) {
        // Create new URLSearchParams
        const newUrlSearchParameters = new URLSearchParams(urlSearchParameters?.toString() || '');

        // Update the parameters
        newUrlSearchParameters.set('page', newPage.toString());
        newUrlSearchParameters.set('itemsPerPage', newItemsPerPage.toString());

        // Navigate to the new URL with updated parameters
        router.push(`${urlPath}?${newUrlSearchParameters.toString()}`);
    }

    // Function to handle user deletion
    async function handleDeleteConfirm() {
        if(!selectedUser) return;

        try {
            const result = await accountDeletePrivilegedRequest.execute({
                input: {
                    emailAddress: selectedUser.emailAddress,
                },
            });

            if(result?.accountDeletePrivileged.success) {
                setDeleteSuccess(true);
                // Refresh the users list
                networkService.invalidateCache([accountsPrivilegedCacheKey]);
            }
        } catch {
            // Error is handled in the dialog via mutation.error
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
            <OpsNavigationTrail />
            <h1 className="mb-6">Users</h1>

            {/* Content */}
            <div className="divide-y divide-gray-500/10">
                {/* Loading and Error States */}
                {accountsPrivilegedRequest.isLoading && (
                    <div className="divide-y divide-gray-500/10">
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
                                <PlaceholderAnimation className="hidden h-5 w-40 md:block" />
                                <PlaceholderAnimation className="hidden h-5 w-40 md:block" />
                                <PlaceholderAnimation className="hidden h-5 w-40 md:block" />
                            </div>
                        ))}
                    </div>
                )}
                {accountsPrivilegedRequest.error && <div>Error: {accountsPrivilegedRequest.error.message}</div>}

                {/* Users List */}
                {accountsPrivilegedRequest.data?.accountsPrivileged.items && (
                    <>
                        {accountsPrivilegedRequest.data.accountsPrivileged.items.map(function (account) {
                            return (
                                <div
                                    key={account.emailAddress}
                                    className="grid grid-cols-[40px_1fr] items-center gap-3 py-2 md:grid-cols-[40px_120px_200px_200px_16px_1fr_100px]"
                                >
                                    {/* Use ProfileImage instead of UserAvatar */}
                                    <div className="relative h-8 w-8">
                                        <ProfileImage
                                            profileImageUrl={account.profiles[0]?.images?.[0]?.url}
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
                                                    prefetch={false}
                                                >
                                                    {account.profiles[0]?.displayName || '-'}
                                                </Link>
                                            ) : (
                                                account.profiles[0]?.displayName || '-'
                                            )}
                                        </div>
                                        <div className="truncate text-sm">{account.emailAddress}</div>
                                        <div className="truncate text-sm">
                                            {account.profiles[0]?.username && `@${account.profiles[0].username}`}
                                        </div>
                                        <Button
                                            variant="Destructive"
                                            size="Small"
                                            className="mt-2"
                                            onClick={function () {
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
                                                prefetch={false}
                                            >
                                                {account.profiles[0]?.displayName || '-'}
                                            </Link>
                                        ) : (
                                            account.profiles[0]?.displayName || '-'
                                        )}
                                    </div>
                                    <div className="hidden truncate text-sm md:block">{account.emailAddress}</div>
                                    <div className="hidden truncate text-sm md:block">
                                        {account.profiles[0]?.username && `@${account.profiles[0].username}`}
                                    </div>
                                    <div
                                        className="hidden truncate md:block"
                                        title={account.profiles[0]?.countryCode || 'Unknown'}
                                    >
                                        {countryCodeToFlagEmoji(account.profiles[0]?.countryCode)}
                                    </div>
                                    <div className="hidden truncate text-sm md:block">
                                        {dateIso8601(new Date(account.profiles[0]?.createdAt))} (
                                        {timeFromNow(new Date(account.profiles[0]?.createdAt).getTime(), true)})
                                    </div>
                                    <Button
                                        variant="Destructive"
                                        size="Small"
                                        className="hidden md:block"
                                        onClick={function () {
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
                            );
                        })}
                    </>
                )}

                {/* Pagination */}
                {(accountsPrivilegedRequest.isLoading || accountsPrivilegedRequest.data) && (
                    <div className="flex items-center space-x-4 pt-6">
                        <Pagination
                            className="justify-start"
                            page={page}
                            itemsPerPage={itemsPerPage}
                            itemsTotal={totalUsers}
                            pagesTotal={accountsPrivilegedRequest.data?.accountsPrivileged.pagination?.pagesTotal ?? 0}
                            useLinks={false}
                            itemsPerPageControl={true}
                            pageInputControl={true}
                            onChange={handlePaginationChange}
                        />
                    </div>
                )}
            </div>

            {/* Delete User Dialog */}
            <Dialog
                variant="A"
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
                            {accountDeletePrivilegedRequest.error && (
                                <Alert
                                    className="mt-4"
                                    variant="error"
                                    title={accountDeletePrivilegedRequest.error.message}
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
                            <AnimatedButton
                                variant="Destructive"
                                onClick={handleDeleteConfirm}
                                isProcessing={accountDeletePrivilegedRequest.isLoading}
                            >
                                Delete User
                            </AnimatedButton>
                        </div>
                    )
                }
            />
        </div>
    );
}
