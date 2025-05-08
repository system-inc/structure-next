'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import InternalNavigationTrail from '@structure/source/internal/layouts/navigation/InternalNavigationTrail';
import { PlaceholderAnimation } from '@structure/source/common/animations/PlaceholderAnimation';
import { Button } from '@structure/source/common/buttons/Button';

// Dependencies - Utilities
import { formatDistanceToNow } from 'date-fns';

// Dependencies - Icons
import CopyIcon from '@structure/assets/icons/interface/CopyIcon.svg';
import ReloadIcon from '@structure/assets/icons/interface/ReloadIcon.svg';

// Dependencies - API
import { useQuery } from '@apollo/client';
import {
    CommerceOrdersPrivilegedDocument,
    ColumnFilterConditionOperator,
} from '@project/source/api/GraphQlGeneratedCode';

// Component - OrderPage
export interface OrderPageProperties {
    orderId: string;
}
export function OrderPage(properties: OrderPageProperties) {
    // State
    const [isJsonVisible, setIsJsonVisible] = React.useState(false);

    // Query
    const orderQueryState = useQuery(CommerceOrdersPrivilegedDocument, {
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

    function copyToClipboard(text: string) {
        navigator.clipboard.writeText(text);
    }

    function formatDate(date: string) {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
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
                        <PlaceholderAnimation className="h-40 w-full rounded-lg" />
                        <PlaceholderAnimation className="h-40 w-full rounded-lg" />
                    </div>
                </div>
            </div>
        );
    }

    // Render error state
    if(orderQueryState.error) {
        return (
            <div className="px-6 py-4 text-center">
                <div className="mb-4 text-red-600">Error: {orderQueryState.error.message}</div>
                <Button
                    onClick={function () {
                        orderQueryState.refetch();
                    }}
                >
                    <ReloadIcon className="mr-2 h-4 w-4" />
                    Retry
                </Button>
            </div>
        );
    }

    // Get the order from the response
    const order = orderQueryState.data?.commerceOrdersPrivileged.items[0];
    if(!order) {
        return <div className="px-6 py-4">Order not found</div>;
    }

    // Render the component
    return (
        <div className="px-6 py-4">
            {/* Header */}
            <InternalNavigationTrail />
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1>Order {order.identifier}</h1>
                    <Button
                        onClick={function () {
                            copyToClipboard(order.identifier);
                        }}
                    >
                        <CopyIcon className="mr-2 h-4 w-4" />
                        Copy ID
                    </Button>
                    <div className="rounded-lg border bg-purple-500 px-2 py-1">{order.status}</div>
                </div>
                <div className="text-sm">Created {formatDate(order.createdAt)}</div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Action Buttons */}
                <div className="flex-grow rounded-lg border border-light-4 p-5 md:col-span-2 dark:border-dark-4 dark:shadow-dark-4/30">
                    <div className="flex gap-4">
                        <Button variant="primary">Mark as Fulfilled</Button>
                        <Button>Send Email</Button>
                        <Button>Print Invoice</Button>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="flex-grow rounded-lg border border-light-4 p-5 dark:border-dark-4 dark:shadow-dark-4/30">
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
                <div className="flex-grow rounded-lg border border-light-4 p-5 dark:border-dark-4 dark:shadow-dark-4/30">
                    <h2 className="mb-4 text-lg font-medium">Customer Information</h2>
                    <div className="space-y-4">
                        <div>
                            <div className="font-medium">Email</div>
                            <div>{order.emailAddress}</div>
                            {/* {order.beneficiaryEmailAddress && (
                                <div className="text-neutral-500 mt-1 text-sm">
                                    Beneficiary: {order.beneficiaryEmailAddress}
                                </div>
                            )} */}
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
                <div className="flex-grow rounded-lg border border-light-4 p-5 dark:border-dark-4 dark:shadow-dark-4/30">
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
                                    {/* <div>Fulfilled: {item.fulfilledQuantity}</div> */}
                                    {/* <div>Shipped: {item.shippedQuantity}</div> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Details */}
                {order.payment && (
                    <div className="flex-grow rounded-lg border border-light-4 p-5 dark:border-dark-4 dark:shadow-dark-4/30">
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

                {/* Order Timeline */}
                <div className="flex-grow rounded-lg border border-light-4 p-5 md:col-span-2 dark:border-dark-4 dark:shadow-dark-4/30">
                    <h2 className="mb-4 text-lg font-medium">Order Timeline</h2>
                    <div className="ml-4 border-l-2 border-gray-200">
                        {[
                            {
                                date: order.createdAt,
                                title: 'Order Created',
                                description: 'Order was placed successfully',
                            },
                            // Add more events based on order history
                        ].map((event, index) => (
                            <div key={index} className="relative mb-4 ml-6">
                                <div className="bg-blue-500 absolute -left-[1.875rem] mt-1.5 h-3 w-3 rounded-full" />
                                <div className="font-medium">{event.title}</div>
                                <div className="text-sm text-gray-500">{formatDate(event.date)}</div>
                                <div className="text-sm">{event.description}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Raw Data Viewer */}
                <div className="flex-grow rounded-lg border border-light-4 p-5 md:col-span-2 dark:border-dark-4 dark:shadow-dark-4/30">
                    <Button onClick={() => setIsJsonVisible(!isJsonVisible)}>
                        {isJsonVisible ? 'Hide' : 'Show'} Raw Data
                    </Button>
                    {isJsonVisible && (
                        <pre className="mt-4 overflow-auto rounded-lg p-4">{JSON.stringify(order, null, 2)}</pre>
                    )}
                </div>
            </div>
        </div>
    );
}

// Export - Default
export default OrderPage;
