'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { ScrollArea } from '@structure/source/common/interactions/ScrollArea';
import { CustomerSelectedOrderSidePanel } from './CustomerSelectedOrderSidePanel';

// Dependencies - API
import { SupportTicketAccountAndCommerceOrdersPrivelegedQuery } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Assets
import { ArrowRight } from '@phosphor-icons/react';

// Component - CustomerOrdersList
export interface CustomerOrdersListInterface {
    orders?: SupportTicketAccountAndCommerceOrdersPrivelegedQuery['commerceOrdersPrivileged']['items'];
    changed?: boolean;
}
export function CustomerOrdersList(properties: CustomerOrdersListInterface) {
    const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);

    React.useEffect(() => {
        setSelectedOrderId(null);
    }, [properties.changed])

    return (
        <ScrollArea className="flex-grow py-1">

            { !!properties.orders?.length ? (
                <>
                    {properties.orders?.map((order) => (
                        <div
                            key={order.id}
                            className="flex flex-col gap-4 mx-4 my-3 p-4 py-3 border rounded-lg cursor-pointer hover:bg-light-2 dark:hover:bg-dark-2"
                            onClick={() => setSelectedOrderId(order.id)}
                        >
                            <div className="flex flex-row items-center justify-between gap-2">
                                <div className="text-neutral-500 font-medium">
                                    Order {order.id}
                                </div>
                                <div className="relative h-4 w-4">
                                    <ArrowRight />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* if selectedOrderId is not null and an object with an id equal to the selectedOrderId is in the list of orders, show the CustomerSelectedOrder */}
                    <CustomerSelectedOrderSidePanel
                        order={properties.orders.find((order) => order.id === selectedOrderId)!}
                        onClose={() => setSelectedOrderId(null)}
                    />
                </>
            ) : (
                <div className="flex flex-row items-center justify-start m-4 text-neutral-500">
                    No orders found
                </div>
            )}

        </ScrollArea>
    );
}