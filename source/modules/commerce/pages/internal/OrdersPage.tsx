'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';
import { useUrlSearchParameters } from '@structure/source/utilities/next/NextNavigation';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';
import { Pagination } from '@structure/source/common/navigation/Pagination';
import { PlaceholderAnimation } from '@structure/source/common/animations/PlaceholderAnimation';

// Dependencies - API
import { useQuery } from '@apollo/client';
import { CommerceOrdersAdminDocument, OrderByDirection } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Utilities
import { timeAgo, dayNameWithFullDate } from '@structure/source/utilities/Time';

// Component - OrdersPage
export function OrdersPage() {
    // Hooks and State
    const urlSearchParameters = useUrlSearchParameters();
    const page = parseInt(urlSearchParameters.get('page') as string) || 1;
    const itemsPerPage = 10;
    const [totalOrders, setTotalOrders] = React.useState<number>(0);

    // Query
    const ordersQueryState = useQuery(CommerceOrdersAdminDocument, {
        variables: {
            orderBy: {
                key: 'createdAt',
                direction: OrderByDirection.Descending,
            },
            pagination: {
                itemsPerPage: itemsPerPage,
                itemIndex: (page - 1) * itemsPerPage,
            },
        },
    });

    // Effects
    React.useEffect(
        function () {
            if(ordersQueryState.data?.commerceOrdersAdmin.pagination?.itemsTotal) {
                setTotalOrders(ordersQueryState.data.commerceOrdersAdmin.pagination.itemsTotal);
            }
        },
        [ordersQueryState.data?.commerceOrdersAdmin.pagination?.itemsTotal],
    );

    // Functions
    function formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }

    // Render the component
    return (
        <div className="px-6 py-4">
            {/* Header */}
            <InternalNavigationTrail />
            <h1 className="mb-6">Orders</h1>

            {/* Content */}
            <div className="divide-y divide-neutral/10">
                {/* Loading and Error States */}
                {ordersQueryState.loading && (
                    <div className="divide-y divide-neutral/10">
                        {[...Array(itemsPerPage)].map((_, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-[1fr] items-center gap-3 py-2 md:grid-cols-[200px_200px_120px_120px]"
                            >
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
                                <PlaceholderAnimation className="hidden h-5 w-40 md:block" />
                            </div>
                        ))}
                    </div>
                )}
                {ordersQueryState.error && <div>Error: {ordersQueryState.error.message}</div>}

                {/* Orders List */}
                {ordersQueryState.data?.commerceOrdersAdmin.items && (
                    <>
                        {/* Header Row */}
                        <div className="hidden grid-cols-[200px_200px_120px_120px] items-center gap-3 py-2 font-medium md:grid">
                            <div>Order ID</div>
                            <div>Email</div>
                            <div>Status</div>
                            <div>Amount</div>
                        </div>

                        {ordersQueryState.data.commerceOrdersAdmin.items.map((order) => (
                            <div
                                key={order.id}
                                className="grid grid-cols-[1fr] items-center gap-3 py-2 md:grid-cols-[200px_200px_120px_120px_400px]"
                            >
                                {/* Mobile View */}
                                <div className="md:hidden">
                                    <div className="font-medium">{order.identifier}</div>
                                    <div className="neutral text-sm">{order.emailAddress}</div>
                                    <div className="neutral text-sm">{order.status}</div>
                                    <div className="neutral text-sm">
                                        {order.priceInfo && formatCurrency(order.priceInfo.amount)}
                                    </div>
                                    <div className="mt-1 text-xs text-gray-500">
                                        dayNameWithFullDate(new Date(order.createdAt)) (
                                        {timeAgo(new Date(order.createdAt).getTime())})
                                    </div>
                                </div>

                                {/* Desktop View */}
                                <div className="hidden truncate md:block">
                                    <Link href={`/internal/orders/${order.identifier}`} className="hover:underline">
                                        {order.identifier}
                                    </Link>
                                </div>
                                <div className="neutral hidden truncate md:block">{order.emailAddress}</div>
                                <div className="neutral hidden truncate md:block">{order.status}</div>
                                <div className="neutral hidden truncate md:block">
                                    {order.priceInfo && formatCurrency(order.priceInfo.amount)}
                                </div>
                                <div className="neutral hidden truncate md:block">
                                    {dayNameWithFullDate(new Date(order.createdAt))} (
                                    {timeAgo(new Date(order.createdAt).getTime())})
                                </div>
                            </div>
                        ))}
                    </>
                )}

                {/* Pagination */}
                {(ordersQueryState.loading || ordersQueryState.data) && (
                    <div className="flex items-center space-x-4 pt-6">
                        <Pagination
                            className="justify-start"
                            page={page}
                            itemsPerPage={itemsPerPage}
                            itemsTotal={totalOrders}
                            pagesTotal={Math.ceil(totalOrders / itemsPerPage)}
                            useLinks={true}
                            itemsPerPageControl={false}
                            pageInputControl={false}
                        />
                        {/* Total Items */}
                        {totalOrders !== 0 && <div>{totalOrders} orders</div>}
                    </div>
                )}
            </div>
        </div>
    );
}

// Export - Default
export default OrdersPage;