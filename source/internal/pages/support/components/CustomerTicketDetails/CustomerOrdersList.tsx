'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { ScrollArea } from '@structure/source/common/interactions/ScrollArea';
import { CustomerSelectedOrderSidePanel } from './CustomerSelectedOrderSidePanel';

// Dependencies - Assets
import { ArrowRight } from '@phosphor-icons/react';

const orders = [
    {
        id: '123a4567b',
        date: '2025-03-05T17:46:49.980Z',
        status: 'Unfulfilled',
    },
    {
        id: '890c1234d',
        date: '2025-02-12T13:14:49.980Z',
        status: 'Shipped',
    },
    {
        id: '567e8901f',
        date: '2024-11-25T20:20:12.980Z',
        status: 'Processing',
    },
    {
        id: '234g5678h',
        date: '2024-10-18T17:46:49.980Z',
        status: 'Delivered',
    },
    {
        id: '456i7890j',
        date: '2025-01-01T14:42:49.980Z',
        status: 'Delivered',
    },
];

// Component - CustomerOrdersList
export interface CustomerOrdersListInterface {
    changed?: boolean;
}
export function CustomerOrdersList(properties: CustomerOrdersListInterface) {
    const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);

    React.useEffect(() => {
        setSelectedOrderId(null);
    }, [properties.changed])

    return (
        <ScrollArea className="flex-grow py-1">
            
            {orders.map((order) => (
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
                order={orders.find((order) => order.id === selectedOrderId)!}
                onClose={() => setSelectedOrderId(null)}
            />

        </ScrollArea>
    );
}