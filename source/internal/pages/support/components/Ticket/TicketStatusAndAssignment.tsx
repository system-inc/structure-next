// Dependencies - Main Components
// import { Button } from '@project/source/ui/base/Button';
import Button from '@structure/source/common/buttons/Button';
import { InputSelect } from '@structure/source/common/forms/InputSelect';
import { BorderContainer } from '../BorderContainer';

// Dependencies - Assets
import { Star, PlusCircle } from '@phosphor-icons/react';

// Dependencies - API
import { SupportTicketsPrivilegedQuery } from '@project/source/api/GraphQlGeneratedCode';

// Dependencies - Constants
import { STATUS_OPTIONS } from '@structure/source/internal/pages/support/constants';

// Component - TicketStatusAndAssignment
export interface TicketStatusAndAssignmentInterface {
    status: string;
    assignedToProfileId: SupportTicketsPrivilegedQuery['supportTicketsPrivileged']['items'][0]['assignedToProfileId'];
}
export function TicketStatusAndAssignment(properties: TicketStatusAndAssignmentInterface) {
    // Properties
    const { status, assignedToProfileId } = properties;

    // Render the component
    return (
        <BorderContainer>
            <div className="flex items-center gap-2 w-[140px]">
                <InputSelect
                    className="w-full"
                    items={STATUS_OPTIONS}
                    defaultValue="Open"
                    // onChange={function (value) {
                    //     onStatusChange(value || 'Open');
                    // }}
                />
                <Button
                    variant="light"
                    icon={PlusCircle}
                    iconPosition="left"
                >
                    Assign Person
                </Button>
            </div>
            <div className="relative h-4 w-4">
                <Star />
            </div>
        </BorderContainer>
    );
}