'use client'; // This component uses client-only features

// Dependencies - React and Next.js
import React from 'react';

// Dependencies - CustomerTicket
import { CustomerTicketDetailView } from './CustomerTicketDetailTypes';

// Dependencies - Main Components
import { SegmentedControl, SegmentedControlItem } from '@project/source/ui/base/SegmentedControl';
import { Container } from '../Container';

// Component - CustomerTicketHeader
export function CustomerTicketHeader() {
    const [selectedView, setSelectedView] = React.useState<CustomerTicketDetailView>(CustomerTicketDetailView.Customer);

    // Function to handle the user changing the view
    function handleUpdateView(view: string) {
        setSelectedView(view as CustomerTicketDetailView);
    }

    // Render the component
    return (
        <Container>
            <SegmentedControl
                size="default"
                variant="default"
                value={selectedView}
                onValueChange={handleUpdateView}
            >
                <SegmentedControlItem value={CustomerTicketDetailView.Customer}>
                    Customer
                </SegmentedControlItem>
                <SegmentedControlItem value={CustomerTicketDetailView.Ticket}>
                    Ticket
                </SegmentedControlItem>
            </SegmentedControl>
        </Container>
    );
}
