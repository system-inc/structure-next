'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import Link from 'next/link';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';
import { PlaceholderAnimation } from '@structure/source/common/animations/PlaceholderAnimation';

// Dependencies - API
import { useQuery } from '@apollo/client';
import { CommerceOrdersAdminDocument, ColumnFilterConditionOperator } from '@project/source/api/GraphQlGeneratedCode';

// Component - OrderPage
interface OrderPageProperties {
    orderId: string;
}

export function OrderPage(properties: OrderPageProperties) {
    // Query
    const orderQueryState = useQuery(CommerceOrdersAdminDocument, {
        variables: {
            pagination: {
                itemsPerPage: 1,
                filters: [
                    {
                        column: 'identifier',
                        operator: ColumnFilterConditionOperator.Equal,
                        value: properties.orderId,
                    },
                ],
            },
        },
    });

    // Functions
    function formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }

    // Render loading state
    if(orderQueryState.loading) {
        return (
            <div className="px-6 py-4">
                <InternalNavigationTrail />
                <div className="space-y-6">
                    <PlaceholderAnimation className="h-8 w-64" />
                    <div className="grid gap-6 md:grid-cols-2">
                        <PlaceholderAnimation className="h-40 w-full rounded-lg" />
                        <PlaceholderAnimation className="h-40 w-full rounded-lg" />
                    </div>
                </div>
            </div>
        );
    }

    // Render error state
    if(orderQueryState.error) {
        return <div className="px-6 py-4">Error: {orderQueryState.error.message}</div>;
    }

    // Get the order from the response
    const order = orderQueryState.data?.commerceOrdersAdmin.items[0];
    if(!order) {
        return <div className="px-6 py-4">Order not found</div>;
    }

    // Render the component
    return (
        <div className="px-6 py-4">
            {/* Header */}
            <InternalNavigationTrail />
            <div className="mb-6 flex items-center justify-between">
                <h1>Order {order.identifier}</h1>
                <div className="text-sm">Created {new Date(order.createdAt).toLocaleDateString()}</div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Order Summary */}
                <div>
                    <h2 className="mb-4 text-lg font-medium">Order Summary</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Status</span>
                            <span className="font-medium">{order.status}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Payment Status</span>
                            <span className="font-medium">{order.paymentStatus}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Fulfillment Status</span>
                            <span className="font-medium">{order.fulfillmentStatus}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total Amount</span>
                            <span className="font-medium">
                                {order.priceInfo && formatCurrency(order.priceInfo.amount)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Customer Information */}
                <div>
                    <h2 className="mb-4 text-lg font-medium">Customer Information</h2>
                    <div className="space-y-4">
                        <div>
                            <div className="font-medium">Email</div>
                            <div>{order.emailAddress}</div>
                            {order.beneficiaryEmailAddress && (
                                <div className="text-neutral-500 mt-1 text-sm">
                                    Beneficiary: {order.beneficiaryEmailAddress}
                                </div>
                            )}
                        </div>
                        {order.shippingInfo?.shippingAddress && (
                            <div>
                                <div className="font-medium">Shipping Address</div>
                                <div>
                                    {order.shippingInfo.shippingAddress.firstName}{' '}
                                    {order.shippingInfo.shippingAddress.lastName}
                                </div>
                                <div>{order.shippingInfo.shippingAddress.line1}</div>
                                {order.shippingInfo.shippingAddress.line2 && (
                                    <div>{order.shippingInfo.shippingAddress.line2}</div>
                                )}
                                <div>
                                    {order.shippingInfo.shippingAddress.city},{' '}
                                    {order.shippingInfo.shippingAddress.state}{' '}
                                    {order.shippingInfo.shippingAddress.postalCode}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Line Items */}
                <div>
                    <h2 className="mb-4 text-lg font-medium">Line Items</h2>
                    <div className="divide-y">
                        {order.lineItems?.map((item) => (
                            <div key={item.id} className="py-3">
                                <div className="flex justify-between">
                                    <span>Item #{item.indexId}</span>
                                    <span className="font-medium">{item.status}</span>
                                </div>
                                <div className="mt-1 text-sm">
                                    <div>Quantity: {item.quantity}</div>
                                    <div>Fulfilled: {item.fulfilledQuantity}</div>
                                    <div>Shipped: {item.shippedQuantity}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Details */}
                {order.payment && (
                    <div>
                        <h2 className="mb-4 text-lg font-medium">Payment Details</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Amount</span>
                                <span>{formatCurrency(order.payment.amount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status</span>
                                <span>{order.payment.status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Processor</span>
                                <span>{order.payment.paymentProcessorType}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Export - Default
export default OrderPage;
