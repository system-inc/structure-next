'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - CustomerTicket
import { CustomerAndTicketSidePanelView } from './CustomerAndTicketSidePanelTypes';

// Dependencies - Main Components
import { SegmentedControl, SegmentedControlItem } from '@project/source/ui/base/SegmentedControl';
import { Container } from '../Container';

// Component - CustomerTicketHeader
interface CustomerTicketHeaderInterface {
    selectedView: CustomerAndTicketSidePanelView;
    onViewChange: ( view: CustomerAndTicketSidePanelView ) => void;
}
export function CustomerTicketHeader(properties: CustomerTicketHeaderInterface) {
    // Function to handle the user changing the view
    function handleUpdateView(view: string) {
        properties.onViewChange(view as CustomerAndTicketSidePanelView);
    }

    // Render the component
    return (
        <Container>
            <SegmentedControl
                size="default"
                variant="default"
                value={properties.selectedView}
                onValueChange={handleUpdateView}
            >
                <SegmentedControlItem value={CustomerAndTicketSidePanelView.Customer}>
                    Customer
                </SegmentedControlItem>
                <SegmentedControlItem value={CustomerAndTicketSidePanelView.Ticket}>
                    Ticket
                </SegmentedControlItem>
            </SegmentedControl>
        </Container>
    );
}
