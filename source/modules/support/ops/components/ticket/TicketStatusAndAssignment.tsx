// Dependencies - React and Next.js
import React from 'react';

// Dependencies - Main Components
import { BorderContainer } from '../BorderContainer';
import { Button } from '@structure/source/components/buttons/Button';

// Dependencies - Assets
import { StarIcon, UserPlusIcon } from '@phosphor-icons/react';

// Dependencies - API
import { SupportTicketStatus } from '@structure/source/api/graphql/GraphQlGeneratedCode';
import type {
    SupportAllSupportProfilesQuery,
    SupportTicketsPrivilegedQuery,
} from '@structure/source/api/graphql/GraphQlGeneratedCode';

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
    // Get assigned profile info
    const assignedProfile = properties.supportProfiles?.find(
        (profile) => profile.username === properties.assignedToProfileId,
    );

    // Render the component
    return (
        <BorderContainer>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {assignedProfile ? (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Assigned to:</span>
                            <span className="text-sm font-medium">{assignedProfile.displayName}</span>
                        </div>
                    ) : (
                        <Button
                            variant="Ghost"
                            className="flex items-center gap-2 px-3 py-1.5"
                            onClick={function () {
                                // TODO: Implement assignment modal or dropdown
                                console.log('Assign ticket');
                            }}
                        >
                            <UserPlusIcon className="h-4 w-4" />
                            <span className="text-sm">Assign</span>
                        </Button>
                    )}
                </div>

                <Button
                    variant="Ghost"
                    className="p-2"
                    onClick={function () {
                        // TODO: Implement star/favorite functionality
                        console.log('StarIcon ticket');
                    }}
                >
                    <StarIcon className="h-4 w-4" />
                </Button>
            </div>
        </BorderContainer>
    );
}
