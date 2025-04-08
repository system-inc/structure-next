// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
// import { Button } from '@project/source/ui/base/Button';
import Button from '@structure/source/common/buttons/Button';
import { InputSelect } from '@structure/source/common/forms/InputSelect';
import { Container } from '../Container';

// Dependencies - Hooks
// import { useSupportTicketAssign } from '../../hooks/useSupportTicketAssign';

// Dependencies - Assets
import {
    Star,
    PlusCircle,
} from '@phosphor-icons/react';

// Dependencies - API
import {
    SupportAllSupportProfilesQuery,
    SupportTicketsPrivilegedQuery,
    SupportTicketStatus,
} from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Constants
import { ticketStatusOptions } from '@structure/source/internal/pages/support/constants';

// Component - TicketStatusAndAssignment
export interface TicketStatusAndAssignmentInterface {
    ticketId: string;
    ticketStatus: SupportTicketStatus;
    supportProfiles?: SupportAllSupportProfilesQuery['supportAllSupportProfiles'];
    isLoadingProfiles: boolean;
    assignedToProfileId: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0]['assignedToProfileId'];
    onTicketStatusChange: (status: SupportTicketStatus) => void;
}
export function TicketStatusAndAssignment(properties: TicketStatusAndAssignmentInterface) {
    // Properties
    const {
        ticketId,
        ticketStatus,
        supportProfiles,
        isLoadingProfiles,
        assignedToProfileId,
        onTicketStatusChange,
    } = properties;

    // Support Profile options
    // an array of all support profiles options with "Unassigned" as the first option
    // const supportProfileOptions = supportProfiles
    //     ? supportProfiles.map((profile) => ({
    //             label: profile.displayName,
    //             value: profile.username,
    //         }))
    //     : [];

    // Render the component
    return (
        <Container>
            <div className="flex items-center gap-2 w-[140px]">
                <InputSelect
                    className="w-full"
                    items={ticketStatusOptions}
                    defaultValue={ticketStatus}
                    onChange={function (value) {
                        onTicketStatusChange(value as SupportTicketStatus)
                    }}
                />
                {/* <InputSelect
                    className="w-full"
                    items={[
                        { label: 'Unassigned', value: '' },
                        ...(supportProfileOptions || []),
                    ]}
                    defaultValue={assignedToProfileId}
                    loadingItems={properties.isLoadingProfiles}
                    onChange={function (value) {
                        console.log('Assigned to:', value);
                    }}
                /> */}
                {/* <Button
                    variant="light"
                    icon={PlusCircle}
                    iconPosition="left"
                >
                    Assign Person
                </Button> */}
            </div>
            <div className="relative h-4 w-4">
                <Star />
            </div>
        </Container>
    );
}