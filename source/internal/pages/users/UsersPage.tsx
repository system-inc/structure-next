'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUrlSearchParameters } from '@structure/source/utilities/next/NextNavigation';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';
import { Pagination } from '@structure/source/common/navigation/Pagination';
import { PlaceholderAnimation } from '@structure/source/common/animations/PlaceholderAnimation';

// Dependencies - API
import { useQuery } from '@apollo/client';
import { AccountsAdminDocument } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets
import BrokenCircleIcon from '@structure/assets/icons/animations/BrokenCircleIcon.svg';

// Component - UsersPage
export function UsersPage() {
    // Hooks
    const urlSearchParameters = useUrlSearchParameters();
    const page = parseInt(urlSearchParameters.get('page') as string) || 1;
    const itemsPerPage = 10;

    // Query
    const usersQueryState = useQuery(AccountsAdminDocument, {
        variables: {
            pagination: {
                itemsPerPage: itemsPerPage,
                itemIndex: (page - 1) * itemsPerPage,
            },
        },
    });

    // Render the component
    return (
        <div className="px-6 py-4">
            <InternalNavigationTrail />

            <h1 className="mb-6">Users</h1>

            {/* Loading */}
            {usersQueryState.loading && (
                <div className="divide-y divide-neutral/10">
                    {[...Array(itemsPerPage)].map((_, index) => (
                        <div key={index} className="grid grid-cols-[40px_160px_160px_1fr] items-center gap-3 py-2">
                            {/* Avatar Placeholder */}
                            <PlaceholderAnimation className="h-8 w-8 rounded-full" />

                            {/* Info Placeholders */}
                            <PlaceholderAnimation className="h-5 w-40" />
                            <PlaceholderAnimation className="h-5 w-40" />
                            <PlaceholderAnimation className="h-5 w-40" />
                        </div>
                    ))}
                </div>
            )}

            {/* Error */}
            {usersQueryState.error && <div>Error: {usersQueryState.error.message}</div>}

            {/* Users List */}
            {usersQueryState.data?.accountsAdmin.items && (
                <div className="divide-y divide-neutral/10">
                    {usersQueryState.data.accountsAdmin.items.map((account) => (
                        <div
                            key={account.emailAddress}
                            className="grid grid-cols-[40px_160px_160px_1fr] items-center gap-3 py-2"
                        >
                            {/* User Avatar or Placeholder */}
                            {account.profiles[0]?.username ? (
                                <Link
                                    href={`/profiles/${account.profiles[0].username}`}
                                    target="_blank"
                                    className="relative h-8 w-8"
                                >
                                    {account.profiles[0]?.imageUrls && account.profiles[0].imageUrls[0]?.url ? (
                                        <Image
                                            src={account.profiles[0].imageUrls[0]?.url}
                                            alt={account.profiles[0].displayName || ''}
                                            className="h-full w-full rounded-full object-cover"
                                            fill={true}
                                        />
                                    ) : (
                                        <div className="h-full w-full rounded-full bg-neutral/10" />
                                    )}
                                </Link>
                            ) : (
                                <div className="relative h-8 w-8">
                                    <div className="h-full w-full rounded-full bg-neutral/10" />
                                </div>
                            )}

                            {/* Display Name */}
                            <div className="truncate">
                                {account.profiles[0]?.username ? (
                                    <Link
                                        href={`/profiles/${account.profiles[0].username}`}
                                        target="_blank"
                                        className="hover:underline"
                                    >
                                        {account.profiles[0]?.displayName || 'No Display Name'}
                                    </Link>
                                ) : (
                                    account.profiles[0]?.displayName || 'No Display Name'
                                )}
                            </div>

                            {/* Username */}
                            <div className="neutral truncate text-sm">
                                {account.profiles[0]?.username && `@${account.profiles[0].username}`}
                            </div>

                            {/* Email */}
                            <div className="neutral truncate text-sm">{account.emailAddress}</div>
                        </div>
                    ))}

                    {/* Pagination */}
                    <div className="flex items-center space-x-4 pt-6">
                        <Pagination
                            className="justify-start"
                            page={page}
                            itemsPerPage={itemsPerPage}
                            itemsTotal={usersQueryState.data.accountsAdmin.pagination?.itemsTotal ?? 0}
                            pagesTotal={usersQueryState.data.accountsAdmin.pagination?.pagesTotal ?? 0}
                            useLinks={true}
                            itemsPerPageControl={false}
                            pageInputControl={false}
                        />
                        {/* Total Items */}
                        <div>{usersQueryState.data.accountsAdmin.pagination?.itemsTotal ?? 0} users</div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Export - Default
export default UsersPage;
