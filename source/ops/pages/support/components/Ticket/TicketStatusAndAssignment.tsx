// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
// import { Button } from '@project/app/_components/base/Button';
// import { Button } from '@structure/source/common/buttons/Button';
import { InputSelect } from '@structure/source/common/forms/InputSelect';
import { BorderContainer } from '../BorderContainer';

// Dependencies - Hooks
// import { useSupportTicketAssign } from '../../hooks/useSupportTicketAssign';

// Dependencies - Assets
import {
    Star,
    // PlusCircle,
} from '@phosphor-icons/react';

// Dependencies - API
import {
    SupportAllSupportProfilesQuery,
    SupportTicketsPrivilegedQuery,
    SupportTicketStatus,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

// Dependencies - Constants
import { ticketStatusOptions } from '@structure/source/ops/pages/support/constants';

// Component - TicketStatusAndAssignment
export interface TicketStatusAndAssignmentProperties {
    ticketId: string;
    ticketStatus: SupportTicketStatus;
    supportProfiles?: SupportAllSupportProfilesQuery['supportAllSupportProfiles'];
    isLoadingProfiles: boolean;
    assignedToProfileId: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0]['assignedToProfileId'];
    onTicketStatusChange: (ticketId: string, status: SupportTicketStatus) => void;
}
export function TicketStatusAndAssignment(properties: TicketStatusAndAssignmentProperties) {
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
        <BorderContainer>
            <div className="flex w-[140px] items-center gap-2">
                <InputSelect
                    className="w-full"
                    items={ticketStatusOptions}
                    defaultValue={properties.ticketStatus}
                    onChange={function (value) {
                        properties.onTicketStatusChange(properties.ticketId, value as SupportTicketStatus);
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
        </BorderContainer>
    );
}
