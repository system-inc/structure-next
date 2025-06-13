'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { Badge } from '@structure/source/common/notifications/Badge';
import { Button } from '@structure/source/common/buttons/Button';
import { BorderContainer } from '../../BorderContainer';

// Dependencies - API
import { SupportTicketAccountAndCommerceOrdersPrivelegedQuery } from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Assets
import { ArrowLeft, Bag, CaretRight, Copy, HouseLine, MoneyWavy } from '@phosphor-icons/react';

// Dependencies - Utilities
import { formatDateToShortDateWithTime } from '@structure/source/utilities/Time';

// Dependencies - Animations
import { useSpring, animated, easings } from '@react-spring/web';

// Component - CustomerSelectedOrder
export interface CustomerSelectedOrderProperties {
    order?: SupportTicketAccountAndCommerceOrdersPrivelegedQuery['commerceOrdersPrivileged']['items'][0];
    onClose: () => void;
}
export function CustomerSelectedOrderSidePanel(properties: CustomerSelectedOrderProperties) {
    // Properties
    const order = properties.order;

    // State
    const [isVisible, setIsVisible] = React.useState(!!order);
    const [localOrder, setLocalOrder] = React.useState(order);

    // Hooks
    // Animation for the panel position
    const panelStyles = useSpring({
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        config: {
            duration: 120,
            easing: easings.easeInOutQuad,
        },
        onRest: () => {
            // Clear the local order only when the panel is fully hidden
            if(!isVisible) {
                setLocalOrder(undefined);
                properties.onClose();
            }
        },
    });

    // Effect to update visibility and local order when `order` changes
    React.useEffect(
        function () {
            if(order) {
                setLocalOrder(order); // Update local order when a new order is provided
                setIsVisible(true); // Show the panel
            }
            else {
                setIsVisible(false); // Hide the panel
            }
        },
        [order],
    );

    // Render the component
    return (
        <animated.div
            style={{ ...panelStyles }}
            className="fixed right-0 top-0 mt-14 flex h-[calc(100vh-3.5rem)] w-[390px] flex-col border-l border-light-3 bg-opsis-background-primary dark:border-dark-3"
        >
            <BorderContainer>
                <Button
                    variant="contrast"
                    icon={ArrowLeft}
                    onClick={() => setIsVisible(false)} // Trigger animation to hide the panel
                />
            </BorderContainer>
            {localOrder && (
                <>
                    <div className="flex flex-col gap-2 border-b px-4 py-6">
                        <div className="text-neutral-500 font-medium">Order {localOrder.id}</div>
                        <div className="flex gap-2">
                            <Badge variant="success" size="large">
                                Paid
                            </Badge>
                            <Badge variant="info" size="large">
                                Unfulfilled
                            </Badge>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <Button variant="light" icon={Copy} iconPosition="left">
                                Duplicate
                            </Button>
                            <Button variant="light" icon={MoneyWavy} iconPosition="left">
                                Refund
                            </Button>
                            <Button variant="light">Cancel</Button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 border-b px-4 py-6">
                        <div className="flex flex-row gap-4">
                            <span className="font-regular">Created at</span>
                            <span className="font-regular">
                                {formatDateToShortDateWithTime(new Date(localOrder.createdAt))}
                            </span>
                        </div>
                        <div className="flex flex-row gap-4">
                            <span className="font-regular">Total</span>
                            <span className="font-regular">$320</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 border-b px-4 py-6">
                        <div className="mb-4 flex items-center gap-2">
                            <div className="relative h-4 w-4">
                                <HouseLine />
                            </div>
                            <span className="font-regular">Shipping Address</span>
                        </div>
                        <div className="grid grid-cols-[90px_1fr] gap-2">
                            <span className="font-regular">Name</span>
                            <span className="font-regular">Anakin Skywalker</span>
                            <span className="font-regular">City</span>
                            <span className="font-regular">Wroclaw</span>
                            <span className="font-regular">Street</span>
                            <span className="font-regular">Komedy 26/24</span>
                            <span className="font-regular">Code</span>
                            <span className="font-regular">22-424</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 border-b px-4 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="relative h-4 w-4">
                                    <Bag />
                                </div>
                                <span className="font-regular">Detailed Bag</span>
                            </div>
                            <div className="relative h-4 w-4">
                                <CaretRight />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </animated.div>
    );
}
