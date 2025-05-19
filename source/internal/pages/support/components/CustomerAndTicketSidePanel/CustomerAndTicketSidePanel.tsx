'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

// Dependencies - Main Components
import { CustomerTicketHeader } from './CustomerAndTicketSidePanelHeader';
import { CustomerDetails } from './CustomerView/CustomerDetails';
import { CustomerOrdersList } from './CustomerView/CustomerOrdersList';
import { TicketDetails } from './TicketView/TicketDetails';

// Dependencies - Enums
import { CustomerAndTicketSidePanelView } from './CustomerAndTicketSidePanelTypes';

// Dependencies - API
import {
    SupportTicketsPrivilegedQuery,
    SupportTicketAccountAndCommerceOrdersPrivelegedQuery
} from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Hooks,
import usePrevious from '@project/source/utilities/react/usePrevious';

// Component - CustomerTicketDetails
export interface CustomerTicketDetailsInterface {
    ticket?: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0]
    account?: SupportTicketAccountAndCommerceOrdersPrivelegedQuery['accountPrivileged']
    commerceOrders?: SupportTicketAccountAndCommerceOrdersPrivelegedQuery['commerceOrdersPrivileged']['items']
}
export function CustomerAndTicketSidePanel(properties: CustomerTicketDetailsInterface) {
    const previousTicketId = usePrevious(properties.ticket?.id);
    const [selectedView, setSelectedView] = React.useState<CustomerAndTicketSidePanelView>(CustomerAndTicketSidePanelView.Customer);

    return (
        <DialogPrimitive.Root open={!!properties.ticket}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Content
                    className="fixed right-0 top-[3.5rem] h-[calc(100vw - 3.5rem)] w-[390px] border-l border-light-3 dark:border-dark-3 bg-white dark:bg-dark-1 focus:outline-none transition-transform data-[state=open]:translate-x-0 data-[state=closed]:translate-x-full"
                    forceMount
                >
                    <CustomerTicketHeader
                        selectedView={selectedView}
                        onViewChange={setSelectedView}
                    />
                    {selectedView === CustomerAndTicketSidePanelView.Customer && (
                        <>
                            <CustomerDetails account={properties.account} />
                            <CustomerOrdersList
                                orders={properties.commerceOrders}
                                changed={properties.ticket?.id !== previousTicketId}
                            />
                        </>
                    )}
                    {selectedView === CustomerAndTicketSidePanelView.Ticket && (
                        <TicketDetails ticket={properties.ticket} />
                    )}
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}