'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { useQuery } from '@apollo/client';

// Dependencies - Animation
// import LoadingAnimation from '@structure/source/common/animations/LoadingAnimation';

// Dependencies - GraphQL
import { GetMyOrdersDocument } from '@project/source/api/graphql';

// Metadata
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'Orders',
    };
}

// Component - OrdersPage
export function OrdersPage() {
    const { data, loading } = useQuery(GetMyOrdersDocument);

    const orderData = data?.commerceOrders.items;

    // Render the component
    return (
        <>
            <div>
                <h1 className="mb-8">My Orders</h1>
                {loading ? (
                    // Loading
                    <SkeletonLoader />
                ) : (
                    <>
                        {/* List out all the orders */}
                        {orderData?.map((order) => (
                            <div key={order.id} className="mb-4 rounded-md border p-4">
                                <Link href={`/order/${order.identifier}`} className="hover:underline">
                                    <h2 className="text-xl font-semibold">Order #{order.identifier}</h2>
                                </Link>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <span className="rounded-full bg-light-2 px-2 py-1 text-xs font-semibold">
                                        Status: {order.status}
                                    </span>
                                    <span className="rounded-full bg-light-2 px-2 py-1 text-xs font-semibold text-dark-3">
                                        Created: {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm font-medium text-muted-foreground">
                                    Total: ${Number(order.priceInfo?.amount).toFixed(2)}
                                </p>
                            </div>
                        ))}

                        {orderData?.length === 0 && <p>You haven&apos;t placed any orders yet.</p>}
                    </>
                )}
            </div>
        </>
    );
}

// Export - Default
export default OrdersPage;

// Component - SkeletonLoader
function SkeletonLoader() {
    return (
        <>
            {[...Array(3)].map((_, index) => (
                <div key={index} className="mb-4 animate-pulse rounded-md border p-4">
                    <div className="mb-2 h-6 w-3/4 rounded bg-light-2"></div>
                    <div className="mt-2 flex flex-wrap gap-2">
                        <div className="h-4 w-24 rounded-full bg-light-2"></div>
                        <div className="h-4 w-36 rounded-full bg-light-2"></div>
                    </div>
                    <div className="mt-2 h-4 w-1/4 rounded bg-light-2"></div>
                </div>
            ))}
        </>
    );
}
